import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NewPlantingForm from './NewPlantingForm';

const fetchPlantings = async () => {
  // Mock function to fetch plantings
  return [
    { id: 1, variety: 'Moringa', location: 'North Field', plantingDate: '2024-03-15', quantity: 100 },
    { id: 2, variety: 'Cherry Tomato', location: 'Greenhouse 1', plantingDate: '2024-04-01', quantity: 200 },
  ];
};

const Plantings = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: plantings, isLoading, error } = useQuery({
    queryKey: ['plantings'],
    queryFn: fetchPlantings,
  });

  const addPlantingMutation = useMutation({
    mutationFn: (newPlanting) => {
      // Mock function to add a new planting
      return Promise.resolve({ id: Date.now(), ...newPlanting });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['plantings', 'varieties', 'locations']);
      setIsFormOpen(false);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching plantings: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Plantings</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Planting</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Planting List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variety</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Planting Date</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plantings.map((planting) => (
                <TableRow key={planting.id}>
                  <TableCell>{planting.variety}</TableCell>
                  <TableCell>{planting.location}</TableCell>
                  <TableCell>{planting.plantingDate}</TableCell>
                  <TableCell>{planting.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <NewPlantingForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => addPlantingMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Plantings;