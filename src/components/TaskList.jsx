import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from "@/components/ui/checkbox";

const fetchTasks = async () => {
  // This is a mock function. In a real app, you'd fetch tasks from an API.
  return [
    { id: 1, title: 'Water the garden', completed: false },
    { id: 2, title: 'Harvest tomatoes', completed: false },
    { id: 3, title: 'Check compost', completed: true },
  ];
};

const TaskList = ({ fullView = false }) => {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error fetching tasks</div>;

  return (
    <ul className="space-y-2">
      {tasks.slice(0, fullView ? undefined : 3).map(task => (
        <li key={task.id} className="flex items-center space-x-2">
          <Checkbox id={`task-${task.id}`} checked={task.completed} />
          <label htmlFor={`task-${task.id}`}>{task.title}</label>
        </li>
      ))}
      {!fullView && tasks.length > 3 && (
        <li className="text-sm text-gray-500">And {tasks.length - 3} more tasks...</li>
      )}
    </ul>
  );
};

export default TaskList;