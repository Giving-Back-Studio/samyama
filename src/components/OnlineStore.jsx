import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OnlineStore = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Online Store</h1>
      <Card>
        <CardHeader>
          <CardTitle>Store Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Online store management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineStore;