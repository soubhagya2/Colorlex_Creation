import React, { useState, useEffect } from 'react';
import { Search, Eye, FileText, Truck, X } from 'lucide-react';
import { apiFetch, API_BASE_URL } from '../../services/api';

const STATUS_PIPELINE = ['Pending', 'Design Review', 'Printing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingForm, setTrackingForm] = useState({ carrier: 'BlueDart Express', trackingNumber: '', estimatedDelivery: '2-3 Days' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query = selectedStatus !== 'All' ? `?status=${encodeURIComponent(selectedStatus)}` : '';
      const res = await apiFetch(`/orders/admin/all${query}`);
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenTrackingModal = (order) => {
    setSelectedOrder(order);
    setTrackingForm({
      carrier: order.trackingInfo?.carrier || 'BlueDart Express',
      trackingNumber: order.trackingInfo?.trackingNumber || 'TRK-' + Math.floor(Math.random() * 900000 + 100000),
      estimatedDelivery: order.trackingInfo?.estimatedDelivery || '2 Business Days'
    });
    setShowTrackingModal(true);
  };

  const handleSubmitTracking = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/orders/${selectedOrder._id}/tracking`, {
        method: 'PUT',
        body: JSON.stringify(trackingForm)
      });
      setShowTrackingModal(false);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const openInvoice = (orderId) => {
    window.open(`${API_BASE_URL}/orders/${orderId}/invoice`, '_blank');
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customer?.name || o.guestInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Order Management & Tracking</h1>
          <p className="text-slate-400 text-sm mt-0.5">Control print production pipeline (Pending → Design Review → Printing → Shipped → Delivered)</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedStatus('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedStatus === 'All' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          All Orders
        </button>
        {STATUS_PIPELINE.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedStatus === st ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order # or Customer Name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">{filteredOrders.length} Orders Listed</span>
      </div>

      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Order # & Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items Summary</th>
              <th className="p-4">Total (GST inc)</th>
              <th className="p-4">Pipeline Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">Loading order records...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">No print orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <span className="font-extrabold text-white block">{o.orderNumber}</span>
                    <span className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-200 block">{o.customer?.name || o.guestInfo?.name || 'Guest'}</span>
                    <span className="text-xs text-slate-500 block truncate max-w-[180px]">{o.customer?.email || o.guestInfo?.email || 'N/A'}</span>
                  </td>
                  <td className="p-4 text-xs text-slate-300">
                    <div className="font-semibold">{o.items?.[0]?.title || 'Print Job'}</div>
                    <div className="text-slate-500">{o.items?.length} item(s) total</div>
                  </td>
                  <td className="p-4 font-black text-white">
                    ₹{o.finalAmount?.toFixed(2)}
                    <span className="block text-[10px] uppercase font-bold text-emerald-400">{o.paymentStatus}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs font-bold text-purple-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                    >
                      {STATUS_PIPELINE.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openInvoice(o._id)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenTrackingModal(o)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && !showTrackingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-white">Order Specs #{selectedOrder.orderNumber}</h3>
                <span className="text-xs text-slate-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Ordered Items & Variants</h4>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm">{item.title}</h5>
                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                      <div>Size: <span className="text-slate-200">{item.variantSelections?.size || 'Standard'}</span></div>
                      <div>Material: <span className="text-slate-200">{item.variantSelections?.material || 'Standard'}</span></div>
                      <div>Finish: <span className="text-slate-200">{item.variantSelections?.finish || 'None'}</span></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{item.quantity} units x ₹{item.unitPrice}</span>
                    <span className="text-sm font-extrabold text-white mt-1 block">₹{item.calculatedPrice}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-4">
              <button
                onClick={() => openInvoice(selectedOrder._id)}
                className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow transition-colors flex items-center space-x-2 text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showTrackingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                Dispatch & Tracking Information
              </h3>
              <button onClick={() => setShowTrackingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTracking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Carrier</label>
                <input
                  type="text"
                  required
                  value={trackingForm.carrier}
                  onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tracking Number</label>
                <input
                  type="text"
                  required
                  value={trackingForm.trackingNumber}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTrackingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white shadow-lg shadow-cyan-600/30"
                >
                  Save & Set Shipped Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
