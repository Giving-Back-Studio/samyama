import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AccountSettings = () => {
  const [farmName, setFarmName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [timezone, setTimezone] = useState('');
  const [measurementSystem, setMeasurementSystem] = useState('');
  const [currency, setCurrency] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Account settings updated:', { farmName, email, country, address, city, state, postalCode, timezone, measurementSystem, currency });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">Farm Name</label>
              <Input id="farmName" value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="Enter farm name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Primary Contact Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="mx">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Enter state/province" />
              </div>
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
              <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Enter postal code" />
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time</SelectItem>
                  <SelectItem value="cst">Central Time</SelectItem>
                  <SelectItem value="mst">Mountain Time</SelectItem>
                  <SelectItem value="pst">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="measurementSystem" className="block text-sm font-medium text-gray-700">Measurement System</label>
              <Select value={measurementSystem} onValueChange={setMeasurementSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select measurement system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial</SelectItem>
                  <SelectItem value="metric">Metric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">US Dollar</SelectItem>
                  <SelectItem value="cad">Canadian Dollar</SelectItem>
                  <SelectItem value="mxn">Mexican Peso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;