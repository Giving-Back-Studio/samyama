import React from 'react';
import { Calendar } from "@/components/ui/calendar";

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
          DayContent: (props) => (
            <>
              {props.day.getDate()}
              {renderDay(props.day)}
            </>
          ),
        }}
      />
    </div>
  );
};

export default ProjectCalendar;