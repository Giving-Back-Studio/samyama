import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProjectDialog from './ProjectDialog';
import RichTextEditor from './RichTextEditor';
import TaskList from './TaskList';
import WeatherWidget from './WeatherWidget';
import CropPlanner from './CropPlanner';

const fetchProjects = async () => {
  // Mock function to fetch projects
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', assignedTo: 'John Doe', completed: false, nextActions: ['Prepare soil', 'Order seeds'] },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', assignedTo: 'John Doe', completed: false, nextActions: ['Research pump options', 'Contact suppliers'] },
    { id: 3, name: 'Harvest Planning', status: 'To Do', assignedTo: 'Jane Smith', completed: false, nextActions: ['Review crop calendar', 'Estimate yields'] },
  ];
};

const Dashboard = () => {
  const [notes, setNotes] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const toggleProjectCompletion = useMutation({
    mutationFn: (project) => {
      return Promise.resolve({ ...project, completed: !project.completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject) => {
      return Promise.resolve(updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setSelectedProject(null);
    },
  });

  const handleSaveNotes = () => {
    console.log('Saving notes:', notes);
  };

  const handleProjectClick = (project) => {
    console.log('Project clicked:', project);
    if (project && project.id) {
      setSelectedProject(project);
    }
  };

  const currentProjects = projects?.filter(project => project.status === 'In Progress' && project.assignedTo === 'John Doe') || [];

  const allNextActions = currentProjects.flatMap(project => 
    project.nextActions.map(action => ({ projectName: project.name, action }))
  );

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
            {currentProjects.map(project => (
              <div key={project.id} className="mb-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 
                    className="text-lg font-semibold cursor-pointer hover:text-blue-600"
                    onClick={() => handleProjectClick(project)}
                  >
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={project.completed}
                      onCheckedChange={() => toggleProjectCompletion.mutate(project)}
                    />
                    <span>{project.completed ? 'Completed' : 'In Progress'}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Next Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {allNextActions.map((item, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{item.projectName}:</span> {item.action}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <RichTextEditor value={notes} onChange={setNotes} />
            </div>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </CardContent>
        </Card>
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
            <TaskList />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Crop Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <CropPlanner />
          </CardContent>
        </Card>
      </div>
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={(updatedProject) => updateProjectMutation.mutate(updatedProject)}
        />
      )}
    </div>
  );
};

export default Dashboard;