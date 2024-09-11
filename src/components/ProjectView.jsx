import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from 'react-error-boundary';
import ProjectDetails from './ProjectDetails';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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

const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('id, name');
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

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (project) {
      setEditedProject(project);
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      navigate('/app/projects');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      navigate('/app/projects');
    },
  });

  if (isLoadingProject || isLoadingUsers) return <div className="text-center p-4">Loading...</div>;
  if (!project) return <div className="text-center p-4">Project not found</div>;

  const handleChange = (updatedFields) => {
    setEditedProject({ ...editedProject, ...updatedFields });
  };

  const handleSave = () => {
    if (editedProject) {
      updateProjectMutation.mutate(editedProject);
    }
  };

  const handleCancel = () => {
    navigate('/app/projects');
  };

  const handleDelete = () => {
    deleteProjectMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <ProjectDetails 
            project={editedProject} 
            onChange={handleChange}
            users={users}
          />
          <div className="flex justify-between mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Project</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project
                    and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="space-x-4">
              <Button onClick={handleCancel} variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
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