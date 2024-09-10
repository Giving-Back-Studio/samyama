import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const fetchProjects = async () => {
  // Mock function to fetch projects. In a real app, this would be an API call.
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', assignedTo: 'John Doe', nextActions: ['Prepare soil', 'Order seeds'] },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', assignedTo: 'John Doe', nextActions: ['Research pump options', 'Contact suppliers'] },
    { id: 3, name: 'Harvest Planning', status: 'To Do', assignedTo: 'Jane Smith', nextActions: ['Review crop calendar', 'Estimate yields'] },
  ];
};

const Dashboard = () => {
  const [notes, setNotes] = useState('');
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const handleSaveNotes = () => {
    // In a real app, this would save the notes to a backend
    console.log('Saving notes:', notes);
  };

  const inProgressProjects = projects?.filter(project => project.status === 'In Progress' && project.assignedTo === 'John Doe') || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading projects...</p>}
            {error && <p>Error loading projects: {error.message}</p>}
            {inProgressProjects.map(project => (
              <div key={project.id} className="mb-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{project.name}</h3>
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactQuill 
              theme="snow" 
              value={notes} 
              onChange={setNotes}
              className="h-64 mb-4"
            />
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;