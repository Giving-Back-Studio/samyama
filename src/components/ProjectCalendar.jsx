import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const ProjectCalendar = ({ projects }) => {
  const projectDates = projects.reduce((acc, project) => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    acc[startDate.toDateString()] = [...(acc[startDate.toDateString()] || []), project];
    acc[endDate.toDateString()] = [...(acc[endDate.toDateString()] || []), project];
    return acc;
  }, {});

  const renderDay = (day) => {
    const dateString = day.toDateString();
    const dayProjects = projectDates[dateString];
    if (!dayProjects) return null;
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Calendar
        mode="single"
        selected={new Date()}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => (
            <>
              {date.getDate()}
              {renderDay(date)}
            </>
          ),
        }}
      />
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Project Timeline:</h3>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="flex justify-between items-center">
              <span>{project.name}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(project.startDate), 'MMM d')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectCalendar;