import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import RichTextEditor from './RichTextEditor';
import ProjectFormFields from './ProjectFormFields';

const ProjectForm = ({ onClose, onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <ProjectFormFields control={control} errors={errors} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;