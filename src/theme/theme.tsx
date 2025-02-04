import React from 'react';
import { ThemeProviderContext } from './ThemeContext';

interface ThemeProps {
  children: React.ReactNode;
}

const Theme: React.FC<ThemeProps> = ({ children }) => {
  return <ThemeProviderContext>{children}</ThemeProviderContext>;
};

export default Theme;
