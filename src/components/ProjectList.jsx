import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, GripVertical } from "lucide-react";
import { Droppable, Draggable } from '@hello-pangea/dnd';

const ProjectList = ({ projects, status, openProject, setOpenProject, toggleActionCompletion }) => {
  const filteredProjects = projects.filter(project => project.status === status);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{status}</h3>
      <Droppable droppableId={status} type="PROJECT">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Accordion type="single" collapsible value={openProject} onValueChange={setOpenProject}>
              {filteredProjects.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <AccordionItem value={project.id.toString()}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <span {...provided.dragHandleProps}><GripVertical className="inline mr-2" /></span>
                            <span className="text-sm md:text-base">{project.name}</span>
                            <div className="flex items-center space-x-2">
                              {status === 'In Progress' ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => { e.stopPropagation(); /* Mark as complete logic */ }}
                                  className="text-xs md:text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark as complete
                                </Button>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => { e.stopPropagation(); /* Mark as in progress logic */ }}
                                  className="text-xs md:text-sm"
                                >
                                  <ArrowRight className="h-4 w-4 mr-1" />
                                  Mark as in progress
                                </Button>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Droppable droppableId={project.id.toString()} type="NEXT_ACTION">
                            {(provided) => (
                              <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2"
                              >
                                {project.nextActions.map((action, index) => (
                                  <Draggable key={action.id} draggableId={action.id} index={index}>
                                    {(provided) => (
                                      <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md"
                                      >
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleActionCompletion(project.id, action.id)}
                                        >
                                          <CheckCircle className={`h-4 w-4 ${action.completed ? 'text-green-500' : 'text-gray-300'}`} />
                                        </Button>
                                        <span className={`text-xs md:text-sm ${action.completed ? 'line-through text-gray-500' : ''}`}>{action.content}</span>
                                      </li>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </ul>
                            )}
                          </Droppable>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  )}
                </Draggable>
              ))}
            </Accordion>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ProjectList;