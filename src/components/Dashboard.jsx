import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeatherWidget from './WeatherWidget';
import TaskBoard from './TaskBoard';
import CropPlanner from './CropPlanner';
import EcosystemMap from './EcosystemMap';
import Styleguide from './Styleguide';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Permaculture Farm Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
          <TabsTrigger value="styleguide">Styleguide</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <WeatherWidget />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskBoard />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskBoard />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Crop Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CropPlanner />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ecosystem">
          <Card>
            <CardHeader>
              <CardTitle>Ecosystem Map</CardTitle>
            </CardHeader>
            <CardContent>
              <EcosystemMap />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="styleguide">
          <Card>
            <CardHeader>
              <CardTitle>Styleguide</CardTitle>
            </CardHeader>
            <CardContent>
              <Styleguide />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;