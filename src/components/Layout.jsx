import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Leaf, DollarSign, ShoppingBag, Users, Settings, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong:</h2>
    <pre className="text-sm overflow-auto">{error.message}</pre>
  </div>
);

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isGroupOpen = (group) => {
    return openGroup === group || isPathInGroup(location.pathname, group);
  };

  const isPathInGroup = (path, group) => {
    const groupPaths = {
      plantTrackers: ['/app/plants', '/app/plant-locations', '/app/plantings'],
      accounting: ['/app/transactions', '/app/pl-statement', '/app/cash-flow', '/app/balance-sheet', '/app/budgeting'],
      market: ['/app/market-dashboard', '/app/products', '/app/online-store', '/app/pickup-locations'],
    };
    return groupPaths[group]?.some(groupPath => path.startsWith(groupPath)) || false;
  };

  const toggleGroup = (group, firstItemPath) => {
    if (openGroup === group) {
      setOpenGroup(null);
    } else {
      setOpenGroup(group);
      navigate(firstItemPath);
    }
  };

  const NavContent = () => (
    <ul className="space-y-2 p-4">
      <NavItem to="/app" icon={<Home size={20} />} label="Home" currentPath={location.pathname} />
      <NavItem to="/app/projects" icon={<Briefcase size={20} />} label="Projects" currentPath={location.pathname} />
      <NavGroup
        icon={<Leaf size={20} />}
        label="Plant Trackers"
        isOpen={isGroupOpen('plantTrackers')}
        onClick={() => toggleGroup('plantTrackers', '/app/plants')}
        currentPath={location.pathname}
      >
        <NavItem to="/app/plants" label="Plant Varieties" currentPath={location.pathname} />
        <NavItem to="/app/plant-locations" label="Plant Locations" currentPath={location.pathname} />
        <NavItem to="/app/plantings" label="Plantings" currentPath={location.pathname} />
      </NavGroup>
      <NavGroup
        icon={<DollarSign size={20} />}
        label="Accounting"
        isOpen={isGroupOpen('accounting')}
        onClick={() => toggleGroup('accounting', '/app/transactions')}
        currentPath={location.pathname}
      >
        <NavItem to="/app/transactions" label="Transactions" currentPath={location.pathname} />
        <NavItem to="/app/pl-statement" label="P&L Statement" currentPath={location.pathname} />
        <NavItem to="/app/cash-flow" label="Cash Flow" currentPath={location.pathname} />
        <NavItem to="/app/balance-sheet" label="Balance Sheet" currentPath={location.pathname} />
        <NavItem to="/app/budgeting" label="Budgeting" currentPath={location.pathname} />
      </NavGroup>
      <NavGroup
        icon={<ShoppingBag size={20} />}
        label="Market"
        isOpen={isGroupOpen('market')}
        onClick={() => toggleGroup('market', '/app/market-dashboard')}
        currentPath={location.pathname}
      >
        <NavItem to="/app/market-dashboard" label="Dashboard" currentPath={location.pathname} />
        <NavItem to="/app/products" label="Products" currentPath={location.pathname} />
        <NavItem to="/app/online-store" label="Online Store" currentPath={location.pathname} />
        <NavItem to="/app/pickup-locations" label="Pickup Locations" currentPath={location.pathname} />
      </NavGroup>
      <NavItem to="/app/contacts" icon={<Users size={20} />} label="Contacts" currentPath={location.pathname} />
      <NavItem to="/app/account-settings" icon={<Settings size={20} />} label="Account Settings" currentPath={location.pathname} />
      <NavItem to="/app/user-management" icon={<Users size={20} />} label="User Management" currentPath={location.pathname} />
    </ul>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <nav className="hidden md:block w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-green-600">Samyama</h1>
        </div>
        <NavContent />
      </nav>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-green-600">Samyama</h1>
          </div>
          <NavContent />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, currentPath }) => (
  <li>
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 text-gray-700 hover:bg-green-50 rounded-md p-2",
        currentPath === to && "bg-green-100 text-green-800"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

const NavGroup = ({ icon, label, children, isOpen, onClick, currentPath }) => (
  <li>
    <Collapsible open={isOpen} onOpenChange={onClick}>
      <CollapsibleTrigger className="flex items-center justify-between w-full text-gray-700 hover:bg-green-50 rounded-md p-2">
        <div className="flex items-center space-x-3">
          {icon}
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="ml-6 space-y-1 mt-1">
          {children}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  </li>
);

export default Layout;