import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  FileCheck,
  Users,
  Tag,
  Palette,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { user, isSuperAdmin } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products & Pricing', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Order Workflow', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Design Proof Queue', path: '/admin/design-queue', icon: FileCheck },
    { label: 'Customer Roster', path: '/admin/customers', icon: Users },
    { label: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { label: 'CMS Manager', path: '/admin/cms', icon: Palette },
    { label: 'Sales Reports', path: '/admin/reports', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen shadow-xl">
      <div>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-slate-800">
          <img
            src="/images/logo aa.png"
            alt="ColorLex Creation Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* User Badge */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-400 block">Logged in as</span>
            <span className="font-semibold text-white">{user?.name || 'Staff User'}</span>
          </div>
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
            isSuperAdmin ? 'bg-purple-950/70 text-purple-300 border border-purple-800' : 'bg-blue-950/70 text-blue-300 border border-blue-800'
          }`}>
            {user?.role === 'super_admin' ? 'Super Admin' : 'Staff'}
          </span>
        </div>

        {/* Nav Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
        <NavLink to="/" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 hover:underline font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Storefront</span>
        </NavLink>
      </div>
    </aside>
  );
}
