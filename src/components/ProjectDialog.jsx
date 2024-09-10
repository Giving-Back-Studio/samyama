import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { Editor } from '@tinymce/tinymce-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ProjectDialog = ({ project, onClose, onUpdate }) => {
  const [editedProject, setEditedProject] = useState(project || {});

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
    const items = Array.from(editedProject.nextActions || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEditedProject((prev) => ({ ...prev, nextActions: items }));
  };

  const addNextAction = () => {
    setEditedProject((prev) => ({
      ...prev,
      nextActions: [...(prev.nextActions || []), 'New action']
    }));
  };

  const updateNextAction = (index, value) => {
    const updatedActions = [...(editedProject.nextActions || [])];
    updatedActions[index] = value;
    setEditedProject((prev) => ({ ...prev, nextActions: updatedActions }));
  };

  const removeNextAction = (index) => {
    const updatedActions = (editedProject.nextActions || []).filter((_, i) => i !== index);
    setEditedProject((prev) => ({ ...prev, nextActions: updatedActions }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Project: {editedProject.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 py-4">
          <div className="col-span-2 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <Input
                id="name"
                name="name"
                value={editedProject.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <div className="mb-4">
                <Editor
                  apiKey="your-tinymce-api-key"
                  value={editedProject.details || ''}
                  onEditorChange={handleDetailsChange}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </div>
            </div>
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Next Actions</label>
              <DragDropContext onDragEnd={handleNextActionDragEnd}>
                <Droppable droppableId="next-actions">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 max-h-60 overflow-y-auto">
                      {(editedProject.nextActions || []).map((action, index) => (
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
          <div className="space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select onValueChange={handleStatusChange} defaultValue={editedProject.status}>
                <SelectTrigger>
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
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={editedProject.assignedTo || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedProject.startDate ? format(new Date(editedProject.startDate), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editedProject.startDate ? new Date(editedProject.startDate) : undefined}
                    onSelect={(date) => handleDateChange(date, 'startDate')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedProject.endDate ? format(new Date(editedProject.endDate), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editedProject.endDate ? new Date(editedProject.endDate) : undefined}
                    onSelect={(date) => handleDateChange(date, 'endDate')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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