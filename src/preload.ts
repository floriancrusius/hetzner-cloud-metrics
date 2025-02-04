// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  saveProjects: async (projects: any) => {
    return ipcRenderer.invoke('save-projects', projects);
  },
  loadProjects: async () => {
    return ipcRenderer.invoke('load-projects');
  },
  resetProjects: async () => {
    return ipcRenderer.invoke('reset-projects');
  },
  saveSettings: async (settings: any) => {
    return ipcRenderer.invoke('save-settings', settings);
  },
  loadSettings: async () => {
    return ipcRenderer.invoke('load-settings');
  },
  resetSettings: async () => {
    return ipcRenderer.invoke('reset-settings');
  },
  getServers: async (projectId: string) => {
    return ipcRenderer.invoke('get-servers', projectId);
  },
  getServerMetrics: async (
    projectId: string,
    serverId: string,
    metrics: string,
    start: string,
    end: string,
    step: number
  ) => {
    return ipcRenderer.invoke(
      'get-server-metrics',
      projectId,
      serverId,
      metrics,
      start,
      end,
      step
    );
  },
});
