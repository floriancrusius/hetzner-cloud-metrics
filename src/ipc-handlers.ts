import { ipcMain } from 'electron';
import Store from 'electron-store';
import axios from 'axios';
// Initialize the store
const store: any = new Store();

// Register IPC handlers
ipcMain.handle('get-fact', async () => {
  try {
    const response = await fetch('https://catfact.ninja/fact');
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch fact');
  }
});
ipcMain.handle('save-projects', (event, projects) => {
  store.set('projects', projects);
});

ipcMain.handle('load-projects', () => {
  return store.get('projects');
});

ipcMain.handle('reset-projects', () => {
  store.delete('projects');
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
});

ipcMain.handle('load-settings', () => {
  return store.get('settings');
});

ipcMain.handle('reset-settings', () => {
  store.delete('settings');
});

ipcMain.handle('get-servers', async (event, projectId) => {
  const projects = await store.get('projects');
  const project = projects[projectId];
  if (!project) {
    throw new Error('Project not found');
  }
  const apiKey = project.apiKey;
  const url = 'https://api.hetzner.cloud/v1/servers';
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  // console.log(`Request URL: ${url}`);
  // console.log(`Request Headers: ${JSON.stringify(headers)}`);

  try {
    const response = await axios.get(url, { headers });
    return response.data.servers;
  } catch (error) {
    console.error(`Error fetching servers: ${error.message}`);
    throw error;
  }
});

ipcMain.handle(
  'get-server-metrics',
  async (event, projectId, serverId, metrics, start, end, step) => {
    const projects = await store.get('projects');
    const project = projects[projectId];

    if (!project) {
      throw new Error('Project not found');
    }
    const apiKey = project.apiKey;
    const url = `https://api.hetzner.cloud/v1/servers/${serverId}/metrics`;
    const params = { type: metrics, start, end, step: step || 60 * 60 * 24 }; // 1 day
    const headers = {
      Authorization: `Bearer ${apiKey}`,
    };

    // console.log(`Request URL: ${url}`);
    // console.log(`Request Params: ${JSON.stringify(params)}`);
    // console.log(`Request Headers: ${JSON.stringify(headers)}`);

    try {
      const response = await axios.get(url, { headers, params });

      return response.data.metrics;
    } catch (error) {
      console.error(`Error fetching server metrics: ${error.message}`);
      throw error;
    }
  }
);
