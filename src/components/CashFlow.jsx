import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CashFlow = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cash Flow</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cash flow analysis features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlow;