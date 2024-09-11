import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";

const ProjectList = ({ projects, status, onViewDetails }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-2"
        >
          {projects.map((project, index) => (
            <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="bg-white p-3 rounded shadow"
                >
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(project)}
                    className="mt-2"
                  >
                    View Details
                  </Button>
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};

export default ProjectList;