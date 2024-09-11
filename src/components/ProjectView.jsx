import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from 'react-error-boundary';
import ProjectDetails from './ProjectDetails';

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

const ProjectViewContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editedProject, setEditedProject] = useState(null);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      setEditedProject(null);
    },
  });

  if (isLoading) return <div className="text-center p-4">Loading project...</div>;
  if (error) return <ErrorFallback error={error} resetErrorBoundary={() => navigate('/app/projects')} />;
  if (!project) return <div className="text-center p-4">Project not found</div>;

  const handleChange = (updatedFields) => {
    setEditedProject({ ...project, ...updatedFields });
  };

  const handleSave = () => {
    if (editedProject) {
      updateProjectMutation.mutate(editedProject);
    }
  };

  const handleCancel = () => {
    setEditedProject(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <ProjectDetails 
            project={editedProject || project} 
            onChange={handleChange} 
          />
          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={handleCancel} variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
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