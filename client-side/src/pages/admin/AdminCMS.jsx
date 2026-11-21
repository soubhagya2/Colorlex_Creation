import React, { useState, useEffect } from 'react';
import { Palette, Trash2, Save, Image, MessageSquare } from 'lucide-react';
import { apiFetch } from '../../services/api';

export default function AdminCMS() {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await apiFetch('/cms');
        if (res.success) setCmsData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCMS();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await apiFetch('/cms', {
        method: 'PUT',
        body: JSON.stringify(cmsData)
      });
      if (res.success) {
        setMessage('CMS Content updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading CMS Config...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Storefront CMS & Banners</h1>
          <p className="text-slate-400 text-sm mt-0.5">Customize hero banners slider, testimonials, FAQs, and announcement bar</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing Changes...' : 'Publish CMS Changes'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          {message}
        </div>
      )}

      <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4" />
          1. Top Announcement Header Bar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Text</label>
            <input
              type="text"
              value={cmsData?.announcementBar?.text || ''}
              onChange={(e) => setCmsData({
                ...cmsData,
                announcementBar: { ...cmsData.announcementBar, text: e.target.value }
              })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <label className="flex items-center space-x-2 text-xs text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={cmsData?.announcementBar?.isActive || false}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  announcementBar: { ...cmsData.announcementBar, isActive: e.target.checked }
                })}
                className="rounded bg-slate-900 border-slate-800 text-purple-600 focus:ring-0"
              />
              <span>Display Announcement Bar</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Image className="w-4 h-4" />
            2. Homepage Hero Banners Slider
          </h3>
          <button
            type="button"
            onClick={() => setCmsData({
              ...cmsData,
              banners: [...(cmsData.banners || []), { title: 'New Banner', subtitle: '', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80', link: '/catalog', buttonText: 'Explore' }]
            })}
            className="text-xs text-purple-400 hover:underline"
          >
            + Add Banner Slide
          </button>
        </div>

        <div className="space-y-4">
          {cmsData?.banners?.map((bn, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Slide #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => setCmsData({
                    ...cmsData,
                    banners: cmsData.banners.filter((_, i) => i !== idx)
                  })}
                  className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={bn.title}
                  onChange={(e) => {
                    const list = [...cmsData.banners];
                    list[idx].title = e.target.value;
                    setCmsData({ ...cmsData, banners: list });
                  }}
                  placeholder="Banner Headline Title"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  value={bn.subtitle}
                  onChange={(e) => {
                    const list = [...cmsData.banners];
                    list[idx].subtitle = e.target.value;
                    setCmsData({ ...cmsData, banners: list });
                  }}
                  placeholder="Subtitle Tagline"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <input
                type="text"
                value={bn.image}
                onChange={(e) => {
                  const list = [...cmsData.banners];
                  list[idx].image = e.target.value;
                  setCmsData({ ...cmsData, banners: list });
                }}
                placeholder="Background Image URL"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
