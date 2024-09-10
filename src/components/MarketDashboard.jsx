import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarketDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Market Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Market analysis and overview features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDashboard;