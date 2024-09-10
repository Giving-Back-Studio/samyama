import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ProjectList from './ProjectList';
import ActivityList from './ActivityList';

const fetchProjects = async () => {
  // Mock function to fetch projects
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', nextActions: [
      { id: 'action-1', content: 'Prepare soil', completed: false },
      { id: 'action-2', content: 'Order seeds', completed: false },
    ]},
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', nextActions: [
      { id: 'action-3', content: 'Research pump options', completed: false },
      { id: 'action-4', content: 'Contact suppliers', completed: false },
    ]},
    { id: 3, name: 'Harvest Planning', status: 'To Do', nextActions: [
      { id: 'action-5', content: 'Review crop calendar', completed: false },
      { id: 'action-6', content: 'Estimate yields', completed: false },
    ]},
  ];
};

const fetchEnterpriseActivity = async () => {
  // Mock function to fetch all activities
  return [
    { id: 1, type: 'Transaction', description: 'New sale: $500', timestamp: '2024-03-15T10:30:00Z' },
    { id: 2, type: 'Planting', description: 'Planted 100 tomato seedlings', timestamp: '2024-03-14T09:15:00Z' },
    { id: 3, type: 'Task', description: 'Completed irrigation system maintenance', timestamp: '2024-03-13T14:45:00Z' },
  ];
};

const Dashboard = () => {
  const [openProject, setOpenProject] = useState(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const { data: activities, isLoading: isLoadingActivities, error: activitiesError } = useQuery({
    queryKey: ['enterpriseActivity'],
    queryFn: fetchEnterpriseActivity,
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject) => {
      // Mock function to update a project
      return Promise.resolve(updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedProjects = Array.from(projects);

    if (result.type === 'PROJECT') {
      const [reorderedProject] = updatedProjects.splice(source.index, 1);
      updatedProjects.splice(destination.index, 0, reorderedProject);

      // Update project status if moved between columns
      if (source.droppableId !== destination.droppableId) {
        reorderedProject.status = destination.droppableId;
      }

      updateProjectMutation.mutate(updatedProjects);
    } else if (result.type === 'NEXT_ACTION') {
      const projectIndex = updatedProjects.findIndex(p => p.id.toString() === source.droppableId);
      const project = updatedProjects[projectIndex];
      const newNextActions = Array.from(project.nextActions);
      const [reorderedItem] = newNextActions.splice(source.index, 1);
      newNextActions.splice(destination.index, 0, reorderedItem);

      const updatedProject = { ...project, nextActions: newNextActions };
      updatedProjects[projectIndex] = updatedProject;
      updateProjectMutation.mutate(updatedProjects);
    }
  };

  const toggleActionCompletion = (projectId, actionId) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedNextActions = project.nextActions.map(action =>
          action.id === actionId ? { ...action, completed: !action.completed } : action
        );
        return { ...project, nextActions: updatedNextActions };
      }
      return project;
    });
    updateProjectMutation.mutate(updatedProjects);
  };

  if (isLoadingProjects || isLoadingActivities) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  if (projectsError || activitiesError) {
    return <div className="p-4">Error loading dashboard data: {projectsError?.message || activitiesError?.message}</div>;
  }

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProjectList
              projects={projects}
              status="In Progress"
              openProject={openProject}
              setOpenProject={setOpenProject}
              toggleActionCompletion={toggleActionCompletion}
            />
            <ProjectList
              projects={projects}
              status="To Do"
              openProject={openProject}
              setOpenProject={setOpenProject}
              toggleActionCompletion={toggleActionCompletion}
            />
          </CardContent>
        </Card>
      </DragDropContext>
      <ActivityList activities={activities} />
    </div>
  );
};

export default Dashboard;