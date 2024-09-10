import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityList = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enterprise Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <ul className="space-y-2">
            {activities.map(activity => (
              <li key={activity.id} className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-2">
                <span className="text-sm md:text-base">{activity.description}</span>
                <span className="text-xs md:text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm md:text-base">No recent activity</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityList;