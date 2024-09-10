import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Leaf, DollarSign, ShoppingBag, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  const isGroupOpen = (group) => {
    return openGroup === group || isPathInGroup(location.pathname, group);
  };

  const isPathInGroup = (path, group) => {
    const groupPaths = {
      plantTrackers: ['/plants', '/plant-locations'],
      accounting: ['/transactions', '/pl-statement', '/cash-flow', '/balance-sheet', '/budgeting'],
      market: ['/market-dashboard', '/products', '/online-store', '/pickup-locations'],
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

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-green-600">Samyama</h1>
        </div>
        <ul className="space-y-2 p-4">
          <NavItem to="/" icon={<Home size={20} />} label="Home" currentPath={location.pathname} />
          <NavItem to="/projects" icon={<Briefcase size={20} />} label="Projects" currentPath={location.pathname} />
          <NavGroup
            icon={<Leaf size={20} />}
            label="Plant Trackers"
            isOpen={isGroupOpen('plantTrackers')}
            onClick={() => toggleGroup('plantTrackers', '/plants')}
            currentPath={location.pathname}
          >
            <NavItem to="/plants" label="My Plants" currentPath={location.pathname} />
            <NavItem to="/plant-locations" label="Plant Locations" currentPath={location.pathname} />
          </NavGroup>
          <NavGroup
            icon={<DollarSign size={20} />}
            label="Accounting"
            isOpen={isGroupOpen('accounting')}
            onClick={() => toggleGroup('accounting', '/transactions')}
            currentPath={location.pathname}
          >
            <NavItem to="/transactions" label="Transactions" currentPath={location.pathname} />
            <NavItem to="/pl-statement" label="P&L Statement" currentPath={location.pathname} />
            <NavItem to="/cash-flow" label="Cash Flow" currentPath={location.pathname} />
            <NavItem to="/balance-sheet" label="Balance Sheet" currentPath={location.pathname} />
            <NavItem to="/budgeting" label="Budgeting" currentPath={location.pathname} />
          </NavGroup>
          <NavGroup
            icon={<ShoppingBag size={20} />}
            label="Market"
            isOpen={isGroupOpen('market')}
            onClick={() => toggleGroup('market', '/market-dashboard')}
            currentPath={location.pathname}
          >
            <NavItem to="/market-dashboard" label="Dashboard" currentPath={location.pathname} />
            <NavItem to="/products" label="Products" currentPath={location.pathname} />
            <NavItem to="/online-store" label="Online Store" currentPath={location.pathname} />
            <NavItem to="/pickup-locations" label="Pickup Locations" currentPath={location.pathname} />
          </NavGroup>
          <NavItem to="/contacts" icon={<Users size={20} />} label="Contacts" currentPath={location.pathname} />
        </ul>
      </nav>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
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