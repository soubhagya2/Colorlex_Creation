import React from 'react';
import { Link } from 'react-router-dom';
import {
  Printer, Layers, Sparkles, Image, Tag, Award,
  BookOpen, Gift, Scissors, Palette, BookMarked, ArrowRight, Zap
} from 'lucide-react';

/* Same shared horizontal margin as Home. Change it in both files together. */
const SECTION = 'mx-8';

const SERVICES = [
  { name: 'Business Printing', icon: Printer, color: 'purple', slug: 'business-printing', desc: 'Visiting cards, letterheads, envelopes, ID cards & office stationery', items: ['Visiting Cards', 'Letterheads', 'Envelopes', 'PVC ID Cards', 'Certificates'], startingFrom: '₹12' },
  { name: 'Marketing & Promotional', icon: Layers, color: 'blue', slug: 'marketing-promotional', desc: 'Flyers, brochures, posters and standees for impactful campaigns', items: ['A4/A5/A6 Flyers', 'Bi/Tri Fold Brochures', 'A1–A4 Posters', 'Roll-Up Standees'], startingFrom: '₹50' },
  { name: 'Wedding & Events', icon: Sparkles, color: 'pink', slug: 'wedding-event-printing', desc: 'Premium invitation cards, décor and event stationery', items: ['Wedding Invitations', 'Gold Foil Stamping', 'Laser Cut Inserts', 'Custom Design'], startingFrom: '₹12/card' },
  { name: 'Photo Printing', icon: Image, color: 'amber', slug: 'photo-printing', desc: 'Lab-quality photo prints, canvas, frames and editing services', items: ['4×6 to 12×18 Prints', 'Passport Photos', 'Canvas Prints', 'Photo Editing'], startingFrom: '₹15' },
  { name: 'Large Format Printing', icon: Tag, color: 'emerald', slug: 'large-format-printing', desc: 'Flex, vinyl, banners and display printing for outdoor advertising', items: ['Frontlit/Backlit Flex', 'Vinyl Decals', 'Event Banners', 'Wall Graphics'], startingFrom: '₹35/sq ft' },
  { name: 'Signs & Display', icon: Award, color: 'cyan', slug: 'signs-display', desc: 'Acrylic, ACP, PVC, LED and illuminated sign boards', items: ['Acrylic Name Plates', 'ACP Shop Boards', 'PVC Foam Boards', 'LED Sign Boards'], startingFrom: '₹40' },
  { name: 'Stickers & Labels', icon: Tag, color: 'orange', slug: 'stickers-labels', desc: 'Paper, vinyl, waterproof, transparent and reflective stickers', items: ['Die Cut Stickers', 'Vinyl Stickers', 'Transparent Labels', 'Reflective Stickers'], startingFrom: '₹400/100 pcs' },
  { name: 'School & College', icon: BookOpen, color: 'indigo', slug: 'school-college-printing', desc: 'Student ID cards, admit cards, certificates and mark sheets', items: ['Student ID Cards', 'Admit Cards', 'Mark Sheets', 'Achievement Certificates'], startingFrom: '₹8/piece' },
  { name: 'Personalized Gifts', icon: Gift, color: 'rose', slug: 'personalized-gifts', desc: 'Custom t-shirts, mugs, cushions, mobile covers and photo gifts', items: ['Custom T-Shirts', 'Magic Mugs', 'Photo Cushions', 'Mobile Covers'], startingFrom: '₹150' },
  { name: 'Laser Cutting & Engraving', icon: Scissors, color: 'red', slug: 'laser-cutting-engraving', desc: 'Precision laser cut décor, name cutouts and custom engraving', items: ['Cake Toppers', 'Wedding Décor', 'Name Cutouts', 'Logo Engraving'], startingFrom: '₹80' },
  { name: 'Graphic Design Services', icon: Palette, color: 'violet', slug: 'graphic-design-services', desc: 'Logo design, branding, flyers, social media and photo editing', items: ['Logo Design', 'Brand Identity', 'Flyer & Poster Design', 'Social Media Graphics'], startingFrom: '₹300' },
  { name: 'Finishing & Binding', icon: BookMarked, color: 'slate', slug: 'finishing-binding-services', desc: 'Lamination, spiral binding, soft and hard binding services', items: ['Glossy Lamination', 'Matte Lamination', 'Spiral Binding', 'Soft & Hard Binding'], startingFrom: '₹5/sheet' },
];

