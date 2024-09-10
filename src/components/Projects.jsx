import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import ProjectForm from './ProjectForm';
import ProjectDialog from './ProjectDialog';

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
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [activeTab, setActiveTab] = useState('all');
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

  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [projects, sortConfig]);

  const filteredProjects = useMemo(() => {
    if (activeTab === 'all') return sortedProjects;
    return sortedProjects.filter(project => 
      activeTab === 'completed' ? project.completed : !project.completed
    );
  }, [sortedProjects, activeTab]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error fetching projects</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Project</Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Project List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                      Name <SortIcon column="name" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                      Status <SortIcon column="status" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('startDate')} className="cursor-pointer">
                      Start Date <SortIcon column="startDate" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('endDate')} className="cursor-pointer">
                      End Date <SortIcon column="endDate" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('assignedTo')} className="cursor-pointer">
                      Assigned To <SortIcon column="assignedTo" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className="cursor-pointer hover:bg-gray-100">
                      <TableCell onClick={() => setSelectedProject(project)}>{project.name}</TableCell>
                      <TableCell onClick={() => setSelectedProject(project)}>{project.status}</TableCell>
                      <TableCell onClick={() => setSelectedProject(project)}>{project.startDate}</TableCell>
                      <TableCell onClick={() => setSelectedProject(project)}>{project.endDate}</TableCell>
                      <TableCell onClick={() => setSelectedProject(project)}>{project.assignedTo}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProjectCompletion.mutate(project)}
                        >
                          <CheckCircle className={`h-5 w-5 ${project.completed ? 'text-green-500' : 'text-gray-300'}`} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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