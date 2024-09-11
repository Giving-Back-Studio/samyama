import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data;
  };

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const addProjectMutation = useMutation({
    mutationFn: async (newProject) => {
      const { data, error } = await supabase.from('projects').insert(newProject).single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', updatedProject.id)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  return {
    projects,
    isLoading,
    error,
    addProjectMutation,
    updateProjectMutation,
  };
};