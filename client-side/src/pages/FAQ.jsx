import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await apiFetch('/cms');
        if (res.success && res.data.faqs) setFaqs(res.data.faqs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-400 text-sm">Everything you need to know about artwork file prepress and shipping turnaround</p>
      </div>

      <div className="space-y-4">
        {(faqs.length > 0 ? faqs : [
          {
            question: 'What design file formats do you accept for print?',
            answer: 'We accept vector PDF, AI (Adobe Illustrator), EPS, PSD, high-resolution PNG, and TIFF (300 DPI min with 0.125" bleeds).'
          },
          {
            question: 'How does the Design Proof Approval workflow work?',
            answer: 'Once your order is placed, our prepress team uploads a high-res digital proof to your Customer Dashboard. You can approve or request revisions with 1 click.'
          }
        ]).map((item, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400 shrink-0" />
              {item.question}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pl-7">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
