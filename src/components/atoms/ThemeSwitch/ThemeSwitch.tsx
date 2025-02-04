import React from 'react';
import { IconButton } from '@mui/material';
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';

import { useThemeContext } from '../../../theme/ThemeContext';

const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme.palette.mode === 'dark' ? (
        <LightModeOutlined />
      ) : (
        <DarkModeOutlined />
      )}
    </IconButton>
  );
};

export default ThemeSwitch;
