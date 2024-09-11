import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NextActions from './NextActions';
import { ErrorBoundary } from 'react-error-boundary';

const fetchProject = async (id) => {
  console.log('Fetching project with id:', id);
  if (!id) throw new Error('Project ID is required');
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    if (!data) {
      console.error('Project not found for id:', id);
      throw new Error('Project not found');
    }
    console.log('Fetched project data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchProject:', error);
    throw error;
  }
};

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong:</h2>
    <pre className="text-sm overflow-auto">{error.message}</pre>
    <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
  </div>
);

const ProjectViewContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log('ProjectViewContent rendered. ID:', id);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  console.log('Query result:', { project, isLoading, error });

  if (isLoading) return <div>Loading project...</div>;
  if (error) {
    console.error('Error in ProjectView:', error);
    return <div>Error loading project: {error.message}</div>;
  }
  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Button onClick={() => navigate('/app/projects')}>Back to Projects</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{project.description || 'No description available'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{project.status || 'Not set'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Start Date</h3>
              <p>{project.start_date || 'Not set'}</p>
            </div>
            <div>
              <h3 className="font-semibold">End Date</h3>
              <p>{project.end_date || 'Not set'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Assigned To</h3>
              <p>{project.assigned_to || 'Not assigned'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Next Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <NextActions projectId={project.id} actions={project.next_actions || []} />
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectView = () => {
  console.log('ProjectView component rendered');
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log('Resetting error boundary');
        window.location.reload();
      }}
      onError={(error, info) => {
        console.error('Error caught by ErrorBoundary:', error);
        console.error('Component stack:', info.componentStack);
      }}
    >
      <ProjectViewContent />
    </ErrorBoundary>
  );
};

export default ProjectView;