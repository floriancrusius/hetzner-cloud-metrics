import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

interface ResponsiveLineChartProps {
  data: { timestamp: string; [key: string]: number | string }[];
  metrics: string[];
  title: string;
  lineColors: string[];
}

const ResponsiveLineChart: React.FC<ResponsiveLineChartProps> = ({
  data,
  metrics,
  title,
  lineColors,
}) => {
  const formatYAxis = (tickItem: number | string) => {
    if (typeof tickItem === 'number') {
      return tickItem.toFixed(2);
    }
    return tickItem;
  };
  const CustomTooltip: React.FC<TooltipProps<any, any>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          variant="outlined"
          elevation={2}
          sx={{ backgroundColor: 'background.default', padding: 2 }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            {`Timestamp: ${label}`}
          </Typography>
          {payload.map((entry: any, index: any) => (
            <Typography key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }

    return null;
  };

  return (
    <Box width="100%" height={400} mb={5}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis width={80} tickFormatter={formatYAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {metrics.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={lineColors[index % lineColors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ResponsiveLineChart;
