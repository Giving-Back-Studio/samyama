import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-6">The all-in-one farm software built for growth.</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Join 4,000+ farmers & ranchers worldwide who trust our farm management software to streamline operations by bringing activities, records, sales and insights together.
      </p>
      <div className="space-x-4">
        <Button asChild size="lg">
          <Link to="/signup">Start your free trial</Link>
        </Button>
        <Button variant="outline" size="lg">
          Watch a demo
        </Button>
      </div>
      <div className="mt-8 text-sm text-gray-600 space-x-4">
        <span>✓ 14 day free trial</span>
        <span>✓ No credit card required</span>
        <span>✓ Full access to all features</span>
      </div>
    </div>
  );
};

export default LandingPage;