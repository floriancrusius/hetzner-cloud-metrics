import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Paper,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid2,
  List,
  ListItem,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';

interface Project {
  id: string;
  name: string;
  apiKey: string;
}

const Settings: React.FC = () => {
  const [projects, setProjects] = useState<{ [id: string]: Project }>({});
  const [projectName, setProjectName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [projectToRemove, setProjectToRemove] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  useEffect(() => {
    const loadProjects = async () => {
      const storedProjects = await window.api.loadProjects();
      if (storedProjects) {
        setProjects(storedProjects);
      }
    };

    loadProjects();
  }, []);

  const handleAddProject = async () => {
    const id = uuidv4();
    const newProject = { id, name: projectName, apiKey };
    setProjects((prevProjects) => ({
      ...prevProjects,
      [id]: newProject,
    }));
    setProjectName('');
    setApiKey('');
    await saveProjects({ ...projects, [id]: newProject });
    showSnackbar('Project added successfully', 'success');
  };

  const handleRemoveProject = async (id: string) => {
    setProjects((prevProjects) => {
      const { [id]: _, ...rest } = prevProjects;
      return rest;
    });
    await saveProjects(
      Object.fromEntries(Object.entries(projects).filter(([key]) => key !== id))
    );
    showSnackbar('Project removed successfully', 'success');
  };

  const saveProjects = async (projectsToSave: { [id: string]: Project }) => {
    await window.api.saveProjects(projectsToSave);
    const storedProjects = await window.api.loadProjects();
    if (storedProjects) {
      setProjects(storedProjects);
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const handleOpenDialog = (id: string) => {
    setProjectToRemove(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProjectToRemove(null);
  };

  const handleConfirmRemove = async () => {
    if (projectToRemove) {
      await handleRemoveProject(projectToRemove);
    }
    handleCloseDialog();
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid2 container spacing={2} direction="column" alignContent="center">
      <Grid2 size={{ lg: 6, xs: 12 }}>
        <Typography variant="h2" align="center">
          Settings
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
                      <Button onClick={() => handleOpenDialog(id)}>
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
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Remove</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmRemove} color="primary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid2>
  );
};

export default Settings;
