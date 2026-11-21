import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileCheck, FileText, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch, API_BASE_URL } from '../services/api';

const PIPELINE_STEPS = ['Pending', 'Design Review', 'Printing', 'Shipped', 'Delivered'];

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [designRequests, setDesignRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      try {
        const [oRes, dRes] = await Promise.all([apiFetch('/orders/my-orders'), apiFetch('/design-requests')]);
        if (oRes.success) setOrders(oRes.data);
        if (dRes.success) setDesignRequests(dRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (user) fetchAccountData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-white">Sign In to View Orders</h1>
        <p className="text-slate-400 text-xs">Access your design proof approvals, order history, and saved shipping addresses.</p>
        <button onClick={() => navigate('/login')} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl shadow-lg border border-slate-600 transition-all">Sign In</button>
      </div>
    );
  }

  return (
    <div className="mx-5 py-10 space-y-8">
      {/* Profile Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-extrabold text-white shadow">
            {user.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
            <p className="text-xs text-slate-400">{user.email} • Active Client Account</p>
          </div>
        </div>
        <button onClick={logout} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700 hover:border-rose-800/80 text-xs font-bold transition-colors">
          Sign Out
        </button>
      </div>

      {/* Proof Notification */}
      {designRequests.some(dr => dr.status === 'proof_uploaded') && (
        <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/80 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <FileCheck className="w-6 h-6 text-purple-400 shrink-0 animate-bounce" />
            <div>
              <h3 className="font-bold text-white text-sm">Design Proof Ready for Approval!</h3>
              <p className="text-xs text-slate-400">Staff uploaded visual proof files for your review.</p>
            </div>
          </div>
          <Link
            to={`/proof/${designRequests.find(dr => dr.status === 'proof_uploaded')?._id}`}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow"
          >
            Review & Approve Proof &rarr;
          </Link>
        </div>
      )}

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white">Order History & Production Timeline</h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-sm shadow-sm">
            You haven't placed any print orders yet.
          </div>
        ) : (
          orders.map((ord) => (
            <div key={ord._id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <span className="font-mono font-black text-purple-400 text-sm">{ord.orderNumber}</span>
                  <span className="text-xs text-slate-400 block">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-extrabold text-white">₹{ord.finalAmount?.toFixed(2)}</span>
                  <button
                    onClick={() => window.open(`${API_BASE_URL}/orders/${ord._id}/invoice`, '_blank')}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                    title="View / Print PDF Invoice"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pipeline Progress */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Live Production Progress</span>
                <div className="flex items-center justify-between text-xs font-semibold">
                  {PIPELINE_STEPS.map((st, idx) => {
                    const isCurrent = ord.orderStatus === st;
                    const isPast = PIPELINE_STEPS.indexOf(ord.orderStatus) >= idx;
                    return (
                      <div key={st} className="flex items-center space-x-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isCurrent ? 'bg-purple-600 text-white ring-4 ring-purple-900/50' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                          {idx + 1}
                        </div>
                        <span className={`hidden sm:inline ${isCurrent ? 'text-purple-400 font-bold' : isPast ? 'text-slate-300' : 'text-slate-500'}`}>{st}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {ord.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                    <div>
                      <span className="font-bold text-white">{item.title}</span>
                      <small className="block text-slate-400">
                        {item.variantSelections?.size} • {item.variantSelections?.material} • {item.variantSelections?.finish}
                      </small>
                    </div>
                    <span className="font-semibold text-slate-200">{item.quantity} units</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
