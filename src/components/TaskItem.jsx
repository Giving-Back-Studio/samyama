import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const TaskItem = ({ content }) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3">
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};

export default TaskItem;