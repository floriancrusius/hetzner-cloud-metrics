interface Window {
  api: {
    saveProjects: (projects: any) => Promise<any>;
    loadProjects: () => Promise<any>;
    resetProjects: () => Promise<any>;
    saveSettings: (settings: any) => Promise<any>;
    loadSettings: () => Promise<any>;
    resetSettings: () => Promise<any>;
    getServers: (projectId) => Promise<any>;
    getServerMetrics: (
      projectId: string,
      serverId: string,
      metrics: string,
      start: string,
      end: string,
      step: number
    ) => Promise<any>;
  };
}
