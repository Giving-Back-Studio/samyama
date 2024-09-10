import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, GripVertical, X } from "lucide-react";
import { format } from "date-fns";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProjectDialog = ({ project, onClose, onUpdate }) => {
  const [editedProject, setEditedProject] = useState(project);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (content) => {
    setEditedProject((prev) => ({ ...prev, details: content }));
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
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Project: {project.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={editedProject.name}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={handleStatusChange} defaultValue={editedProject.status}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={editedProject.assignedTo}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
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
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
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
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="details">Details</Label>
              <ReactQuill
                value={editedProject.details}
                onChange={handleDetailsChange}
                className="mt-1 h-40"
              />
            </div>
            <div>
              <Label>Next Actions</Label>
              <DragDropContext onDragEnd={handleNextActionDragEnd}>
                <Droppable droppableId="next-actions">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 mt-1 max-h-40 overflow-y-auto">
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
                              <Button onClick={() => removeNextAction(index)} variant="ghost" size="sm">
                                <X className="h-4 w-4" />
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