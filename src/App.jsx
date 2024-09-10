import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import Plants from "./components/Plants";
import PlantLocations from "./components/PlantLocations";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="plants" element={<Plants />} />
            <Route path="plant-locations" element={<PlantLocations />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;