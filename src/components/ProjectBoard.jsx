import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectList from './ProjectList';

const ProjectBoard = ({ projects, onProjectClick }) => {
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((status) => (
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
                    onProjectClick={onProjectClick}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectBoard;