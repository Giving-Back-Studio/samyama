import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import NextActions from './NextActions';

const ProjectList = ({ projects, onViewDetails }) => {
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleExpand = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
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
                      actions={project.nextActions || []}
                      onToggleComplete={(actionId) => {
                        // Implement toggle complete logic
                      }}
                      onReorder={(result) => {
                        // Implement reorder logic
                      }}
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