import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProjectForm from './ProjectForm';

const fetchProjects = async () => {
  // This is a mock function. In a real app, you'd fetch projects from an API.
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', dueDate: '2024-05-01' },
    { id: 2, name: 'Irrigation System Upgrade', status: 'Planned', dueDate: '2024-06-15' },
  ];
};

const Projects = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation({
    mutationFn: (newProject) => {
      // This is a mock function. In a real app, you'd send a POST request to your API.
      return Promise.resolve({ id: Date.now(), ...newProject });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setIsFormOpen(false);
    },
  });

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error fetching projects</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Project</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <ProjectForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => addProjectMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Projects;