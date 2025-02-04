import { FC, useEffect, useMemo, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ServerMetrics from '../../../components/organisms/ServerMetrics';

interface ServerTabsProps {
  selectedServer: number;
  handleServerChange: (event: React.SyntheticEvent, newValue: number) => void;
  projectName: string;
  projectId: string;
}
interface Server {
  id: string;
  name: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
const ServerTabs: FC<ServerTabsProps> = ({
  selectedServer,
  handleServerChange,
  projectName,
  projectId,
}) => {
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await window.api.getServers(projectId);
        setServers(response);
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    fetchServers();
  }, [projectId]);

  const serverTabs = useMemo(
    () => servers.map((server) => <Tab key={server.id} label={server.name} />),
    [servers]
  );

  const tabPanels = servers.map((server, index) => (
    <TabPanel key={server.id} value={selectedServer} index={index}>
      <ServerMetrics serverId={server.id} projectId={projectId} />
    </TabPanel>
  ));

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Tabs
        orientation="horizontal"
        value={selectedServer}
        onChange={handleServerChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {serverTabs}
      </Tabs>

      {tabPanels}
    </Box>
  );

  //   return (
  //     <>
  //       <Tabs
  //         value={selectedServer}
  //         onChange={handleServerChange}
  //         indicatorColor="primary"
  //         textColor="primary"
  //         variant="scrollable"
  //         scrollButtons="auto"
  //       >
  //         {serverTabs}
  //       </Tabs>
  //       <Box sx={{ p: 3 }}>
  //         {servers.map((server, index) => (
  //           <ServerMetrics
  //             key={server.id}
  //             serverId={server.id}
  //             projectId={projectId}
  //           />
  //         ))}
  //       </Box>
  //     </>
  //   );
};

export default ServerTabs;
