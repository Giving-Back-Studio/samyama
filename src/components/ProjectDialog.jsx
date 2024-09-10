import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjectFormFields from './ProjectFormFields';
import { useForm } from 'react-hook-form';

const ProjectDialog = ({ project, onClose, onUpdate }) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: project
  });

  const handleUpdate = (data) => {
    onUpdate(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Project: {project.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <ProjectFormFields control={control} />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;