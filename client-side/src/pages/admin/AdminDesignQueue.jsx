import React, { useState, useEffect } from 'react';
import { UploadCloud, ExternalLink, X } from 'lucide-react';
import { apiFetch } from '../../services/api';

export default function AdminDesignQueue() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [proofForm, setProofForm] = useState({
    proofUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    notes: 'Version 1.0 - High resolution CMYK artwork proof prepared for printing approval.'
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/design-requests');
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openUploadModal = (reqItem) => {
    setSelectedRequest(reqItem);
    setProofForm({
      proofUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      notes: `Version ${ (reqItem.proofs?.length || 0) + 1 }.0 - Adjusted layout according to print requirements.`
    });
    setShowUploadModal(true);
  };

  const handleProofSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/design-requests/${selectedRequest._id}/proof`, {
        method: 'POST',
        body: JSON.stringify(proofForm)
      });
      setShowUploadModal(false);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Design Proof Request Queue</h1>
          <p className="text-slate-400 text-sm mt-0.5">Upload visual proof files for customer approval and manage design revisions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2">Active Requests Queue ({requests.length})</h3>

          {loading ? (
            <div className="p-6 text-center text-slate-400 text-sm">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm bg-slate-950/60 rounded-2xl border border-slate-800">
              No design requests pending.
            </div>
          ) : (
            requests.map((r) => (
              <div
                key={r._id}
                onClick={() => setSelectedRequest(r)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedRequest?._id === r._id
                    ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-purple-400">{r.requestNumber}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {r.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-1">{r.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</p>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-6">
          {selectedRequest ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-400">{selectedRequest.requestNumber}</span>
                  <h2 className="text-xl font-extrabold text-white mt-0.5">{selectedRequest.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Submitted by {selectedRequest.customer?.name || selectedRequest.guestDetails?.name || 'Guest Customer'}</p>
                </div>

                <button
                  onClick={() => openUploadModal(selectedRequest)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/30"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Proof File</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Requested Print Specifications</h4>
                <p className="text-slate-300 pt-2">{selectedRequest.description}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Proof History & Approvals</h4>

                {selectedRequest.proofs?.map((pf, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400">Proof Version v{pf.version}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {pf.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <img
                        src={pf.proofUrl}
                        alt="Proof preview"
                        className="w-24 h-24 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                      <div className="flex-1 text-xs space-y-1">
                        <p className="text-slate-200 font-medium">{pf.notes}</p>
                        <a href={pf.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-purple-400 hover:underline font-bold text-xs pt-1">
                          <span>Open High-Res Proof File</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-slate-500 text-sm">
              Select a design request from the left queue to view proof files and approval status.
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-purple-400" />
                Upload Design Proof Preview
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProofSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proof File / Image URL</label>
                <input
                  type="text"
                  required
                  value={proofForm.proofUrl}
                  onChange={(e) => setProofForm({ ...proofForm, proofUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Staff Notes</label>
                <textarea
                  rows="3"
                  required
                  value={proofForm.notes}
                  onChange={(e) => setProofForm({ ...proofForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30"
                >
                  Send Proof to Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
