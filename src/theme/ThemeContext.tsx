import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeContextProps {
  toggleTheme: () => void;
  theme: Theme;
}

const themes = {
  light: createTheme({
    palette: {
      mode: 'light',
    },
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
    },
  }),
};

type ThemeKey = keyof typeof themes;
interface Settings {
  theme: ThemeKey;
  [key: string]: any;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProviderContext: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>({ theme: 'light' });
  const [theme, setTheme] = useState<Theme>(themes.light);

  useEffect(() => {
    const loadSettings = async () => {
      const storedSettings: Settings = await window.api.loadSettings();
      if (storedSettings) {
        setSettings(storedSettings);
        setTheme(themes[storedSettings.theme]);
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme: ThemeKey = settings.theme === 'light' ? 'dark' : 'light';
    const updatedSettings = { ...settings, theme: newTheme };
    await window.api.saveSettings(updatedSettings);
    setSettings(updatedSettings);
    setTheme(themes[newTheme]);
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useThemeContext must be used within a ThemeProviderContext'
    );
  }
  return context;
};
