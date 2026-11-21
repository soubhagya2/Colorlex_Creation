import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, ShieldCheck, Wrench, Sparkles, MessageCircle } from 'lucide-react';
import banner from '../../assets/images/banner.png';
/**
 * Section 2: Outdoor Advertisement & Glow Sign Board Printing
 * Uses /images/banner-5.png for the showcase image.
 */
export default function GlowSignSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const badges = [
    { icon: Lightbulb, title: 'Samsung LEDs', desc: '50,000+ hour bright illumination.', color: '#0095FF' },
    { icon: ShieldCheck, title: '100% Weatherproof', desc: 'UV, rain & rust-resistant ACP.', color: '#FF1E8E' },
    { icon: Wrench, title: 'Custom Setup', desc: 'Turnkey on-site installation.', color: '#FFA31A' },
  ];

  return (
    <section className="relative w-full  h-full min-h-[100svh] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-10 sm:py-10">
      
      {/* Ambient Blobs */}
      <div className="pointer-events-none absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-[#0095FF]/20 via-[#7928CA]/20 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 w-96 sm:w-[480px] h-96 sm:h-[480px] rounded-full bg-gradient-to-tl from-[#FFA31A]/20 via-[#FF1E8E]/15 to-transparent blur-3xl opacity-80" />

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

      {/* Main Container */}
      <div className="relative z-10 w-full mx-3 sm:mx-6 lg:mx-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
        
        {/* LEFT: Showcase Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: -20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex items-center justify-center order-1"
        >
          <img
            src={banner}
            alt="High-Impact Outdoor Signage and LED Glow Boards"
            className="w-full h-auto rounded-2xl"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "/images/banner-4.png"; }}
          />
        </motion.div>

        {/* RIGHT: Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
         className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 space-y-4 sm:space-y-5" >
          {/* Tag Pill */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-[#0095FF] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#0095FF]" />
            <span className="text-slate-300">Commercial Branding & Outdoor Media</span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.12] text-white">
              <span>Ignite Your Brand with</span>
              <br />
              <span className="bg-gradient-to-r from-[#0095FF] via-[#FF1E8E] to-[#FFA31A] bg-clip-text text-transparent">
                Glow Sign Boards
              </span>
            </h2>
          </motion.div>

          {/* Subtext */}
          <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-slate-300 max-w-lg font-medium leading-relaxed">
            All-weather outdoor hoardings, LED glow sign boards, 3D acrylic letters, and precision ACP panels engineered to capture attention day and night.
          </motion.p>

          {/* Feature Badges */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl pt-1">
            {badges.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg text-left">
                <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border" style={{ background: `${color}15`, color, borderColor: `${color}33` }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{title}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full">
            <Link
              to="/product/led-glow-sign-board"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#0095FF] via-[#FF1E8E] to-[#FFA31A] text-white font-bold text-sm shadow-lg shadow-[#0095FF]/25 hover:shadow-xl hover:shadow-[#0095FF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Glow Signs</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/917735249873?text=Hi%20ColorLex,%20I'd%20like%20a%20quote%20for%20LED%20Glow%20Sign%20Boards%20and%20Outdoor%20Signage."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Get WhatsApp Quote</span>
            </a>
          </motion.div>

          {/* Accent line */}
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#0095FF] to-[#FFA31A] opacity-75" />
        </motion.div>
      </div>
    </section>
  );
}
