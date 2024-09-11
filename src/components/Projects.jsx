import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import ProjectList from './ProjectList';
import ProjectTable from './ProjectTable';
import ProjectForm from './ProjectForm';
import ProjectDialog from './ProjectDialog';

const fetchProjects = async () => {
  const storedProjects = localStorage.getItem('projects');
  return storedProjects ? JSON.parse(storedProjects) : [];
};

const Projects = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("board");
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation({
    mutationFn: (project) => {
      const updatedProjects = [...(projects || []), { id: Date.now(), ...project }];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return Promise.resolve({ id: Date.now(), ...project });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setIsAddDialogOpen(false);
    },
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

  const onDragEnd = (result) => {
    // Implement drag and drop logic here
  };

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['To Do', 'In Progress', 'Done'].map((status) => (
                <Card key={status}>
                  <CardHeader>
                    <CardTitle>{status}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectList
                      projects={projects.filter(p => p.status === status)}
                      status={status}
                      onViewDetails={setSelectedProject}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="list">
          <ProjectTable projects={projects} onViewDetails={setSelectedProject} />
        </TabsContent>
      </Tabs>

      {isAddDialogOpen && (
        <ProjectForm
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={addProjectMutation.mutate}
        />
      )}

      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={updateProjectMutation.mutate}
        />
      )}
    </div>
  );
};

export default Projects;