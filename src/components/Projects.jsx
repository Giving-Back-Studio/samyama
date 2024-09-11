import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectTable from './ProjectTable';
import ProjectBoard from './ProjectBoard';
import ProjectDialog from './ProjectDialog';
import { DragDropContext } from '@hello-pangea/dnd';

const fetchProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw error;
  return data;
};

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('board');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation({
    mutationFn: async (newProject) => {
      const { data, error } = await supabase.from('projects').insert(newProject).single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('projects');
      setIsDialogOpen(false);
      navigate(`/app/projects/${data.id}`);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', updatedProject.id)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const handleAddProject = (project) => {
    addProjectMutation.mutate(project);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const updatedProjects = Array.from(projects);
    const [reorderedProject] = updatedProjects.splice(source.index, 1);
    updatedProjects.splice(destination.index, 0, reorderedProject);

    // Update project status if moved between columns
    if (source.droppableId !== destination.droppableId) {
      const updatedProject = {
        ...reorderedProject,
        status: destination.droppableId,
      };
      updateProjectMutation.mutate(updatedProject);
    }

    queryClient.setQueryData(['projects'], updatedProjects);
  };

  const sortedProjects = projects?.slice().sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error fetching projects: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Project</Button>
      </div>
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="board">
          <DragDropContext onDragEnd={handleDragEnd}>
            <ProjectBoard
              projects={sortedProjects}
              onViewDetails={(project) => navigate(`/app/projects/${project.id}`)}
            />
          </DragDropContext>
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Project List</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectTable
                projects={sortedProjects}
                onViewDetails={(project) => navigate(`/app/projects/${project.id}`)}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {isDialogOpen && (
        <ProjectDialog
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleAddProject}
        />
      )}
    </div>
  );
};

export default Projects;