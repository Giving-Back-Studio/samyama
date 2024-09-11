import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProjectBoard = ({ projects, onViewDetails }) => {
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(column => (
        <Droppable key={column} droppableId={column}>
          {(provided) => (
            <Card>
              <CardHeader>
                <CardTitle>{column}</CardTitle>
              </CardHeader>
              <CardContent
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px]"
              >
                {projects
                  .filter(project => project.status === column)
                  .map((project, index) => (
                    <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded shadow mb-2 cursor-move"
                        >
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{project.description}</p>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => onViewDetails(project)}
                            className="mt-2"
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </CardContent>
            </Card>
          )}
        </Droppable>
      ))}
    </div>
  );
};

export default ProjectBoard;