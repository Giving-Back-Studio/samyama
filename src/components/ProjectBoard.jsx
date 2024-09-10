import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectBoard = ({ projects }) => {
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map(column => (
        <Card key={column}>
          <CardHeader>
            <CardTitle>{column}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {projects
                .filter(project => project.status === column)
                .map(project => (
                  <li key={project.id} className="bg-white p-2 rounded shadow">
                    {project.name}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectBoard;