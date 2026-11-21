import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ExternalLink, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function ProofApproval() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  useEffect(() => {
    const fetchReq = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/design-requests/${requestId}`);
        if (res.success) setRequest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReq();
  }, [requestId]);

  const handleAction = async (actionType) => {
    setSubmitting(true);
    try {
      const latestProof = request.proofs?.[request.proofs.length - 1];
      const res = await apiFetch(`/design-requests/${requestId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({
          proofId: latestProof?._id,
          action: actionType,
          feedback: feedbackNotes
        })
      });

      if (res.success) {
        setActionDone(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-24 text-center text-slate-400">Loading design proof file...</div>;

  if (!request) return <div className="py-24 text-center text-slate-400">Design proof request record not found.</div>;

  const latestProof = request.proofs?.[request.proofs.length - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate('/account')}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-purple-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Account</span>
      </button>

      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400">{request.requestNumber}</span>
            <h1 className="text-2xl font-black text-white">{request.title}</h1>
            <p className="text-xs text-slate-400">Proof Version v{latestProof?.version || 1}</p>
          </div>

          <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
            request.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
          }`}>
            Status: {request.status.replace('_', ' ')}
          </span>
        </div>

        {latestProof && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-2 text-center">
              <img
                src={latestProof.proofUrl}
                alt="Digital Proof Preview"
                className="w-full max-h-[500px] object-contain rounded-xl mx-auto"
              />
              <div className="p-3 text-xs text-slate-400 flex items-center justify-between">
                <span>Uploaded by {latestProof.uploadedBy} on {new Date(latestProof.uploadedAt).toLocaleString()}</span>
                <a href={latestProof.proofUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline font-bold inline-flex items-center gap-1">
                  <span>Open Full Screen Proof</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <strong className="block text-slate-300 font-bold">Staff Instructions & Notes:</strong>
              <p className="text-slate-400">{latestProof.notes}</p>
            </div>
          </div>
        )}

        {actionDone || request.status === 'approved' ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-extrabold text-white text-base">Proof Approved for Printing!</h3>
            <p className="text-xs text-emerald-300">Your design is locked and sent to production line.</p>
          </div>
        ) : (
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Customer Approval Action</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Revision Notes (If requesting changes)</label>
              <textarea
                rows="3"
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="Specify any text changes, color adjustments, or logo repositioning requested..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => handleAction('approve')}
                disabled={submitting}
                className="w-full sm:w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                ✓ Approve Proof & Send to Print
              </button>

              <button
                type="button"
                onClick={() => handleAction('revision')}
                disabled={submitting || !feedbackNotes}
                className="w-full sm:w-1/2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
              >
                ✎ Request Design Revision
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
