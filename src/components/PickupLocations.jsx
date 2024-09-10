import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PickupLocations = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pickup Locations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pickup Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Pickup location management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PickupLocations;