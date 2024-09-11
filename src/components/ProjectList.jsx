import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

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
              className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onProjectClick(project)}
            >
              <span className="font-medium">{project.name}</span>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default ProjectList;