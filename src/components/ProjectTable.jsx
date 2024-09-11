import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, ChevronUp, ChevronDown } from "lucide-react";

const ProjectTable = ({ projects, onViewDetails, sortBy, sortOrder, onSort }) => {
  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort('name')} className="cursor-pointer">
            Name {renderSortIcon('name')}
          </TableHead>
          <TableHead onClick={() => onSort('status')} className="cursor-pointer">
            Status {renderSortIcon('status')}
          </TableHead>
          <TableHead onClick={() => onSort('startDate')} className="cursor-pointer">
            Start Date {renderSortIcon('startDate')}
          </TableHead>
          <TableHead onClick={() => onSort('endDate')} className="cursor-pointer">
            End Date {renderSortIcon('endDate')}
          </TableHead>
          <TableHead onClick={() => onSort('assignedTo')} className="cursor-pointer">
            Assigned To {renderSortIcon('assignedTo')}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.status}</TableCell>
            <TableCell>{project.startDate}</TableCell>
            <TableCell>{project.endDate}</TableCell>
            <TableCell>{project.assignedTo}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(project)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectTable;