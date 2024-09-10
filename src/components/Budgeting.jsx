import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Budgeting = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Budgeting</h1>
      <Card>
        <CardHeader>
          <CardTitle>Budget Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Budgeting and financial planning features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Budgeting;