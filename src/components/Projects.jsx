import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import ProjectForm from './ProjectForm';
import ProjectDialog from './ProjectDialog';
import ProjectBoard from './ProjectBoard';
import ProjectCalendar from './ProjectCalendar';
import ProjectList from './ProjectList';

const fetchProjects = async () => {
  // Mock function to fetch projects
  return [
    { id: 1, name: 'Spring Planting', status: 'To Do', startDate: '2024-03-01', endDate: '2024-05-01', assignedTo: 'John Doe', completed: false },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', startDate: '2024-04-01', endDate: '2024-06-15', assignedTo: 'Jane Smith', completed: false },
    { id: 3, name: 'Harvest Planning', status: 'Done', startDate: '2024-02-01', endDate: '2024-07-01', assignedTo: 'Bob Johnson', completed: true },
  ];
};

const Projects = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeView, setActiveView] = useState('list');
  const [listFilter, setListFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation({
    mutationFn: (newProject) => {
      return Promise.resolve({ id: Date.now(), ...newProject, completed: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setIsFormOpen(false);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject) => {
      return Promise.resolve(updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setSelectedProject(null);
    },
  });

  const toggleProjectCompletion = useMutation({
    mutationFn: (project) => {
      const updatedProject = { ...project, completed: !project.completed };
      return Promise.resolve(updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (listFilter === 'all') return projects;
    return projects.filter(project => 
      listFilter === 'completed' ? project.completed : !project.completed
    );
  }, [projects, listFilter]);

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error fetching projects</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Project</Button>
      </div>
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <ProjectList
            projects={filteredProjects}
            listFilter={listFilter}
            setListFilter={setListFilter}
            toggleProjectCompletion={toggleProjectCompletion}
            setSelectedProject={setSelectedProject}
          />
        </TabsContent>
        <TabsContent value="board">
          <ProjectBoard projects={projects} onProjectClick={setSelectedProject} />
        </TabsContent>
        <TabsContent value="calendar">
          <ProjectCalendar projects={projects} />
        </TabsContent>
      </Tabs>
      {isFormOpen && (
        <ProjectForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => addProjectMutation.mutate(data)}
        />
      )}
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

export default Projects;