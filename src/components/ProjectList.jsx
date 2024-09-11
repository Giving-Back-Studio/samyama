import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";

const ProjectList = ({ projects, onProjectClick }) => {
  return (
    <div className="space-y-2">
      {projects.map((project, index) => (
        <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="bg-white p-3 rounded shadow"
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-semibold"
                onClick={() => onProjectClick(project)}
              >
                {project.name}
              </Button>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default ProjectList;