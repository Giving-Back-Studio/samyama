import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Plants = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Plants</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plant Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Plant tracking and management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plants;