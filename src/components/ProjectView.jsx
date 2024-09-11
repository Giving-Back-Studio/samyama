import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Pencil, Save, X } from "lucide-react";
import { format } from "date-fns";
import { ErrorBoundary } from 'react-error-boundary';

const fetchProject = async (id) => {
  if (!id) throw new Error('Project ID is required');
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  if (!data) throw new Error('Project not found');
  return data;
};

const updateProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', project.id)
    .single();
  if (error) throw error;
  return data;
};

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">An error occurred:</h2>
    <p className="text-sm">{error.message}</p>
    <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
  </div>
);

const ProjectDetails = ({ project, isEditing, onEdit, onSave, onCancel }) => {
  const [editedProject, setEditedProject] = useState(project);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field, date) => {
    setEditedProject(prev => ({ ...prev, [field]: date }));
  };

  if (isEditing) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(editedProject); }} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <Input id="name" name="name" value={editedProject.name} onChange={handleInputChange} className="mt-1" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea id="description" name="description" value={editedProject.description} onChange={handleInputChange} className="mt-1" />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <Select name="status" value={editedProject.status} onValueChange={(value) => handleInputChange({ target: { name: 'status', value } })}>
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
                {editedProject.start_date ? format(new Date(editedProject.start_date), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editedProject.start_date ? new Date(editedProject.start_date) : undefined}
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
                {editedProject.end_date ? format(new Date(editedProject.end_date), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editedProject.end_date ? new Date(editedProject.end_date) : undefined}
                onSelect={(date) => handleDateChange('end_date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">Assigned To</label>
          <Input id="assigned_to" name="assigned_to" value={editedProject.assigned_to} onChange={handleInputChange} className="mt-1" />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    );
  }

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[
        { label: 'Name', value: project.name },
        { label: 'Description', value: project.description },
        { label: 'Status', value: project.status },
        { label: 'Start Date', value: project.start_date ? format(new Date(project.start_date), 'PPP') : 'Not set' },
        { label: 'End Date', value: project.end_date ? format(new Date(project.end_date), 'PPP') : 'Not set' },
        { label: 'Assigned To', value: project.assigned_to },
      ].map(({ label, value }) => (
        <div key={label} className="border-t border-gray-200 pt-4">
          <dt className="font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-sm text-gray-900">{value || 'Not specified'}</dd>
        </div>
      ))}
    </dl>
  );
};

const ProjectViewContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      setIsEditing(false);
    },
  });

  if (isLoading) return <div className="text-center p-4">Loading project...</div>;
  if (error) return <ErrorFallback error={error} resetErrorBoundary={() => navigate('/app/projects')} />;
  if (!project) return <div className="text-center p-4">Project not found</div>;

  const handleEdit = () => setIsEditing(true);
  const handleSave = (updatedProject) => {
    updateProjectMutation.mutate(updatedProject);
  };
  const handleCancel = () => setIsEditing(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name || 'Unnamed Project'}</h1>
        <div className="space-x-2">
          {!isEditing && (
            <Button onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Project
            </Button>
          )}
          <Button onClick={() => navigate('/app/projects')}>Back to Projects</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectDetails
            project={project}
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectView = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    <ProjectViewContent />
  </ErrorBoundary>
);

export default ProjectView;