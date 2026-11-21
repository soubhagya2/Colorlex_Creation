import React from 'react';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-black text-white">Shipping & Return Policy</h1>
      <div className="glass-card p-8 rounded-3xl space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white">1. Turnaround Times</h3>
        <p>Standard production takes 2 to 4 business days after digital proof approval. Express 24-hour rush production is available for qualifying orders.</p>
        <h3 className="text-sm font-bold text-white pt-2">2. Free Shipping Threshold</h3>
        <p>Orders totaling above ₹2,000 qualify for free express ground shipping across all major metropolitan cities in India.</p>
      </div>
    </div>
  );
}
