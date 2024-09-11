import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NextActions from './NextActions';

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

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading project...</div>;
  if (error) return <div>Error loading project: {error.message}</div>;
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
              <p>{project.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{project.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Start Date</h3>
              <p>{project.start_date}</p>
            </div>
            <div>
              <h3 className="font-semibold">End Date</h3>
              <p>{project.end_date}</p>
            </div>
            <div>
              <h3 className="font-semibold">Assigned To</h3>
              <p>{project.assigned_to}</p>
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

export default ProjectView;