import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const fetchProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw error;
  return data;
};

const addProject = async (newProject) => {
  const { data, error } = await supabase.from('projects').insert(newProject).single();
  if (error) throw error;
  return data;
};

const updateProject = async (updatedProject) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updatedProject)
    .eq('id', updatedProject.id)
    .single();
  if (error) throw error;
  return data;
};

export const useProjects = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  return {
    projects: projectsQuery.data,
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    addProject: addProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
  };
};