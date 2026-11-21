import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { apiFetch, API_BASE_URL } from '../../services/api';

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiFetch('/analytics/dashboard');
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCsv = () => {
    window.open(`${API_BASE_URL}/analytics/export-csv`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sales & Revenue Reports</h1>
          <p className="text-slate-400 text-sm mt-0.5">Export detailed order transactions and analyze revenue growth</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Sales CSV Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Total Sales</p>
          <h2 className="text-3xl font-black text-white mt-2">₹{data?.metrics?.totalRevenue?.toLocaleString('en-IN') || 0}</h2>
          <p className="text-xs text-emerald-400 mt-1">100% Validated Payments</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders Processed</p>
          <h2 className="text-3xl font-black text-white mt-2">{data?.metrics?.totalOrders || 0}</h2>
          <p className="text-xs text-purple-400 mt-1">Print Jobs Fulfilled</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Cart Size</p>
          <h2 className="text-3xl font-black text-white mt-2">₹{data?.metrics?.avgOrderValue?.toFixed(0) || 0}</h2>
          <p className="text-xs text-blue-400 mt-1">Per Client Transaction</p>
        </div>
      </div>

      <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white">Export Options</h3>
        <p className="text-xs text-slate-400">Generate instantly formatted CSV spreadsheets compatible with Microsoft Excel, Apple Numbers, or Google Sheets.</p>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Full Sales Transaction Ledger</h4>
              <p className="text-xs text-slate-400">Includes order numbers, customer emails, dates, line items count, status, and GST revenue figures.</p>
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
