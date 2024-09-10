import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PLStatement = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">P&L Statement</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profit and Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <p>P&L statement features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PLStatement;