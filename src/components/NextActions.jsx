import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Checkbox } from "@/components/ui/checkbox";

const NextActions = ({ projectId, actions }) => {
  const queryClient = useQueryClient();

  const updateActionsMutation = useMutation({
    mutationFn: (updatedActions) => {
      const projects = queryClient.getQueryData(['projects']);
      const updatedProjects = projects.map(p => 
        p.id === projectId ? { ...p, nextActions: updatedActions } : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return Promise.resolve(updatedProjects);
    },
    onSuccess: (updatedProjects) => {
      queryClient.setQueryData(['projects'], updatedProjects);
    },
  });

  const handleToggleComplete = (actionId) => {
    const updatedActions = actions.map(action =>
      action.id === actionId ? { ...action, completed: !action.completed } : action
    );
    updateActionsMutation.mutate(updatedActions);
  };

  return (
    <Droppable droppableId={`next-actions-${projectId}`} type="nextAction">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
          {actions.map((action, index) => (
            <Draggable key={action.id} draggableId={`action-${action.id}`} index={index}>
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
                    onCheckedChange={() => handleToggleComplete(action.id)}
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
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default NextActions;