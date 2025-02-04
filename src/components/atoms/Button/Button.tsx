import { FC } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = (props) => {
  return <MuiButton {...props} />;
};

export default Button;
