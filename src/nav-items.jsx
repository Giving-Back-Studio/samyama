import { Briefcase, Leaf, DollarSign, ShoppingBag, Users, Settings } from "lucide-react";
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

export const navItems = [
  {
    title: "Projects",
    to: "/projects",
    icon: <Briefcase className="h-4 w-4" />,
    page: <Projects />,
  },
  {
    title: "Plant Trackers",
    icon: <Leaf className="h-4 w-4" />,
    children: [
      { title: "Plant Varieties", to: "/plants", page: <Plants /> },
      { title: "Plant Locations", to: "/plant-locations", page: <PlantLocations /> },
      { title: "Plantings", to: "/plantings", page: <Plantings /> },
    ],
  },
  {
    title: "Accounting",
    icon: <DollarSign className="h-4 w-4" />,
    children: [
      { title: "Transactions", to: "/transactions", page: <Transactions /> },
      { title: "P&L Statement", to: "/pl-statement", page: <PLStatement /> },
      { title: "Cash Flow", to: "/cash-flow", page: <CashFlow /> },
      { title: "Balance Sheet", to: "/balance-sheet", page: <BalanceSheet /> },
      { title: "Budgeting", to: "/budgeting", page: <Budgeting /> },
    ],
  },
  {
    title: "Market",
    icon: <ShoppingBag className="h-4 w-4" />,
    children: [
      { title: "Dashboard", to: "/market-dashboard", page: <MarketDashboard /> },
      { title: "Products", to: "/products", page: <Products /> },
      { title: "Online Store", to: "/online-store", page: <OnlineStore /> },
      { title: "Pickup Locations", to: "/pickup-locations", page: <PickupLocations /> },
    ],
  },
  {
    title: "Contacts",
    to: "/contacts",
    icon: <Users className="h-4 w-4" />,
    page: <Contacts />,
  },
  {
    title: "Account Settings",
    to: "/account-settings",
    icon: <Settings className="h-4 w-4" />,
    page: <AccountSettings />,
  },
  {
    title: "User Management",
    to: "/user-management",
    icon: <Users className="h-4 w-4" />,
    page: <UserManagement />,
  },
];

export const publicRoutes = [
  { path: "/signup", element: <SignupPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
];