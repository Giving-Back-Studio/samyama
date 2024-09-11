import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Search } from "lucide-react";
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
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterMyProjects, setFilterMyProjects] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects || [];

    if (filterMyProjects) {
      filtered = filtered.filter(p => p.assignedTo === "currentUser"); // Replace with actual user ID
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [projects, filterMyProjects, searchTerm, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
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

      <div className="flex space-x-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="myProjects"
            checked={filterMyProjects}
            onCheckedChange={setFilterMyProjects}
          />
          <label htmlFor="myProjects">My Projects Only</label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <ProjectBoard
            projects={filteredAndSortedProjects}
            onDragEnd={onDragEnd}
            onViewDetails={setSelectedProject}
          />
        </TabsContent>

        <TabsContent value="list">
          <ProjectTable
            projects={filteredAndSortedProjects}
            onViewDetails={setSelectedProject}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
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

const ProjectBoard = ({ projects, onDragEnd, onViewDetails }) => (
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
                    projects={projects.filter(p => p.status === status)}
                    onViewDetails={onViewDetails}
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
);

export default Projects;