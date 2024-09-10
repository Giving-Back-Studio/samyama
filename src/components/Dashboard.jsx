import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, ArrowRight, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const toggleProject = (projectId) => {
    setOpenProject(openProject === projectId ? null : projectId);
  };

  const markProjectComplete = (projectId) => {
    updateProjectMutation.mutate({ id: projectId, status: 'Completed' });
  };

  const moveProjectToInProgress = (projectId) => {
    updateProjectMutation.mutate({ id: projectId, status: 'In Progress' });
  };

  const updateNextActions = (projectId, newNextActions) => {
    updateProjectMutation.mutate({
      id: projectId,
      nextActions: newNextActions,
    });
  };

  const onDragEnd = (result, projectId) => {
    if (!result.destination) return;

    const project = projects.find(p => p.id === projectId);
    const newNextActions = Array.from(project.nextActions);
    const [reorderedItem] = newNextActions.splice(result.source.index, 1);
    newNextActions.splice(result.destination.index, 0, reorderedItem);

    updateNextActions(projectId, newNextActions);
  };

  const toggleActionCompletion = (projectId, actionId) => {
    const project = projects.find(p => p.id === projectId);
    const newNextActions = project.nextActions.map(action =>
      action.id === actionId ? { ...action, completed: !action.completed } : action
    );
    updateNextActions(projectId, newNextActions);
  };

  const renderProjects = (status) => {
    if (!projects || projects.length === 0) return null;
    const filteredProjects = projects.filter(project => project.status === status);
    if (filteredProjects.length === 0) return <p className="text-gray-500">No {status} projects</p>;

    return (
      <Accordion type="single" collapsible value={openProject} onValueChange={toggleProject}>
        {filteredProjects.map(project => (
          <AccordionItem key={project.id} value={project.id.toString()}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span>{project.name}</span>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    {status === 'In Progress' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => { e.stopPropagation(); markProjectComplete(project.id); }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark as complete</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => { e.stopPropagation(); moveProjectToInProgress(project.id); }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark as in progress</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DragDropContext onDragEnd={(result) => onDragEnd(result, project.id)}>
                <Droppable droppableId={`project-${project.id}`}>
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {project.nextActions && project.nextActions.map((action, index) => (
                        <Draggable key={action.id} draggableId={action.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md"
                            >
                              <span {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActionCompletion(project.id, action.id)}
                              >
                                <CheckCircle className={`h-4 w-4 ${action.completed ? 'text-green-500' : 'text-gray-300'}`} />
                              </Button>
                              <span className={action.completed ? 'line-through text-gray-500' : ''}>{action.content}</span>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
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
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            {renderProjects('In Progress')}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">To Do</h3>
            {renderProjects('To Do')}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <ul className="space-y-2">
              {activities.map(activity => (
                <li key={activity.id} className="flex justify-between items-center border-b pb-2">
                  <span>{activity.description}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;