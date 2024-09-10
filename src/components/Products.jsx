import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Product management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;