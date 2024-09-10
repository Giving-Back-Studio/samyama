import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, ArrowRight } from "lucide-react";

const fetchProjects = async () => {
  // Mock function to fetch projects
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', nextActions: ['Prepare soil', 'Order seeds'] },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', nextActions: ['Research pump options', 'Contact suppliers'] },
    { id: 3, name: 'Harvest Planning', status: 'To Do', nextActions: ['Review crop calendar', 'Estimate yields'] },
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
                  {status === 'In Progress' ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); markProjectComplete(project.id); }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); moveProjectToInProgress(project.id); }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside pl-4">
                {project.nextActions && project.nextActions.map((action, index) => (
                  <li key={index} className="text-sm">{action}</li>
                ))}
              </ul>
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