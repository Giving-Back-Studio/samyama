import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import OnboardingPage from "./components/OnboardingPage";
import Projects from "./components/Projects";
import Plants from "./components/Plants";
import PlantLocations from "./components/PlantLocations";
import Plantings from "./components/Plantings";
import Transactions from "./components/Transactions";
import PLStatement from "./components/PLStatement";
import CashFlow from "./components/CashFlow";
import BalanceSheet from "./components/BalanceSheet";
import Budgeting from "./components/Budgeting";
import MarketDashboard from "./components/MarketDashboard";
import Products from "./components/Products";
import OnlineStore from "./components/OnlineStore";
import PickupLocations from "./components/PickupLocations";
import Contacts from "./components/Contacts";
import AccountSettings from "./components/AccountSettings";
import UserManagement from "./components/UserManagement";
import { ErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ErrorFallback = ({ error }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong:</h2>
    <pre className="text-sm overflow-auto">{error.message}</pre>
  </div>
);

const App = () => (
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/app" element={<Layout />}>
                <Route index element={<Navigate to="/app/projects" replace />} />
                <Route path="projects" element={<Projects />} />
                <Route path="plants" element={<Plants />} />
                <Route path="plant-locations" element={<PlantLocations />} />
                <Route path="plantings" element={<Plantings />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="pl-statement" element={<PLStatement />} />
                <Route path="cash-flow" element={<CashFlow />} />
                <Route path="balance-sheet" element={<BalanceSheet />} />
                <Route path="budgeting" element={<Budgeting />} />
                <Route path="market-dashboard" element={<MarketDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="online-store" element={<OnlineStore />} />
                <Route path="pickup-locations" element={<PickupLocations />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="account-settings" element={<AccountSettings />} />
                <Route path="user-management" element={<UserManagement />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export default App;