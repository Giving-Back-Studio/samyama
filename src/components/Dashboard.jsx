import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import ProjectDialog from './ProjectDialog';
import TaskList from './TaskList';
import WeatherWidget from './WeatherWidget';
import CropPlanner from './CropPlanner';

const fetchProjects = async () => {
  // Mock function to fetch projects
  return [
    { id: 1, name: 'Spring Planting', status: 'In Progress', assignedTo: 'John Doe', completed: false, nextActions: ['Prepare soil', 'Order seeds'] },
    { id: 2, name: 'Irrigation System Upgrade', status: 'In Progress', assignedTo: 'John Doe', completed: false, nextActions: ['Research pump options', 'Contact suppliers'] },
    { id: 3, name: 'Harvest Planning', status: 'To Do', assignedTo: 'Jane Smith', completed: false, nextActions: ['Review crop calendar', 'Estimate yields'] },
  ];
};

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [openSections, setOpenSections] = useState({
    myProjects: true,
    enterpriseActivity: true,
    inProgress: true,
    toDo: true,
    tasks: true,
    weather: true,
    cropPlanner: true
  });

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const renderProjects = (status) => {
    return projects
      .filter(project => project.status === status)
      .map(project => (
        <div key={project.id} className="mb-4 p-4 border rounded-lg">
          <h3 
            className="text-lg font-semibold cursor-pointer hover:text-blue-600"
            onClick={() => handleProjectClick(project)}
          >
            {project.name}
          </h3>
          <ul className="list-disc list-inside mt-2">
            {project.nextActions.map((action, index) => (
              <li key={index} className="text-sm text-gray-600">{action}</li>
            ))}
          </ul>
        </div>
      ));
  };

  const renderCollapsibleSection = (title, content, section) => (
    <Collapsible open={openSections[section]} onOpenChange={() => toggleSection(section)}>
      <CollapsibleTrigger className="flex items-center w-full justify-between p-2 bg-gray-100 rounded-t-lg">
        <h2 className="text-xl font-bold">{title}</h2>
        {openSections[section] ? <ChevronDown /> : <ChevronRight />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
        {content}
      </CollapsibleContent>
    </Collapsible>
  );

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="space-y-4">
        {renderCollapsibleSection(
          "My Projects",
          <div className="space-y-4">
            {renderCollapsibleSection(
              "In Progress Projects",
              renderProjects('In Progress'),
              'inProgress'
            )}
            {renderCollapsibleSection(
              "To Do Projects",
              renderProjects('To Do'),
              'toDo'
            )}
          </div>,
          'myProjects'
        )}
        {renderCollapsibleSection(
          "Enterprise Activity",
          <div className="space-y-4">
            {renderCollapsibleSection(
              "Tasks",
              <TaskList fullView={true} />,
              'tasks'
            )}
            {renderCollapsibleSection(
              "Weather",
              <WeatherWidget />,
              'weather'
            )}
            {renderCollapsibleSection(
              "Crop Planner",
              <CropPlanner />,
              'cropPlanner'
            )}
          </div>,
          'enterpriseActivity'
        )}
      </div>
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={(updatedProject) => {
            // Handle project update
            console.log('Project updated:', updatedProject);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;