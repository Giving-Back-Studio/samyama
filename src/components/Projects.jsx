import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import ProjectForm from './ProjectForm';
import ProjectDialog from './ProjectDialog';

const fetchProjects = async () => {
  // This is a mock function. In a real app, you'd fetch projects from an API.
  return [
    { id: 1, name: 'Spring Planting', status: 'To Do', startDate: '2024-03-01', endDate: '2024-05-01', assignedTo: 'John Doe', details: 'Prepare and plant spring crops', nextActions: ['Buy seeds', 'Prepare soil', 'Set up irrigation'] },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', startDate: '2024-04-01', endDate: '2024-06-15', assignedTo: 'Jane Smith', details: 'Upgrade the farm\'s irrigation system', nextActions: ['Research new systems', 'Get quotes', 'Schedule installation'] },
    { id: 3, name: 'Harvest Planning', status: 'Done', startDate: '2024-02-01', endDate: '2024-07-01', assignedTo: 'Bob Johnson', details: 'Plan for summer harvest', nextActions: ['Review crop yields', 'Schedule labor', 'Prepare storage'] },
  ];
};

const Projects = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
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

  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject) => {
      // This is a mock function. In a real app, you'd send a PUT request to your API.
      return Promise.resolve(updatedProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setSelectedProject(null);
    },
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // Update the status based on the new column
    reorderedItem.status = result.destination.droppableId;
    // In a real app, you'd update the backend here
    queryClient.setQueryData(['projects'], items);
  };

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error fetching projects</div>;

  const columns = ['To Do', 'In Progress', 'Done'];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Project</Button>
      </div>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
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
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} onClick={() => handleProjectClick(project)} className="cursor-pointer hover:bg-gray-100">
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>{project.startDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell>{project.assignedTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="board">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-3 gap-4">
              {columns.map((column) => (
                <Card key={column}>
                  <CardHeader>
                    <CardTitle>{column}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={column}>
                      {(provided) => (
                        <ul
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {projects
                            .filter((project) => project.status === column)
                            .map((project, index) => (
                              <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-2 rounded shadow cursor-pointer"
                                    onClick={() => handleProjectClick(project)}
                                  >
                                    {project.name}
                                  </li>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Project Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="multiple"
                selected={projects.flatMap(project => [new Date(project.startDate), new Date(project.endDate)])}
                className="rounded-md border"
              />
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