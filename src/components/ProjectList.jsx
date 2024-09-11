import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, CheckCircle, Circle } from "lucide-react";
import NextActions from './NextActions';

const ProjectList = ({ projects, onViewDetails, onStatusChange }) => {
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleExpand = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleStatusChange = (projectId, currentStatus) => {
    let newStatus;
    if (currentStatus === 'To Do') {
      newStatus = 'In Progress';
    } else if (currentStatus === 'In Progress') {
      newStatus = 'Done';
    }
    if (newStatus) {
      onStatusChange(projectId, newStatus);
    }
  };

  return (
    <div className="space-y-2">
      {projects.map((project, index) => (
        <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="bg-white p-3 rounded shadow"
            >
              <Collapsible
                open={expandedProjects[project.id]}
                onOpenChange={() => toggleExpand(project.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{project.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(project.id, project.status)}
                    >
                      {project.status === 'Done' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(project)}
                    >
                      View Details
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {expandedProjects[project.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="mt-2">
                    <h4 className="font-medium mb-1">Next Actions:</h4>
                    <NextActions
                      projectId={project.id}
                      actions={project.nextActions || []}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default ProjectList;