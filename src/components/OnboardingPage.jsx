import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OnboardingPage = () => {
  const [step, setStep] = useState(1);

  const renderStep1 = () => (
    <div className="space-y-4">
      <Input placeholder="What do you call your farm?" />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="mx">Mexico</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="Address" />
      <Input placeholder="City" />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="State/Province" />
        </SelectTrigger>
        <SelectContent>
          {/* Add state/province options here */}
        </SelectContent>
      </Select>
      <Input placeholder="Postal Code" />
      <Button onClick={() => setStep(2)}>Next</Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Measurement System" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="imperial">US Customary</SelectItem>
          <SelectItem value="metric">Metric</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Timezone" />
        </SelectTrigger>
        <SelectContent>
          {/* Add timezone options here */}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Account Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">US Dollar</SelectItem>
          <SelectItem value="cad">Canadian Dollar</SelectItem>
          <SelectItem value="mxn">Mexican Peso</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="USDA Hardiness Zone" />
        </SelectTrigger>
        <SelectContent>
          {/* Add hardiness zone options here */}
        </SelectContent>
      </Select>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
        <Button>Get Started</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Samyama</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between">
            <span className={`font-bold ${step === 1 ? 'text-green-600' : ''}`}>About Your Farm</span>
            <span className={`font-bold ${step === 2 ? 'text-green-600' : ''}`}>Preferences</span>
          </div>
          {step === 1 ? renderStep1() : renderStep2()}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;