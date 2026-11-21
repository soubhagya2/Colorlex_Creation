import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

/* Same shared horizontal margin as Home, Services, ProductDetail and CustomDesignRequest. */
const SECTION = 'mx-8';

const INPUT =
  'w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-6 pb-8 pt-6 sm:space-y-8 sm:pt-8">
      {/* Header */}
      <section className={SECTION}>
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">We're Here To Help</span>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Contact Print Support
          </h1>
          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
            Have questions about bulk order volume discounts or file prepress specs?
          </p>
        </div>
      </section>

      {/* Info + form */}
      <section className={`${SECTION} grid grid-cols-1 items-start gap-4 sm:gap-6 md:grid-cols-12`}>
        {/* Contact details */}
        <div className="md:col-span-5">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl sm:p-8">
            <h2 className="text-base font-bold text-white">ColorLex Creation Headquarters</h2>

            <div className="space-y-3 text-xs text-slate-300 sm:text-sm">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                <div className="shrink-0 rounded-xl bg-purple-500/10 p-2 text-purple-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="min-w-0 pt-1.5 leading-relaxed">
                  Kantabania, Genguti, Kuruda, Baleshwar, Odisha – 756056, India
                </span>
              </div>

              <a
                href="https://wa.me/917735249873"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="group flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 transition-colors hover:border-emerald-500/50"
              >
                <div className="shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="min-w-0 transition-colors group-hover:text-white">
                  +91 77352 49873 (WhatsApp & Call)
                </span>
              </a>

              <a
                href="mailto:colorlexcreation@gmail.com"
                title="Email ColorLex Customer Support"
                aria-label="Email ColorLex Support at colorlexcreation@gmail.com"
                className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 transition-colors hover:border-purple-500/50"
              >
                <div className="shrink-0 rounded-xl bg-purple-500/10 p-2 text-purple-400">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="min-w-0 break-all transition-colors hover:text-white">colorlexcreation@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="md:col-span-7">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl sm:p-8">
            <h2 className="text-base font-bold text-white">Send Us a Direct Message</h2>

            {sent ? (
              <div className="space-y-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center text-emerald-300">
                <CheckCircle className="mx-auto h-8 w-8" />
                <p className="text-sm font-bold">Message Sent!</p>
                <p className="text-xs text-slate-300">Our prepress team will contact you shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input type="text" required placeholder="Your Name" aria-label="Your Name" className={INPUT} />
                  <input type="email" required placeholder="Email Address" aria-label="Email Address" className={INPUT} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Subject / Project SKU"
                  aria-label="Subject or Project SKU"
                  className={INPUT}
                />
                <textarea
                  rows="5"
                  required
                  placeholder="How can we assist you with your print job?"
                  aria-label="Message"
                  className={`${INPUT} resize-y`}
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-purple-600/30 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 active:translate-y-0"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}