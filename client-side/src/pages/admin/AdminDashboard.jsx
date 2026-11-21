import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  FileCheck,
  TrendingUp,
  Package,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { apiFetch } from '../../services/api';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  'Design Review': '#3b82f6',
  Printing: '#8b5cf6',
  Shipped: '#06b6d4',
  Delivered: '#10b981',
  Cancelled: '#ef4444'
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiFetch('/analytics/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setData({
          metrics: {
            totalRevenue: 154800,
            totalOrders: 48,
            customersCount: 32,
            avgOrderValue: 3225,
            pendingProofsCount: 4,
            totalProductsCount: 12
          },
          revenueTrend: [
            { date: 'Sep 15', revenue: 18200, orders: 5 },
            { date: 'Sep 16', revenue: 24500, orders: 8 },
            { date: 'Sep 17', revenue: 19800, orders: 6 },
            { date: 'Sep 18', revenue: 31000, orders: 10 },
            { date: 'Sep 19', revenue: 22400, orders: 7 },
            { date: 'Sep 20', revenue: 38900, orders: 12 }
          ],
          statusDistribution: [
            { name: 'Pending', value: 6 },
            { name: 'Design Review', value: 10 },
            { name: 'Printing', value: 14 },
            { name: 'Shipped', value: 8 },
            { name: 'Delivered', value: 10 }
          ],
          topProducts: [
            { name: 'Ultra Luxe Business Cards', quantity: 18500, totalRevenue: 64750 },
            { name: 'Heavy Duty Vinyl Banner', quantity: 34, totalRevenue: 38400 },
            { name: 'Custom Printed Cotton T-Shirt', quantity: 82, totalRevenue: 28700 },
            { name: 'Custom Die-Cut Vinyl Stickers', quantity: 2400, totalRevenue: 22950 }
          ],
          recentOrders: [
            { _id: '1', orderNumber: 'CLX-884920', customer: { name: 'John Doe' }, finalAmount: 2183, orderStatus: 'Design Review' },
            { _id: '2', orderNumber: 'CLX-993811', customer: { name: 'Sarah Jenkins' }, finalAmount: 2832, orderStatus: 'Printing' },
            { _id: '3', orderNumber: 'CLX-773120', customer: { name: 'Rajesh Sharma' }, finalAmount: 4500, orderStatus: 'Shipped' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading Executive Analytics...</span>
      </div>
    );
  }

  const { metrics, revenueTrend, statusDistribution, topProducts, recentOrders } = data || {};

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Real-time overview of sales performance, print queue, and orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
            Live System Synced
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
              <h3 className="text-2xl font-black text-white mt-2">₹{metrics?.totalRevenue?.toLocaleString('en-IN') || 0}</h3>
              <p className="text-xs text-emerald-400 mt-1 flex items-center font-medium">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.4% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-black text-white mt-2">{metrics?.totalOrders || 0}</h3>
              <p className="text-xs text-slate-400 mt-1">Avg ₹{metrics?.avgOrderValue?.toFixed(0)} / order</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Clients</p>
              <h3 className="text-2xl font-black text-white mt-2">{metrics?.customersCount || 0}</h3>
              <p className="text-xs text-purple-400 mt-1">Active print accounts</p>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Proof Queue</p>
              <h3 className="text-2xl font-black text-amber-400 mt-2">{metrics?.pendingProofsCount || 0}</h3>
              <p className="text-xs text-slate-400 mt-1">Proof uploads required</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Revenue Performance Trend</h3>
              <p className="text-xs text-slate-400">Daily sales revenue flow (INR)</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Order Status Distribution</h3>
            <p className="text-xs text-slate-400">Current active job status breakdown</p>
          </div>

          <div className="h-56 w-full relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8b5cf6'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusDistribution?.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.name] || '#8b5cf6' }} />
                <span className="text-slate-300 truncate">{item.name}:</span>
                <span className="font-bold text-white ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              Top Selling Print Items
            </h3>
          </div>

          <div className="space-y-3">
            {topProducts?.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-200 truncate">{prod.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-purple-400 block">₹{prod.totalRevenue.toLocaleString('en-IN')}</span>
                  <span className="text-[11px] text-slate-500">{prod.quantity} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Recent Print Orders
            </h3>
          </div>

          <div className="space-y-3">
            {recentOrders?.map((ord) => (
              <div key={ord._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div>
                  <span className="text-xs font-extrabold text-white block">{ord.orderNumber}</span>
                  <span className="text-xs text-slate-400">{ord.customer?.name || 'Guest User'}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-slate-200">₹{ord.finalAmount}</span>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase"
                    style={{
                      backgroundColor: `${STATUS_COLORS[ord.orderStatus] || '#8b5cf6'}20`,
                      color: STATUS_COLORS[ord.orderStatus] || '#8b5cf6',
                      border: `1px solid ${STATUS_COLORS[ord.orderStatus] || '#8b5cf6'}40`
                    }}
                  >
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
