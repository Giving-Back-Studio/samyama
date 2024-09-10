import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, Briefcase, Leaf, DollarSign, ShoppingBag, Users } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation */}
      <nav className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-green-600">PermaGrow</h1>
        </div>
        <ul className="space-y-2 p-4">
          <NavItem to="/" icon={<Home size={20} />} label="Home" />
          <NavItem to="/projects" icon={<Briefcase size={20} />} label="Projects" />
          <NavGroup icon={<Leaf size={20} />} label="Plant Trackers">
            <NavItem to="/plants" label="My Plants" />
            <NavItem to="/plant-locations" label="Plant Locations" />
          </NavGroup>
          <NavGroup icon={<DollarSign size={20} />} label="Accounting">
            <NavItem to="/transactions" label="Transactions" />
            <NavItem to="/pl-statement" label="P&L Statement" />
            <NavItem to="/cash-flow" label="Cash Flow" />
            <NavItem to="/balance-sheet" label="Balance Sheet" />
            <NavItem to="/budgeting" label="Budgeting" />
          </NavGroup>
          <NavGroup icon={<ShoppingBag size={20} />} label="Market">
            <NavItem to="/market-dashboard" label="Dashboard" />
            <NavItem to="/products" label="Products" />
            <NavItem to="/online-store" label="Online Store" />
            <NavItem to="/pickup-locations" label="Pickup Locations" />
          </NavGroup>
          <NavItem to="/contacts" icon={<Users size={20} />} label="Contacts" />
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <li>
    <Link to={to} className="flex items-center space-x-3 text-gray-700 hover:bg-green-50 rounded-md p-2">
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

const NavGroup = ({ icon, label, children }) => (
  <li>
    <div className="flex items-center space-x-3 text-gray-700 p-2">
      {icon}
      <span>{label}</span>
    </div>
    <ul className="ml-6 space-y-1">
      {children}
    </ul>
  </li>
);

export default Layout;