import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fetchCrops = async () => {
  // This is a mock function. In a real app, you'd fetch crop data from an API.
  return [
    { id: 1, name: 'Tomatoes', plantingDate: '2024-03-15', harvestDate: '2024-07-15' },
    { id: 2, name: 'Lettuce', plantingDate: '2024-04-01', harvestDate: '2024-05-15' },
    { id: 3, name: 'Carrots', plantingDate: '2024-03-20', harvestDate: '2024-06-20' },
  ];
};

const CropPlanner = () => {
  const { data: crops, isLoading, error } = useQuery({
    queryKey: ['crops'],
    queryFn: fetchCrops,
  });

  if (isLoading) return <div>Loading crop data...</div>;
  if (error) return <div>Error fetching crop data</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Crop</TableHead>
          <TableHead>Planting Date</TableHead>
          <TableHead>Expected Harvest</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {crops.map(crop => (
          <TableRow key={crop.id}>
            <TableCell>{crop.name}</TableCell>
            <TableCell>{crop.plantingDate}</TableCell>
            <TableCell>{crop.harvestDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CropPlanner;