import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjectFormFields from './ProjectFormFields';
import { useForm } from 'react-hook-form';

const ProjectDialog = ({ project, onClose, onUpdate }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: project
  });

  const handleUpdate = (data) => {
    console.log('Updating project:', data);
    onUpdate(data);
  };

  if (!project) {
    console.error('ProjectDialog: project is undefined');
    return null;
  }

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