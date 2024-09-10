import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeatherWidget from './WeatherWidget';
import TaskBoard from './TaskBoard';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const fetchProjects = async () => {
  // Mock function to fetch projects. In a real app, this would be an API call.
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', assignedTo: 'John Doe', nextActions: ['Prepare soil', 'Order seeds'] },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', assignedTo: 'John Doe', nextActions: ['Research pump options', 'Contact suppliers'] },
    { id: 3, name: 'Harvest Planning', status: 'To Do', assignedTo: 'Jane Smith', nextActions: ['Review crop calendar', 'Estimate yields'] },
  ];
};

const Dashboard = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const inProgressProjects = projects?.filter(project => project.status === 'In Progress' && project.assignedTo === 'John Doe') || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <WeatherWidget />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskBoard />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>In-Progress Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {inProgressProjects.map(project => (
              <div key={project.id} className="mb-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-500">Assigned to: {project.assignedTo}</p>
                <h4 className="mt-2 font-medium">Next Actions:</h4>
                <ul className="list-disc list-inside">
                  {project.nextActions.map((action, index) => (
                    <li key={index} className="text-sm">{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Link to="/notes">
          <Button>Open Notes</Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;