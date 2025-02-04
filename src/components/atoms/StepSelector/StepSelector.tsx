import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface StepSelectorProps {
  step: string;
  onStepChange: (step: string) => void;
}

const StepSelector: React.FC<StepSelectorProps> = ({ step, onStepChange }) => {
  const handleStepChange = (event: SelectChangeEvent<string>) => {
    onStepChange(event.target.value as string);
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      fullWidth
      sx={{ minWidth: 120 }}
    >
      <InputLabel>Step</InputLabel>
      <Select value={step} onChange={handleStepChange} label="Step" fullWidth>
        <MenuItem value="minute">Minute</MenuItem>
        <MenuItem value="hour">Hour</MenuItem>
        <MenuItem value="quarterDay">Quarter Day</MenuItem>
        <MenuItem value="halfDay">Half Day</MenuItem>
        <MenuItem value="day">Day</MenuItem>
      </Select>
    </FormControl>
  );
};

export default StepSelector;
