import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProjectTabs from './components/ProjectTabs';
import ServerTabs from './components/ServerTabs';

interface Project {
  id: string;
  name: string;
  apiKey: string;
}

interface Settings {
  [id: string]: Project;
}

const Home: FC = () => {
  const [data, setData] = useState<Settings>();
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedServer, setSelectedServer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.api.loadProjects().then((data) => {
      if (Object.keys(data || {}).length) {
        setData(data);
      } else {
        navigate('/initial-setup');
      }
    });
  }, [navigate]);

  const handleProjectChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedProject(newValue);
    setSelectedServer(0); // Reset server tab when project changes
  };

  const handleServerChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedServer(newValue);
  };
  const getSelectedProject = useCallback(() => {
    if (data) {
      return data[
        Object.keys(data).sort((a, b) =>
          data[a].name.localeCompare(data[b].name)
        )[selectedProject]
      ];
    }
    return undefined;
  }, [data, selectedProject]);
  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      {data && (
        <>
          <ProjectTabs
            data={data}
            selectedProject={selectedProject}
            handleProjectChange={handleProjectChange}
          />
          {Object.keys(data).length ? (
            Object.keys(data)
              .sort((a, b) => data[a].name.localeCompare(data[b].name))
              .map((key, index) => (
                <div
                  role="tabpanel"
                  hidden={selectedProject !== index}
                  id={`vertical-tabpanel-${index}`}
                  aria-labelledby={`vertical-tab-${index}`}
                  key={key}
                >
                  {selectedProject === index && (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h4">{data[key].name}</Typography>
                      <ServerTabs
                        selectedServer={selectedServer}
                        handleServerChange={handleServerChange}
                        projectName={data[key].name}
                        projectId={data[key].id}
                      />
                    </Box>
                  )}
                </div>
              ))
          ) : (
            <div>No projects found</div>
          )}
          {/* <Box sx={{ p: 3 }}>
            <Typography variant="h4">{getSelectedProject().name}</Typography>
            <ServerTabs
              selectedServer={selectedServer}
              handleServerChange={handleServerChange}
              projectName={getSelectedProject().name}
              projectId={getSelectedProject().id}
            />
          </Box> */}
        </>
      )}
    </Box>
  );
};

export default Home;
