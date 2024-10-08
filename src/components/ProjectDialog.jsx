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
import NextActions from './NextActions';
import UserSelect from './UserSelect';

const ProjectDialog = ({ project, onClose, onUpdate, users = [] }) => {
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

  const formatDate = (date) => date && isValid(date) ? format(date, "PPP") : "Pick a date";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField name="name" control={control} label="Name" />
              <FormField name="description" control={control} label="Description" as={Textarea} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Actions</label>
                <Controller
                  name="nextActions"
                  control={control}
                  render={({ field }) => (
                    <NextActions projectId={project.id} actions={field.value || []} />
                  )}
                />
              </div>
            </div>
            <div className="space-y-4">
              <FormField
                name="status"
                control={control}
                label="Status"
                as={Select}
                options={[
                  { value: "To Do", label: "To Do" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Done", label: "Done" },
                ]}
              />
              <FormField
                name="assignedTo"
                control={control}
                label="Assigned To"
                as={UserSelect}
                users={users}
              />
              <DateField name="startDate" control={control} label="Start Date" formatDate={formatDate} />
              <DateField name="endDate" control={control} label="End Date" formatDate={formatDate} />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Update Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const FormField = ({ name, control, label, as: Component = Input, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Component id={name} {...field} {...props} />}
    />
  </div>
);

const DateField = ({ name, control, label, formatDate }) => (
  <FormField
    name={name}
    control={control}
    label={label}
    as={({ value, onChange }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
        </PopoverContent>
      </Popover>
    )}
  />
);

export default ProjectDialog;