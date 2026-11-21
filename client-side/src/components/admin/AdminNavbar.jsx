import React from 'react';
import { LogOut, ExternalLink, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, SKU, customer name or proofs..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="flex items-center space-x-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/80 px-3 py-1.5 rounded-lg border border-purple-800/80 transition-all"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors"
            title="Sign out of Admin Panel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
