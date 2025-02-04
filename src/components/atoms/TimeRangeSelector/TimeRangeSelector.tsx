import React from 'react';
import { TextField, Stack } from '@mui/material';
import dayjs from 'dayjs';

interface TimeRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const today = dayjs().startOf('day');
  const minStartDate = today.subtract(30, 'day');
  const minEndDate = minStartDate;

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newStartDate = dayjs(event.target.value).startOf('day');

    // Ensure start date is within the allowed range
    if (newStartDate.isBefore(minStartDate)) {
      newStartDate = minStartDate;
    }

    // If startDate is after endDate, adjust endDate
    let updatedEndDate = dayjs(endDate);
    if (newStartDate.isAfter(updatedEndDate)) {
      updatedEndDate = newStartDate.endOf('day');
      onEndDateChange(updatedEndDate.toISOString());
    }

    onStartDateChange(newStartDate.toISOString());
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newEndDate = dayjs(event.target.value).endOf('day');

    // Ensure end date is within the allowed range
    if (newEndDate.isBefore(minEndDate)) {
      newEndDate = minEndDate;
    }

    // If endDate is before startDate, adjust startDate
    let updatedStartDate = dayjs(startDate);
    if (newEndDate.isBefore(updatedStartDate)) {
      updatedStartDate = newEndDate.startOf('day');
      onStartDateChange(updatedStartDate.toISOString());
    }

    onEndDateChange(newEndDate.toISOString());
  };

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Stack spacing={1}>
        <TextField
          label="Start Date"
          type="date"
          value={dayjs(startDate).format('YYYY-MM-DD')}
          onChange={handleStartDateChange}
          variant="outlined"
          size="small"
        />
      </Stack>
      <Stack spacing={1}>
        <TextField
          label="End Date"
          type="date"
          value={dayjs(endDate).format('YYYY-MM-DD')}
          onChange={handleEndDateChange}
          variant="outlined"
          size="small"
        />
      </Stack>
    </Stack>
  );
};

export default TimeRangeSelector;
export type { TimeRangeSelectorProps };