/* Dark-theme tokens. Full class names are written out so Tailwind can detect them. */
const colorMap = {
  purple:  { hover: 'hover:border-purple-500/60',  icon: 'bg-purple-500/10 text-purple-400',   badge: 'bg-purple-500/15 text-purple-300',   link: 'text-purple-400',  dot: 'bg-purple-400' },
  blue:    { hover: 'hover:border-blue-500/60',    icon: 'bg-blue-500/10 text-blue-400',       badge: 'bg-blue-500/15 text-blue-300',       link: 'text-blue-400',    dot: 'bg-blue-400' },
  pink:    { hover: 'hover:border-pink-500/60',    icon: 'bg-pink-500/10 text-pink-400',       badge: 'bg-pink-500/15 text-pink-300',       link: 'text-pink-400',    dot: 'bg-pink-400' },
  amber:   { hover: 'hover:border-amber-500/60',   icon: 'bg-amber-500/10 text-amber-400',     badge: 'bg-amber-500/15 text-amber-300',     link: 'text-amber-400',   dot: 'bg-amber-400' },
  emerald: { hover: 'hover:border-emerald-500/60', icon: 'bg-emerald-500/10 text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300', link: 'text-emerald-400', dot: 'bg-emerald-400' },
  cyan:    { hover: 'hover:border-cyan-500/60',    icon: 'bg-cyan-500/10 text-cyan-400',       badge: 'bg-cyan-500/15 text-cyan-300',       link: 'text-cyan-400',    dot: 'bg-cyan-400' },
  orange:  { hover: 'hover:border-orange-500/60',  icon: 'bg-orange-500/10 text-orange-400',   badge: 'bg-orange-500/15 text-orange-300',   link: 'text-orange-400',  dot: 'bg-orange-400' },
  indigo:  { hover: 'hover:border-indigo-500/60',  icon: 'bg-indigo-500/10 text-indigo-400',   badge: 'bg-indigo-500/15 text-indigo-300',   link: 'text-indigo-400',  dot: 'bg-indigo-400' },
  rose:    { hover: 'hover:border-rose-500/60',    icon: 'bg-rose-500/10 text-rose-400',       badge: 'bg-rose-500/15 text-rose-300',       link: 'text-rose-400',    dot: 'bg-rose-400' },
  red:     { hover: 'hover:border-red-500/60',     icon: 'bg-red-500/10 text-red-400',         badge: 'bg-red-500/15 text-red-300',         link: 'text-red-400',     dot: 'bg-red-400' },
  violet:  { hover: 'hover:border-violet-500/60',  icon: 'bg-violet-500/10 text-violet-400',   badge: 'bg-violet-500/15 text-violet-300',   link: 'text-violet-400',  dot: 'bg-violet-400' },
  slate:   { hover: 'hover:border-slate-500/60',   icon: 'bg-slate-500/10 text-slate-300',     badge: 'bg-slate-500/15 text-slate-300',     link: 'text-slate-300',   dot: 'bg-slate-400' },
};

const STATS = [
  { value: '50+', label: 'Products & Services' },
  { value: '12', label: 'Service Categories' },
  { value: '₹35', label: 'Starting Price (Flex)' },
  { value: '24 Hr', label: 'Express Production' },
];

const WHY = [
  { icon: Zap, title: 'Express Production', desc: '24-hour rush available on most products', tone: 'bg-amber-100 text-amber-600' },
  { icon: Award, title: 'Premium Quality', desc: 'CMYK 300 DPI, industry-grade inks & materials', tone: 'bg-purple-100 text-purple-600' },
  { icon: Sparkles, title: 'Free Design Help', desc: 'Prepress check and proof approval for every order', tone: 'bg-pink-100 text-pink-600' },
  { icon: Printer, title: '50+ Services', desc: 'One-stop shop for all print & signage needs', tone: 'bg-emerald-100 text-emerald-600' },
];

export default function Services() {
  return (
    <div className="space-y-6 pb-8 pt-6 sm:space-y-8 sm:pt-8">
      {/* 1. Hero */}
      <section className={SECTION}>
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-900/60 px-3 py-1 text-xs font-bold text-purple-300">
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            <span>Full Service Print Studio</span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Print, Sign & Brand
            </span>
          </h1>

          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
            From business cards to massive hoardings, wedding invitations to custom gifts — we handle everything
            in-house with professional quality and fast turnaround.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-950/40 transition-all hover:-translate-y-0.5 hover:bg-purple-500 active:translate-y-0"
            >
              <span>Browse All Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/custom-design"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-bold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Request Custom Design</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stats bar */}
      <section className={SECTION}>
        <div className="rounded-3xl bg-white p-3 shadow-2xl sm:p-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-center sm:p-5">
                <div className="text-xl font-black text-slate-900 sm:text-2xl">{s.value}</div>
                <div className="mt-0.5 text-[11px] font-semibold text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services grid */}
      <section className={`${SECTION} space-y-6 sm:space-y-8`}>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end sm:gap-4">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-400">
              What We Print
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Our Service Categories</h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition-colors hover:text-white sm:text-sm"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, ...svc }) => {
            const c = colorMap[svc.color] || colorMap.slate;
            return (
              <Link
                key={svc.name}
                to={`/catalog?category=${svc.slug}`}
                className={`group flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5 ${c.hover}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.icon}`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${c.badge}`}>
                      from {svc.startingFrom}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white transition-colors group-hover:text-purple-300 sm:text-base">
                      {svc.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{svc.desc}</p>
                  </div>

                  <ul className="space-y-1.5">
                    {svc.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
                        <span className="min-w-0 truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-1.5 border-t border-slate-800/80 pt-3 text-xs font-bold">
                  <span className={c.link}>View All Products</span>
                  <ArrowRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${c.link}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Why choose us */}
      <section className={SECTION}>
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl sm:p-10">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              The ColorLex Difference
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Why Choose Our Print Studio?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, desc, tone }) => (
              <div
                key={title}
                className="space-y-2 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-center"
              >
                <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white sm:text-base">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}