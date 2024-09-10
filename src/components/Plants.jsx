import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const fetchVarieties = async () => {
  // Mock function to fetch varieties
  return [
    { id: 1, name: 'Moringa', botanicalName: 'Moringa oleifera', type: 'Tree' },
    { id: 2, name: 'Cherry Tomato', botanicalName: 'Solanum lycopersicum var. cerasiforme', type: 'Vegetable' },
  ];
};

const Plants = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newVariety, setNewVariety] = useState({ name: '', botanicalName: '', type: '' });
  const queryClient = useQueryClient();

  const { data: varieties, isLoading, error } = useQuery({
    queryKey: ['varieties'],
    queryFn: fetchVarieties,
  });

  const addVarietyMutation = useMutation({
    mutationFn: (newVariety) => {
      // Mock function to add a new variety
      return Promise.resolve({ id: Date.now(), ...newVariety });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('varieties');
      setIsFormOpen(false);
      setNewVariety({ name: '', botanicalName: '', type: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addVarietyMutation.mutate(newVariety);
  };

  if (isLoading) return <div>Loading varieties...</div>;
  if (error) return <div>Error fetching varieties: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Plant Varieties</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Variety</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Variety List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Botanical Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {varieties.map((variety) => (
                <TableRow key={variety.id}>
                  <TableCell>{variety.name}</TableCell>
                  <TableCell>{variety.botanicalName}</TableCell>
                  <TableCell>{variety.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Variety</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input
                  id="name"
                  value={newVariety.name}
                  onChange={(e) => setNewVariety({ ...newVariety, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="botanicalName" className="block text-sm font-medium text-gray-700">Botanical Name</label>
                <Input
                  id="botanicalName"
                  value={newVariety.botanicalName}
                  onChange={(e) => setNewVariety({ ...newVariety, botanicalName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <Input
                  id="type"
                  value={newVariety.type}
                  onChange={(e) => setNewVariety({ ...newVariety, type: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Variety</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plants;