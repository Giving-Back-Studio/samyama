import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">An error occurred:</h2>
    <p className="text-sm">{error.message}</p>
    <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
  </div>
);

const ProjectDetails = ({ project }) => (
  <Card>
    <CardHeader>
      <CardTitle>Project Details</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { label: 'Name', value: project.name },
          { label: 'Description', value: project.description },
          { label: 'Status', value: project.status },
          { label: 'Start Date', value: project.start_date },
          { label: 'End Date', value: project.end_date },
          { label: 'Assigned To', value: project.assigned_to },
        ].map(({ label, value }) => (
          <div key={label} className="border-t border-gray-200 pt-4">
            <dt className="font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value || 'Not specified'}</dd>
          </div>
        ))}
      </dl>
    </CardContent>
  </Card>
);

const ProjectViewContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center p-4">Loading project...</div>;
  if (error) return <ErrorFallback error={error} resetErrorBoundary={() => navigate('/app/projects')} />;
  if (!project) return <div className="text-center p-4">Project not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name || 'Unnamed Project'}</h1>
        <Button onClick={() => navigate('/app/projects')}>Back to Projects</Button>
      </div>
      <ProjectDetails project={project} />
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