import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageCircle } from 'lucide-react';

import photoFrameImg from '../assets/images/Photo Frame.png';
import mugImg from '../assets/images/Mug.png';

const WHATSAPP_NUMBER = '917735249873';

const PRODUCTS = [
  { id: 'visiting-card', name: 'Visiting Cards', tag: 'From ₹150', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80' },
  { id: 'custom-mugs', name: 'Custom Mugs', tag: 'From ₹199', image: mugImg },
  { id: 't-shirts', name: 'T-Shirts', tag: 'From ₹299', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80' },
  { id: 'photo-frames', name: 'Photo Frames', tag: 'From ₹349', image: photoFrameImg },
  { id: 'flyers-brochures', name: 'Flyers & Brochures', tag: 'From ₹240', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80' },
  { id: 'banners-flex', name: 'Banners & Flex', tag: 'From ₹180', image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=500&q=80' },
  { id: 'stickers-labels', name: 'Stickers & Labels', tag: 'From ₹99', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80' },
  { id: 'neon-signboard', name: 'LED Neon Signs', tag: 'From ₹899', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80' },
];

export default function QuickQuoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]); // product ids

  // Open automatically after 5 seconds of entering the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleQuote = () => {
    const names = PRODUCTS.filter((p) => selected.includes(p.id)).map((p) => `• ${p.name}`).join('\n');
    const message = `Hello ColorLex! I would like a quick quote for:\n${names}\n\nPlease share pricing and turnaround time.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm sm:p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-title"
    >
      <div
        className="relative flex w-full max-w-2xl max-h-[92vh] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-5 pt-5 pb-3 sm:px-7 sm:pt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 id="quote-title" className="pr-10 text-xl sm:text-2xl font-extrabold text-slate-900">
            What are you looking to print?
          </h2>
          <p className="mt-1 text-sm text-slate-500">Pick one or more and get your price on WhatsApp.</p>
        </div>

        {/* Product grid (scrolls on small screens) */}
        <div className="flex-1 overflow-y-auto px-5 pb-3 sm:px-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PRODUCTS.map((p) => {
              const on = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  aria-pressed={on}
                  className={`relative overflow-hidden rounded-2xl border-2 text-left transition ${
                    on ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    {on && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="px-2.5 py-2">
                    <div className="truncate text-sm font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.tag}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:px-7 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleQuote}
            disabled={selected.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-base font-bold text-white transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <MessageCircle className="h-5 w-5" />
            {selected.length ? `Get a Quick Quote (${selected.length})` : 'Get a Quick Quote'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mx-auto mt-3 block text-sm text-slate-500 underline hover:text-slate-700"
          >
            Just browsing
          </button>
        </div>
      </div>
    </div>
  );
}