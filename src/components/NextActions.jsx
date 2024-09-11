import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Checkbox } from "@/components/ui/checkbox";

const NextActions = ({ actions, onToggleComplete, onReorder }) => {
  return (
    <div className="space-y-2">
      {actions.map((action, index) => (
        <Draggable key={action.id} draggableId={action.id.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="flex items-center space-x-2 bg-white p-2 rounded shadow"
            >
              <Checkbox
                id={`action-${action.id}`}
                checked={action.completed}
                onCheckedChange={() => onToggleComplete(action.id)}
              />
              <label
                htmlFor={`action-${action.id}`}
                className={`flex-grow ${action.completed ? 'line-through text-gray-500' : ''}`}
              >
                {action.description}
              </label>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default NextActions;