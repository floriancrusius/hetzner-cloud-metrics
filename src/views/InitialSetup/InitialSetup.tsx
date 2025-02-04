import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid2,
  List,
  ListItem,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

interface Project {
  id: string;
  name: string;
  apiKey: string;
}

const InitialSetup: React.FC = () => {
  const [projects, setProjects] = useState<{ [id: string]: Project }>({});
  const [projectName, setProjectName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      const storedProjects = await window.api.loadProjects();
      if (storedProjects) {
        setProjects(storedProjects);
      }
    };

    loadProjects();
  }, []);

  const handleAddProject = () => {
    const id = uuidv4();
    const newProject = { id, name: projectName, apiKey };
    setProjects((prevProjects) => ({
      ...prevProjects,
      [id]: newProject,
    }));
    setProjectName('');
    setApiKey('');
  };

  const handleRemoveProject = (id: string) => {
    setProjects((prevProjects) => {
      const { [id]: _, ...rest } = prevProjects;
      return rest;
    });
  };

  const handleSaveProjects = async () => {
    await window.api.saveProjects(projects);

    const storedProjects = await window.api.loadProjects();
    if (storedProjects) {
      setProjects(storedProjects);
      navigate('/');
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <Grid2 container spacing={2} direction="column" alignContent="center">
      <Grid2 size={{ lg: 6, xs: 12 }}>
        <Typography variant="h2" align="center">
          Initial Setup
        </Typography>
      </Grid2>
      <Grid2 size={{ lg: 6, xs: 12 }}>
        <Card raised sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardHeader title="Projects" />
          <CardContent>
            <Grid2 container spacing={2} direction="column">
              <Grid2>
                <List>
                  {Object.entries(projects).map(([id, project]) => (
                    <ListItem key={id}>
                      {project.name}: {maskApiKey(project.apiKey)}
                      <Button onClick={() => handleRemoveProject(id)}>
                        Remove
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Grid2>
              <Grid2>
                <Paper variant="outlined" sx={{ padding: '20px' }}>
                  <Typography variant="h6" gutterBottom>
                    Add Project
                  </Typography>
                  <Grid2 container spacing={2} alignContent="center">
                    <Grid2>
                      <TextField
                        size="small"
                        label="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </Grid2>
                    <Grid2>
                      <TextField
                        size="small"
                        label="API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </Grid2>
                    <Grid2>
                      <Button variant="outlined" onClick={handleAddProject}>
                        Add Project
                      </Button>
                    </Grid2>
                  </Grid2>
                </Paper>
              </Grid2>
              <Grid2 size={{ lg: 6, xs: 12 }}>
                <Button onClick={handleSaveProjects}>Save Settings</Button>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default InitialSetup;
