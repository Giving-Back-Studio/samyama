import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import ProjectForm from './ProjectForm';

const fetchProjects = async () => {
  // This is a mock function. In a real app, you'd fetch projects from an API.
  return [
    { id: 1, name: 'Spring Planting', status: 'To Do', dueDate: '2024-05-01' },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', dueDate: '2024-06-15' },
    { id: 3, name: 'Harvest Planning', status: 'Done', dueDate: '2024-07-01' },
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
                                    className="bg-white p-2 rounded shadow"
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
                selected={projects.map(project => new Date(project.dueDate))}
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
    </div>
  );
};

export default Projects;