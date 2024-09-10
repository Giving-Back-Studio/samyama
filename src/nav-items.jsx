import { HomeIcon, Leaf, DollarSign, ShoppingBag, Users, Settings } from "lucide-react";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import OnboardingPage from "./components/OnboardingPage";
import Dashboard from "./components/Dashboard";
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

export const navItems = [
  {
    title: "Home",
    to: "/app",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Projects",
    to: "/app/projects",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Projects />,
  },
  {
    title: "Plant Trackers",
    icon: <Leaf className="h-4 w-4" />,
    children: [
      { title: "Plant Varieties", to: "/app/plants", page: <Plants /> },
      { title: "Plant Locations", to: "/app/plant-locations", page: <PlantLocations /> },
      { title: "Plantings", to: "/app/plantings", page: <Plantings /> },
    ],
  },
  {
    title: "Accounting",
    icon: <DollarSign className="h-4 w-4" />,
    children: [
      { title: "Transactions", to: "/app/transactions", page: <Transactions /> },
      { title: "P&L Statement", to: "/app/pl-statement", page: <PLStatement /> },
      { title: "Cash Flow", to: "/app/cash-flow", page: <CashFlow /> },
      { title: "Balance Sheet", to: "/app/balance-sheet", page: <BalanceSheet /> },
      { title: "Budgeting", to: "/app/budgeting", page: <Budgeting /> },
    ],
  },
  {
    title: "Market",
    icon: <ShoppingBag className="h-4 w-4" />,
    children: [
      { title: "Dashboard", to: "/app/market-dashboard", page: <MarketDashboard /> },
      { title: "Products", to: "/app/products", page: <Products /> },
      { title: "Online Store", to: "/app/online-store", page: <OnlineStore /> },
      { title: "Pickup Locations", to: "/app/pickup-locations", page: <PickupLocations /> },
    ],
  },
  {
    title: "Contacts",
    to: "/app/contacts",
    icon: <Users className="h-4 w-4" />,
    page: <Contacts />,
  },
  {
    title: "Account Settings",
    to: "/app/account-settings",
    icon: <Settings className="h-4 w-4" />,
    page: <AccountSettings />,
  },
  {
    title: "User Management",
    to: "/app/user-management",
    icon: <Users className="h-4 w-4" />,
    page: <UserManagement />,
  },
];

export const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
];