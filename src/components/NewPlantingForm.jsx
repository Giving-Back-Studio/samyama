import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const fetchVarieties = async () => {
  // Mock function to fetch varieties
  return [
    { id: 1, name: 'Moringa' },
    { id: 2, name: 'Cherry Tomato' },
  ];
};

const fetchLocations = async () => {
  // Mock function to fetch locations
  return [
    { id: 1, name: 'North Field' },
    { id: 2, name: 'Greenhouse 1' },
  ];
};

const NewPlantingForm = ({ onClose, onSubmit }) => {
  const [newPlanting, setNewPlanting] = useState({ variety: '', location: '', plantingDate: null, quantity: '' });
  const [newVariety, setNewVariety] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const queryClient = useQueryClient();

  const { data: varieties } = useQuery({
    queryKey: ['varieties'],
    queryFn: fetchVarieties,
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const addVarietyMutation = useMutation({
    mutationFn: (name) => {
      // Mock function to add a new variety
      return Promise.resolve({ id: Date.now(), name });
    },
    onSuccess: (newVariety) => {
      queryClient.setQueryData(['varieties'], (old) => [...old, newVariety]);
      setNewPlanting((prev) => ({ ...prev, variety: newVariety.name }));
      setNewVariety('');
    },
  });

  const addLocationMutation = useMutation({
    mutationFn: (name) => {
      // Mock function to add a new location
      return Promise.resolve({ id: Date.now(), name });
    },
    onSuccess: (newLocation) => {
      queryClient.setQueryData(['locations'], (old) => [...old, newLocation]);
      setNewPlanting((prev) => ({ ...prev, location: newLocation.name }));
      setNewLocation('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPlanting);
  };

  const handleAddVariety = () => {
    if (newVariety) {
      addVarietyMutation.mutate(newVariety);
    }
  };

  const handleAddLocation = () => {
    if (newLocation) {
      addLocationMutation.mutate(newLocation);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Planting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="variety" className="block text-sm font-medium text-gray-700">Variety</label>
              <div className="flex space-x-2">
                <Select
                  value={newPlanting.variety}
                  onValueChange={(value) => setNewPlanting({ ...newPlanting, variety: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {varieties?.map((variety) => (
                      <SelectItem key={variety.id} value={variety.name}>{variety.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="New variety"
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                />
                <Button type="button" onClick={handleAddVariety}>Add</Button>
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <div className="flex space-x-2">
                <Select
                  value={newPlanting.location}
                  onValueChange={(value) => setNewPlanting({ ...newPlanting, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="New location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
                <Button type="button" onClick={handleAddLocation}>Add</Button>
              </div>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Planting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPlantingForm;