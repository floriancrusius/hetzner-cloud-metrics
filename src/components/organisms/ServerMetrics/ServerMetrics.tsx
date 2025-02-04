import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import FilterRow from '../../molecules/FilterRow';
import ResponsiveLineChart from '../../molecules/ResponsiveLineChart/ResponsiveLineChart';

interface ServerMetricsProps {
  projectId: string;
  serverId: string;
}

interface FormattedData {
  timestamp: string;
  [key: string]: number | string;
}

const metricsOptions = {
  cpu: ['cpu'],
  disk: [
    'disk.0.iops.read',
    'disk.0.iops.write',
    'disk.0.bandwidth.read',
    'disk.0.bandwidth.write',
  ],
  network: [
    'network.0.pps.out',
    'network.0.pps.in',
    'network.0.bandwidth.in',
    'network.0.bandwidth.out',
  ],
};

const lineColors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#387908',
  '#ff0000',
  '#00ff00',
  '#0000ff',
];

const ServerMetrics: React.FC<ServerMetricsProps> = ({
  serverId,
  projectId,
}) => {
  const [data, setData] = useState<FormattedData[]>([]);
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - 7)).toISOString();
  });
  const [endDate, setEndDate] = useState<string>(() =>
    new Date().toISOString()
  );
  const [step, setStep] = useState<string>('hour');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['cpu']);

  useEffect(() => {
    const fetchMetrics = async () => {
      const stepInSeconds = {
        minute: 60,
        hour: 3600,
        day: 86400,
        quarterDay: 21600,
        halfDay: 43200,
      }[step];

      try {
        const response = await window.api.getServerMetrics(
          projectId,
          serverId,
          selectedMetrics.join(','),
          startDate,
          endDate,
          stepInSeconds || 60
        );
        const formattedData: FormattedData[] = [];

        selectedMetrics.forEach((metric) => {
          const detailedMetrics =
            metricsOptions[metric as keyof typeof metricsOptions];
          detailedMetrics.forEach((detailedMetric) => {
            const metricData =
              response.time_series[detailedMetric]?.values || [];
            metricData.forEach(([timestamp, value]: [number, string]) => {
              const date = new Date(timestamp * 1000).toLocaleString();
              const existingEntry = formattedData.find(
                (entry) => entry.timestamp === date
              );
              if (existingEntry) {
                existingEntry[detailedMetric] = parseFloat(value);
              } else {
                formattedData.push({
                  timestamp: date,
                  [detailedMetric]: parseFloat(value),
                });
              }
            });
          });
        });

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching server metrics:', error);
      }
    };

    fetchMetrics();
  }, [serverId, startDate, endDate, step, selectedMetrics]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Server Metrics
      </Typography>
      <FilterRow
        startDate={startDate}
        endDate={endDate}
        step={step}
        selectedMetrics={selectedMetrics}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onStepChange={setStep}
        onMetricsChange={setSelectedMetrics}
      />
      {selectedMetrics.includes('cpu') && (
        <ResponsiveLineChart
          data={data}
          metrics={metricsOptions.cpu}
          title="CPU Metrics"
          lineColors={lineColors}
        />
      )}
      {selectedMetrics.includes('disk') && (
        <ResponsiveLineChart
          data={data}
          metrics={metricsOptions.disk.filter((metric) =>
            metric.includes('iops')
          )}
          title="Disk IOPS Metrics"
          lineColors={lineColors}
        />
      )}
      {selectedMetrics.includes('disk') && (
        <ResponsiveLineChart
          data={data}
          metrics={metricsOptions.disk.filter((metric) =>
            metric.includes('bandwidth')
          )}
          title="Disk Bandwidth Metrics"
          lineColors={lineColors}
        />
      )}
      {selectedMetrics.includes('network') && (
        <ResponsiveLineChart
          data={data}
          metrics={metricsOptions.network.filter((metric) =>
            metric.includes('pps')
          )}
          title="Network IOPS Metrics"
          lineColors={lineColors}
        />
      )}
      {selectedMetrics.includes('network') && (
        <ResponsiveLineChart
          data={data}
          metrics={metricsOptions.network.filter((metric) =>
            metric.includes('bandwidth')
          )}
          title="Network Bandwidth Metrics"
          lineColors={lineColors}
        />
      )}
      {/* {Object.entries(metricsOptions).map(([category, metrics]) =>
        selectedMetrics.includes(category) ? (
          <ResponsiveLineChart
            key={category}
            data={data}
            metrics={metrics}
            title={`${
              category.charAt(0).toUpperCase() + category.slice(1)
            } Metrics`}
            lineColors={lineColors}
          />
        ) : null
      )} */}
    </Box>
  );
};

export default ServerMetrics;
