import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Editor } from '@tinymce/tinymce-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const fetchProjects = async () => {
  // Mock function to fetch projects. In a real app, this would be an API call.
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', assignedTo: 'John Doe', completed: false, nextActions: ['Prepare soil', 'Order seeds'] },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', assignedTo: 'John Doe', completed: false, nextActions: ['Research pump options', 'Contact suppliers'] },
    { id: 3, name: 'Harvest Planning', status: 'To Do', assignedTo: 'Jane Smith', completed: false, nextActions: ['Review crop calendar', 'Estimate yields'] },
  ];
};

const Dashboard = () => {
  const [notes, setNotes] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const editorRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const toggleProjectCompletion = useMutation({
    mutationFn: (project) => {
      // Mock function to toggle project completion. In a real app, this would be an API call.
      return Promise.resolve({ ...project, completed: !project.completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });

  const handleSaveNotes = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      // In a real app, this would save the notes to a backend
      console.log('Saving notes:', content);
      setNotes(content);
    }
  };

  const currentProjects = projects?.filter(project => project.status === 'In Progress' && project.assignedTo === 'John Doe') || [];

  const allNextActions = currentProjects.flatMap(project => 
    project.nextActions.map(action => ({ projectName: project.name, action }))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading projects...</p>}
            {error && <p>Error loading projects: {error.message}</p>}
            {currentProjects.map(project => (
              <div key={project.id} className="mb-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={project.completed}
                      onCheckedChange={() => toggleProjectCompletion.mutate(project)}
                    />
                    <span>{project.completed ? 'Completed' : 'In Progress'}</span>
                  </div>
                </div>
                <Button 
                  variant="link" 
                  onClick={() => setSelectedProject(project)}
                  className="mt-2 p-0"
                >
                  View Details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Next Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {allNextActions.map((item, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{item.projectName}:</span> {item.action}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Editor
                apiKey="your-tinymce-api-key"
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={notes}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            </div>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </CardContent>
        </Card>
      </div>
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProject.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Assigned To:</strong> {selectedProject.assignedTo}</p>
              <h4 className="font-semibold mt-4 mb-2">Next Actions:</h4>
              <ul className="list-disc list-inside">
                {selectedProject.nextActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedProject(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;