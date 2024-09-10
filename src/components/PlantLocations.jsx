import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const fetchLocations = async () => {
  // Mock function to fetch locations
  return [
    { id: 1, name: 'North Field', size: '2 acres' },
    { id: 2, name: 'Greenhouse 1', size: '500 sq ft' },
  ];
};

const PlantLocations = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', size: '' });
  const queryClient = useQueryClient();

  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const addLocationMutation = useMutation({
    mutationFn: (newLocation) => {
      // Mock function to add a new location
      return Promise.resolve({ id: Date.now(), ...newLocation });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('locations');
      setIsFormOpen(false);
      setNewLocation({ name: '', size: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addLocationMutation.mutate(newLocation);
  };

  if (isLoading) return <div>Loading locations...</div>;
  if (error) return <div>Error fetching locations: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Plant Locations</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Location</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Location List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
                <Input
                  id="size"
                  value={newLocation.size}
                  onChange={(e) => setNewLocation({ ...newLocation, size: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Location</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantLocations;