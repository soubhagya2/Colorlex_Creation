import React from 'react';
import { Printer, ShieldCheck, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
          Craftsmanship Meets Digital Technology
        </span>
        <h1 className="text-4xl font-black text-white tracking-tight">About ColorLex Creation</h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          We are a full-service modern printing studio dedicated to providing luxury tactile business cards, vinyl signage, marketing collateral, and custom apparel for ambitious brands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-max border border-purple-500/20">
            <Printer className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">300 DPI CMYK Precision</h3>
          <p className="text-xs text-slate-400 leading-relaxed">State-of-the-art Japanese press technology ensuring vibrant color reproduction.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-max border border-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Digital Proof Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">No guesswork. Every custom order receives visual online proofs for client sign-off.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-2">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl w-max border border-pink-500/20">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Sustainable Cardstock</h3>
          <p className="text-xs text-slate-400 leading-relaxed">FSC-certified eco-friendly cotton and soy-based inks for sustainable printing.</p>
        </div>
      </div>
    </div>
  );
}
