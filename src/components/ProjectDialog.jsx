import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, GripVertical } from "lucide-react";
import { format } from "date-fns";

const ProjectDialog = ({ project, onClose, onUpdate }) => {
  const [editedProject, setEditedProject] = useState(project);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setEditedProject((prev) => ({ ...prev, status: value }));
  };

  const handleDateChange = (date, field) => {
    setEditedProject((prev) => ({ ...prev, [field]: date }));
  };

  const handleNextActionDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(editedProject.nextActions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEditedProject((prev) => ({ ...prev, nextActions: items }));
  };

  const addNextAction = () => {
    setEditedProject((prev) => ({
      ...prev,
      nextActions: [...prev.nextActions, 'New action']
    }));
  };

  const updateNextAction = (index, value) => {
    const updatedActions = [...editedProject.nextActions];
    updatedActions[index] = value;
    setEditedProject((prev) => ({ ...prev, nextActions: updatedActions }));
  };

  const removeNextAction = (index) => {
    const updatedActions = editedProject.nextActions.filter((_, i) => i !== index);
    setEditedProject((prev) => ({ ...prev, nextActions: updatedActions }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Project: {project.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={editedProject.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="details" className="text-right font-medium">
              Details
            </label>
            <Textarea
              id="details"
              name="details"
              value={editedProject.details}
              onChange={handleInputChange}
              className="col-span-3 min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="text-right font-medium">
              Status
            </label>
            <Select onValueChange={handleStatusChange} defaultValue={editedProject.status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="assignedTo" className="text-right font-medium">
              Assigned To
            </label>
            <Input
              id="assignedTo"
              name="assignedTo"
              value={editedProject.assignedTo}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedProject.startDate ? format(new Date(editedProject.startDate), 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(editedProject.startDate)}
                  onSelect={(date) => handleDateChange(date, 'startDate')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedProject.endDate ? format(new Date(editedProject.endDate), 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(editedProject.endDate)}
                  onSelect={(date) => handleDateChange(date, 'endDate')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right font-medium">Next Actions</label>
            <div className="col-span-3">
              <DragDropContext onDragEnd={handleNextActionDragEnd}>
                <Droppable droppableId="next-actions">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {editedProject.nextActions.map((action, index) => (
                        <Draggable key={index} draggableId={`action-${index}`} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md"
                            >
                              <span {...provided.dragHandleProps}>
                                <GripVertical className="h-5 w-5 text-gray-500" />
                              </span>
                              <Input
                                value={action}
                                onChange={(e) => updateNextAction(index, e.target.value)}
                                className="flex-grow"
                              />
                              <Button onClick={() => removeNextAction(index)} variant="destructive" size="sm">
                                Remove
                              </Button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <Button onClick={addNextAction} className="mt-2">Add Action</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onUpdate(editedProject)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;