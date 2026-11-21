import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, CheckCircle } from 'lucide-react';
import { apiFetch } from '../services/api';

/* Same shared horizontal margin as Home, Services and ProductDetail. */
const SECTION = 'mx-8';

const LABEL = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300';
const INPUT =
  'w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm';

export default function CustomDesignRequest() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestNum, setRequestNum] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    guestDetails: { name: '', email: '', phone: '' },
    specs: { size: 'Standard 3.5" x 2.0"', material: '16pt Matte Cover', finish: 'Spot UV', quantity: 500 },
    referenceFiles: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80']
  });

  const setGuest = (key, value) =>
    setFormData((prev) => ({ ...prev, guestDetails: { ...prev.guestDetails, [key]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch('/design-requests', { method: 'POST', body: JSON.stringify(formData) });
      if (res.success) {
        setRequestNum(res.data.requestNumber);
        setSubmitted(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pb-8 pt-6 sm:pt-8">
        <section className={SECTION}>
          <div className="mx-auto max-w-2xl space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="h-9 w-9" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Custom Design Request Received!
            </h1>
            <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
              Your request <strong className="text-purple-300">{requestNum}</strong> has been logged into our prepress
              queue. Our staff will create visual design proofs and upload them for your online approval.
            </p>
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 sm:w-auto"
            >
              Return to Print Catalog
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 pt-6 sm:space-y-8 sm:pt-8">
      {/* Header */}
      <section className={SECTION}>
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-900/60 px-3 py-1 text-xs font-bold text-purple-300">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Prepress Graphic Design Desk</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Request Custom Design Help
          </h1>
          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
            Describe your print project and our staff will create custom design proofs for your approval.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className={SECTION}>
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl sm:space-y-6 sm:p-8"
        >
          <div>
            <label htmlFor="cd-title" className={LABEL}>Project Title / Name</label>
            <input
              id="cd-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Holographic Foil Edge Business Cards"
              className={INPUT}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="cd-name" className={LABEL}>Your Full Name</label>
              <input
                id="cd-name"
                type="text"
                required
                value={formData.guestDetails.name}
                onChange={(e) => setGuest('name', e.target.value)}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="cd-email" className={LABEL}>Email Address</label>
              <input
                id="cd-email"
                type="email"
                required
                value={formData.guestDetails.email}
                onChange={(e) => setGuest('email', e.target.value)}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="cd-phone" className={LABEL}>Phone Number</label>
              <input
                id="cd-phone"
                type="tel"
                value={formData.guestDetails.phone}
                onChange={(e) => setGuest('phone', e.target.value)}
                className={INPUT}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cd-desc" className={LABEL}>Detailed Design Requirements & Copy Text</label>
            <textarea
              id="cd-desc"
              rows="5"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please detail your color preferences, logo text, contact information to include on print layout..."
              className={`${INPUT} resize-y`}
            />
          </div>

          <div className="border-t border-slate-800 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-purple-600/30 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Submitting Request...' : 'Submit Design Proof Request'}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}