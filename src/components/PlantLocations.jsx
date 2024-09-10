import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlantLocations = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Plant Locations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Location Map</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Plant location mapping features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantLocations;