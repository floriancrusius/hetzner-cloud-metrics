import React, { useState, useEffect, useRef } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from '@mui/material';

interface MetricsSelectorProps {
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
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

type MetricsOptionKey = keyof typeof metricsOptions;

const MetricsSelector: React.FC<MetricsSelectorProps> = ({
  selectedMetrics,
  onMetricsChange,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMetricChange = (event: any) => {
    const value = event.target.value;
    if (value.length > 0) {
      onMetricsChange(value);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FormControl variant="outlined" size="small" fullWidth ref={dropdownRef}>
      <InputLabel>Metrics</InputLabel>
      <Select
        multiple
        value={selectedMetrics}
        onChange={handleMetricChange}
        label="Metrics"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderValue={(selected) =>
          (selected as string[]).sort((a, b) => a.localeCompare(b)).join(', ')
        }
      >
        {Object.keys(metricsOptions).map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={selectedMetrics.includes(option)} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MetricsSelector;
