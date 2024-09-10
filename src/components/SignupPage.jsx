import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Ready for a more organized and productive farm?</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input type="email" placeholder="Email Address" />
            <Input type="password" placeholder="Password" />
            <p className="text-xs text-gray-500">8 characters min • One uppercase • One lowercase</p>
            <Button className="w-full" type="submit">Start Your Free Trial Now</Button>
          </form>
          <p className="mt-4 text-sm text-center">
            By creating an account, you agree to our <Link to="/terms" className="text-blue-600">Terms</Link> and have read and acknowledge the <Link to="/privacy" className="text-blue-600">Privacy Policy</Link>.
          </p>
          <p className="mt-4 text-sm text-center">
            Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;