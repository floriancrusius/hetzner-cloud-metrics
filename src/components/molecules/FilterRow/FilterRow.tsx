import React from 'react';
import { Box, Stack } from '@mui/material';
import TimeRangeSelector from '../../atoms/TimeRangeSelector';
import StepSelector from '../../atoms/StepSelector';
import MetricsSelector from '../../atoms/MetricsSelector';

interface FilterRowProps {
  startDate: string;
  endDate: string;
  step: string;
  selectedMetrics: string[];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStepChange: (step: string) => void;
  onMetricsChange: (metrics: string[]) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({
  startDate,
  endDate,
  step,
  selectedMetrics,
  onStartDateChange,
  onEndDateChange,
  onStepChange,
  onMetricsChange,
}) => {
  return (
    <Box display="flex" justifyContent="center" mb={3}>
      <Stack direction="row" spacing={2}>
        <TimeRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
        <StepSelector step={step} onStepChange={onStepChange} />
        <MetricsSelector
          selectedMetrics={selectedMetrics}
          onMetricsChange={onMetricsChange}
        />
      </Stack>
    </Box>
  );
};

export default FilterRow;
