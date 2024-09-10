import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const fetchPlantings = async () => {
  // Mock function to fetch plantings
  return [
    { id: 1, variety: 'Moringa', location: 'North Field', plantingDate: '2024-03-15', quantity: 100 },
    { id: 2, variety: 'Cherry Tomato', location: 'Greenhouse 1', plantingDate: '2024-04-01', quantity: 200 },
  ];
};

const fetchVarieties = async () => {
  // Mock function to fetch varieties (you can reuse the one from Plants component)
  return [
    { id: 1, name: 'Moringa' },
    { id: 2, name: 'Cherry Tomato' },
  ];
};

const fetchLocations = async () => {
  // Mock function to fetch locations (you can reuse the one from PlantLocations component)
  return [
    { id: 1, name: 'North Field' },
    { id: 2, name: 'Greenhouse 1' },
  ];
};

const Plantings = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPlanting, setNewPlanting] = useState({ variety: '', location: '', plantingDate: null, quantity: '' });
  const queryClient = useQueryClient();

  const { data: plantings, isLoading: plantingsLoading, error: plantingsError } = useQuery({
    queryKey: ['plantings'],
    queryFn: fetchPlantings,
  });

  const { data: varieties, isLoading: varietiesLoading } = useQuery({
    queryKey: ['varieties'],
    queryFn: fetchVarieties,
  });

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const addPlantingMutation = useMutation({
    mutationFn: (newPlanting) => {
      // Mock function to add a new planting
      return Promise.resolve({ id: Date.now(), ...newPlanting });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('plantings');
      setIsFormOpen(false);
      setNewPlanting({ variety: '', location: '', plantingDate: null, quantity: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPlantingMutation.mutate(newPlanting);
  };

  if (plantingsLoading || varietiesLoading || locationsLoading) return <div>Loading...</div>;
  if (plantingsError) return <div>Error fetching plantings: {plantingsError.message}</div>;

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
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Planting</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="variety" className="block text-sm font-medium text-gray-700">Variety</label>
                <Select
                  value={newPlanting.variety}
                  onValueChange={(value) => setNewPlanting({ ...newPlanting, variety: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {varieties.map((variety) => (
                      <SelectItem key={variety.id} value={variety.name}>{variety.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <Select
                  value={newPlanting.location}
                  onValueChange={(value) => setNewPlanting({ ...newPlanting, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Planting Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPlanting.plantingDate ? format(new Date(newPlanting.plantingDate), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newPlanting.plantingDate}
                      onSelect={(date) => setNewPlanting({ ...newPlanting, plantingDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <Input
                  id="quantity"
                  type="number"
                  value={newPlanting.quantity}
                  onChange={(e) => setNewPlanting({ ...newPlanting, quantity: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Planting</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plantings;