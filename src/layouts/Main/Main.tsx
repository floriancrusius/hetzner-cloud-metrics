import React, { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, Button, Typography } from '@mui/material';
import { Route } from '../../router/routes';
import ThemeSwitch from '../../components/atoms/ThemeSwitch/ThemeSwitch';

interface MainProps {
  children: React.ReactNode;
  routes: Route[];
}
interface Project {
  id: string;
  name: string;
  apiKey: string;
}
const Main: FC<MainProps> = ({ children, routes }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<{ [id: string]: Project }>({});

  useEffect(() => {
    const loadProjects = async () => {
      const storedProjects = await window.api.loadProjects();
      if (storedProjects) {
        setProjects(storedProjects);
      } else {
        navigate('/initial-setup');
      }
    };
    if (
      location.pathname !== '/initial-setup' &&
      !Object.keys(projects).length
    ) {
      loadProjects();
    }
  }, [location.pathname, navigate]);

  const handleClick = useCallback(
    (path: string) => {
      if (location.pathname !== path) {
        navigate(path);
      }
    },
    [location.pathname, navigate]
  );

  return (
    <Box>
      {Object.keys(projects).length ? (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Hetzner Cloud Metrics
            </Typography>
            {routes
              .filter(({ path }) => path !== '/initial-setup')
              .map(({ path, name }) => (
                <Button
                  key={path}
                  color="inherit"
                  onClick={() => handleClick(path)}
                >
                  {name}
                </Button>
              ))}
            <ThemeSwitch />
          </Toolbar>
        </AppBar>
      ) : null}
      <Box sx={{ padding: '20px' }}>{children}</Box>
    </Box>
  );
};

export default Main;
