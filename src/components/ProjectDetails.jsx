import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const ProjectDetails = ({ project, onUpdate }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...project, [name]: value });
  };

  const handleDateChange = (field, date) => {
    onUpdate({ ...project, [field]: date });
  };

  const handleStatusChange = (status) => {
    onUpdate({ ...project, status });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <Input id="name" name="name" value={project.name} onChange={handleInputChange} className="mt-1" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea id="description" name="description" value={project.description} onChange={handleInputChange} className="mt-1" />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <Select name="status" value={project.status} onValueChange={handleStatusChange}>
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
        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {project.start_date ? format(new Date(project.start_date), 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={project.start_date ? new Date(project.start_date) : undefined}
              onSelect={(date) => handleDateChange('start_date', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {project.end_date ? format(new Date(project.end_date), 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={project.end_date ? new Date(project.end_date) : undefined}
              onSelect={(date) => handleDateChange('end_date', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">Assigned To</label>
        <Input id="assigned_to" name="assigned_to" value={project.assigned_to} onChange={handleInputChange} className="mt-1" />
      </div>
    </div>
  );
};

export default ProjectDetails;