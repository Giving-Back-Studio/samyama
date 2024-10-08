import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const ProjectFormFields = ({ control, errors }) => {
  return (
    <div className="grid grid-cols-3 gap-6 py-4">
      <div className="col-span-2 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Project name is required" }}
            render={({ field }) => <Input id="name" {...field} />}
          />
          {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
          <Controller
            name="details"
            control={control}
            render={({ field }) => <Input id="details" {...field} />}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Next Actions</label>
          <Controller
            name="next_actions"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {field.value.map((action, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                    <Input
                      value={action}
                      onChange={(e) => {
                        const newActions = [...field.value];
                        newActions[index] = e.target.value;
                        field.onChange(newActions);
                      }}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const newActions = field.value.filter((_, i) => i !== index);
                        field.onChange(newActions);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => field.onChange([...field.value, ''])}
                  className="mt-2"
                >
                  Add Action
                </Button>
              </div>
            )}
          />
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Controller
            name="status"
            control={control}
            defaultValue="To Do"
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
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => <Input id="assignedTo" {...field} />}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectFormFields;