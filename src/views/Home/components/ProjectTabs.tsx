import { FC, useMemo } from 'react';
import { Tabs, Tab } from '@mui/material';

interface Project {
  id: string;
  name: string;
  apiKey: string;
}

interface ProjectTabsProps {
  data: { [id: string]: Project };
  selectedProject: number;
  handleProjectChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const ProjectTabs: FC<ProjectTabsProps> = ({
  data,
  selectedProject,
  handleProjectChange,
}) => {
  const projectTabs = useMemo(
    () =>
      Object.keys(data || {})
        .sort((a, b) => data[a].name.localeCompare(data[b].name))
        .map((key) => <Tab key={key} label={data[key].name} />),
    [data]
  );

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={selectedProject}
      onChange={handleProjectChange}
      sx={{ borderRight: 1, borderColor: 'divider' }}
    >
      {projectTabs}
    </Tabs>
  );
};

export default ProjectTabs;
