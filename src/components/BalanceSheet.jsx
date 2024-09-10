import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BalanceSheet = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Balance Sheet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Balance sheet features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheet;