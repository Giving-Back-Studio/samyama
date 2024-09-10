import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, ArrowUp, ArrowDown } from "lucide-react";

const ProjectList = ({ projects, listFilter, setListFilter, toggleProjectCompletion, setSelectedProject }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortedProjects = useMemo(() => {
    const sortableProjects = [...projects];
    if (sortConfig.key) {
      sortableProjects.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProjects;
  }, [projects, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project List</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={listFilter === 'all' ? 'secondary' : 'ghost'} 
            onClick={() => setListFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={listFilter === 'active' ? 'secondary' : 'ghost'} 
            onClick={() => setListFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={listFilter === 'completed' ? 'secondary' : 'ghost'} 
            onClick={() => setListFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                Name <SortIcon column="name" />
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status <SortIcon column="status" />
              </TableHead>
              <TableHead onClick={() => handleSort('startDate')} className="cursor-pointer">
                Start Date <SortIcon column="startDate" />
              </TableHead>
              <TableHead onClick={() => handleSort('endDate')} className="cursor-pointer">
                End Date <SortIcon column="endDate" />
              </TableHead>
              <TableHead onClick={() => handleSort('assignedTo')} className="cursor-pointer">
                Assigned To <SortIcon column="assignedTo" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => (
              <TableRow key={project.id} className="cursor-pointer hover:bg-gray-100">
                <TableCell onClick={() => setSelectedProject(project)}>{project.name}</TableCell>
                <TableCell onClick={() => setSelectedProject(project)}>{project.status}</TableCell>
                <TableCell onClick={() => setSelectedProject(project)}>{project.startDate}</TableCell>
                <TableCell onClick={() => setSelectedProject(project)}>{project.endDate}</TableCell>
                <TableCell onClick={() => setSelectedProject(project)}>{project.assignedTo}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProjectCompletion.mutate(project)}
                  >
                    <CheckCircle className={`h-5 w-5 ${project.completed ? 'text-green-500' : 'text-gray-300'}`} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProjectList;