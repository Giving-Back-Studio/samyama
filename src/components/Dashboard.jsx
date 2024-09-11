import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext } from '@hello-pangea/dnd';
import ProjectList from './ProjectList';
import ActivityList from './ActivityList';
import ProjectDialog from './ProjectDialog';
import NoteWidget from './NoteWidget';

const fetchProjects = async () => {
  const storedProjects = localStorage.getItem('projects');
  return storedProjects ? JSON.parse(storedProjects) : [];
};

const fetchEnterpriseActivity = async () => {
  return [
    { id: 1, type: 'Transaction', description: 'New sale: $500', timestamp: '2024-03-15T10:30:00Z' },
    { id: 2, type: 'Planting', description: 'Planted 100 tomato seedlings', timestamp: '2024-03-14T09:15:00Z' },
    { id: 3, type: 'Task', description: 'Completed irrigation system maintenance', timestamp: '2024-03-13T14:45:00Z' },
  ];
};

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['enterpriseActivity'],
    queryFn: fetchEnterpriseActivity,
  });

  const handleViewDetails = (project) => {
    setSelectedProject(project);
  };

  const handleUpdateProject = (updatedProject) => {
    // Update project logic here
    setSelectedProject(null);
  };

  const onDragEnd = (result) => {
    // Implement drag and drop logic here
  };

  if (isLoadingProjects || isLoadingActivities) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="space-y-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Card>
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectList
                projects={projects}
                status="In Progress"
                onViewDetails={handleViewDetails}
              />
              <ProjectList
                projects={projects}
                status="To Do"
                onViewDetails={handleViewDetails}
              />
              <ProjectList
                projects={projects}
                status="Done"
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </DragDropContext>

        <ActivityList activities={activities} />

        <NoteWidget />
      </div>

      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;