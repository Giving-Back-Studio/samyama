import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";

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
  const [openProjects, setOpenProjects] = useState({});
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
    setOpenProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const markProjectComplete = (projectId) => {
    updateProjectMutation.mutate({ id: projectId, status: 'Completed' });
  };

  const moveProjectToInProgress = (projectId) => {
    updateProjectMutation.mutate({ id: projectId, status: 'In Progress' });
  };

  const renderProjects = (status) => {
    if (!projects) return null;
    return projects
      .filter(project => project.status === status)
      .map(project => (
        <Card key={project.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {project.name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {status === 'In Progress' ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => markProjectComplete(project.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => moveProjectToInProgress(project.id)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleProject(project.id)}
              >
                {openProjects[project.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <Collapsible open={openProjects[project.id]}>
            <CollapsibleContent>
              <CardContent>
                <ul className="list-disc list-inside">
                  {project.nextActions.map((action, index) => (
                    <li key={index} className="text-sm">{action}</li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ));
  };

  if (isLoadingProjects || isLoadingActivities) return <div>Loading dashboard...</div>;
  if (projectsError || activitiesError) return <div>Error loading dashboard data</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            {renderProjects('In Progress')}
            <h3 className="text-lg font-semibold mb-2 mt-4">To Do</h3>
            {renderProjects('To Do')}
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
                  <li key={activity.id} className="flex justify-between items-center">
                    <span>{activity.description}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;