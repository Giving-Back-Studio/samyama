import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TaskItem from './TaskItem';
import NewTaskModal from './NewTaskModal';

const initialTasks = {
  todo: [
    { id: 'task-1', content: 'Cucumber in the nursery is planted' },
    { id: 'task-2', content: 'Water tomatoes' },
  ],
  inProgress: [
    { id: 'task-3', content: 'Harvest lettuce' },
  ],
  done: [
    { id: 'task-4', content: 'Compost heap turned' },
  ],
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const [removed] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
  };

  const addNewTask = (newTask) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      todo: [...prevTasks.todo, { id: `task-${Date.now()}`, content: newTask }],
    }));
    setIsNewTaskModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Button onClick={() => setIsNewTaskModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Card key={columnId}>
              <CardHeader>
                <CardTitle>{columnId === 'todo' ? 'To Do' : columnId === 'inProgress' ? 'In Progress' : 'Done'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem content={task.content} />
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
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={addNewTask}
      />
    </div>
  );
};

export default TaskBoard;