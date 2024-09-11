import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ProjectList from './ProjectList';
import NoteWidget from './NoteWidget';
import ActivityList from './ActivityList';
import ProjectDialog from './ProjectDialog';

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
  const queryClient = useQueryClient();

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['enterpriseActivity'],
    queryFn: fetchEnterpriseActivity,
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject) => {
      const updatedProjects = projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return Promise.resolve(updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setSelectedProject(null);
    },
  });

  const handleViewDetails = (project) => {
    setSelectedProject(project);
  };

  const handleUpdateProject = (updatedProject) => {
    updateProjectMutation.mutate(updatedProject);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const updatedProjects = Array.from(projects);
    const [reorderedProject] = updatedProjects.splice(source.index, 1);
    updatedProjects.splice(destination.index, 0, reorderedProject);

    if (source.droppableId !== destination.droppableId) {
      const draggedProject = updatedProjects.find(p => p.id.toString() === draggableId);
      draggedProject.status = destination.droppableId;
    }

    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    queryClient.setQueryData(['projects'], updatedProjects);
  };

  const handleStatusChange = (projectId, newStatus) => {
    const updatedProject = projects.find(p => p.id === projectId);
    if (updatedProject) {
      updatedProject.status = newStatus;
      updateProjectMutation.mutate(updatedProject);
    }
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
              {['To Do', 'In Progress', 'Done'].map((status) => (
                <div key={status}>
                  <h3 className="font-semibold mb-2">{status}</h3>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <ProjectList
                          projects={projects.filter(p => p.status === status)}
                          onViewDetails={handleViewDetails}
                          onStatusChange={handleStatusChange}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </CardContent>
          </Card>
        </DragDropContext>

        <NoteWidget />

        <ActivityList activities={activities} />
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