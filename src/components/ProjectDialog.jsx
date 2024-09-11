import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

const ProjectDialog = ({ project, onClose, onUpdate }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      ...project,
      startDate: project.startDate ? parseISO(project.startDate) : null,
      endDate: project.endDate ? parseISO(project.endDate) : null,
    }
  });

  const onSubmit = (data) => {
    onUpdate({
      ...data,
      startDate: data.startDate && isValid(data.startDate) ? format(data.startDate, 'yyyy-MM-dd') : null,
      endDate: data.endDate && isValid(data.endDate) ? format(data.endDate, 'yyyy-MM-dd') : null,
    });
  };

  const formatDate = (date) => {
    return date && isValid(date) ? format(date, "PPP") : "Pick a date";
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input id="name" {...field} />
                  )}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea id="description" {...field} />
                  )}
                />
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned To</label>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => <Input id="assignedTo" {...field} />}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(field.value)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(field.value)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;