import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, Maximize2, Home as HomeIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import PhotoWallCollage from './PhotoWallCollage';

/**
 * Section 1: Hero - Custom Photo Frames
 * Dark Theme with brand gradient and PhotoWallCollage image.
 */
export default function HeroSection() {
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

  return (
    <section className="relative w-full flex items-center  h-full min-h-[100svh] justify-center bg-slate-950 text-white overflow-hidden py-10 sm:py-10">
      
      {/* Ambient Blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-bl from-[#0095FF]/25 via-[#FF1E8E]/20 to-[#FFA31A]/20 blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-[#0095FF]/25 via-[#8A2BE2]/20 to-[#FF1E8E]/25 blur-3xl opacity-80" />

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      {/* Main Container */}
      <div className="relative z-10 w-full mx-3 sm:mx-6 lg:mx-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
        
        {/* LEFT: Photo Frame Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: -20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex items-center justify-center   order-1"
        >
          <PhotoWallCollage />
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
            <span className="text-slate-300">Handcrafted Photo Frames & Wall Décor</span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.12] text-white">
              <span>Turn Memories Into</span>
              <br />
              <span className="bg-gradient-to-r from-[#0095FF] via-[#FF1E8E] to-[#FFA31A] bg-clip-text text-transparent">
                Beautiful Décor
              </span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-slate-300 max-w-lg font-medium leading-relaxed">
            Custom photo frames made to bring your favorite moments to life.
            From single archival wall prints to breathtaking gallery walls.
          </motion.p>

          {/* Feature Badges */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl pt-1">
            {[
              { icon: Gem, title: 'Premium Finish', desc: 'High-quality materials for a lasting look.', color: '#0095FF' },
              { icon: Maximize2, title: 'Custom Sizes', desc: 'Perfect fit for your photos and space.', color: '#FF1E8E' },
              { icon: HomeIcon, title: 'Made for Every Space', desc: 'Home, office, or gifting – always special.', color: '#FFA31A' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg transition-all hover:border-slate-700">
                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl flex items-center justify-center border" style={{ background: `${color}15`, color, borderColor: `${color}33` }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/product/photo-frame-printing"
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#0095FF] via-[#FF1E8E] to-[#FFA31A] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#FF1E8E]/30 hover:shadow-xl hover:shadow-[#FF1E8E]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>Explore Photo Frames</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-xs font-semibold text-slate-400">
              ⚡ Ships within 24–48 hours across India
            </span>
          </motion.div>

          {/* Accent line */}
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#0095FF] to-[#FFA31A] opacity-80" />
        </motion.div>
      </div>
    </section>
  );
}
