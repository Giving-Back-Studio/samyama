import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [sortBy, setSortBy] = useState("createdAt");
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation({
    mutationFn: (project) => {
      const updatedProjects = [...(projects || []), { id: Date.now(), createdAt: new Date().toISOString(), ...project }];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return Promise.resolve({ id: Date.now(), createdAt: new Date().toISOString(), ...project });
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

  const sortedProjects = projects?.slice().sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "startDate") {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortBy === "endDate") {
      return new Date(a.endDate) - new Date(b.endDate);
    }
    return 0;
  });

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
                    <Droppable droppableId={status}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <ProjectList
                            projects={sortedProjects.filter(p => p.status === status)}
                            onViewDetails={setSelectedProject}
                          />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="list">
          <div className="mb-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Creation Date</SelectItem>
                <SelectItem value="startDate">Start Date</SelectItem>
                <SelectItem value="endDate">End Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ProjectTable projects={sortedProjects} onViewDetails={setSelectedProject} />
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