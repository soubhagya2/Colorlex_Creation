import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Send,
  User,
  Tag,
  MessageSquare,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate swift network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSent(false);
  };

  // Pre-filled WhatsApp message based on form
  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Namaste ColorLex! 🙏\nMera Naam: ${formData.name || 'Friend'}\nSubject: ${formData.subject || 'Print Inquiry'}\nMessage: ${formData.message || 'Mujhe custom printing / photo frames ke baare mein baat karni hai.'}`
    );
    return `https://wa.me/917735249873?text=${text}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020516] text-slate-100 py-10 sm:py-16 selection:bg-purple-600 selection:text-white">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-indigo-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Left (Mascot + Contact Cards), Right (Header + Contact Form) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: 3D Panda Mascot + Direct Contact Info Cards */}
          {/* ========================================================= */}
          <div className="flex flex-col items-center lg:items-start lg:col-span-5 space-y-6">
            
            {/* Mascot Container */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              {/* Floating 3D Panda with "Aaiye to Sahi!" board */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 flex justify-center lg:justify-start"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4.5,
                    ease: 'easeInOut'
                  }}
                  className="relative group cursor-pointer"
                >
                  <img
                    src="/images/contact-panda-precise.png"
                    alt="Aaiye to Sahi! ColorLex Mascot Panda"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
                      maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)'
                    }}
                    className="w-full max-w-[340px] sm:max-w-[400px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(147,51,234,0.3)] transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Direct Contact Cards (Call, Email, Location) */}
            <div className="w-full space-y-3.5">
              
              {/* 1. Call Us Card */}
              <motion.a
                href="tel:+917735249873"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#070e24]/80 p-4 backdrop-blur-md transition-all duration-300 hover:border-purple-500/60 hover:bg-[#0c1433] hover:shadow-lg hover:shadow-purple-500/15 hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white shadow-md shadow-purple-600/30 transition-transform duration-300 group-hover:scale-110">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-slate-400">Call Us</span>
                  <span className="block text-sm sm:text-base font-extrabold text-white tracking-wide transition-colors group-hover:text-purple-300">
                    +91 77352 49873
                  </span>
                  <span className="block text-xs font-semibold text-amber-300/90 mt-0.5">
                    Call karne mein sharm kaisi? 😉
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-purple-300" />
              </motion.a>

              {/* 2. Email Us Card */}
              <motion.a
                href="mailto:colorlexcreation@gmail.com"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#070e24]/80 p-4 backdrop-blur-md transition-all duration-300 hover:border-blue-500/60 hover:bg-[#0c1433] hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-600 to-indigo-500 text-white shadow-md shadow-blue-600/30 transition-transform duration-300 group-hover:scale-110">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-slate-400">Email Us</span>
                  <span className="block text-sm sm:text-base font-extrabold text-white break-all transition-colors group-hover:text-cyan-300">
                    colorlexcreation@gmail.com
                  </span>
                  <span className="block text-xs font-semibold text-cyan-300/90 mt-0.5">
                    Hamesha reply denge!
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-blue-300" />
              </motion.a>

              {/* 3. Our Location Card */}
              <motion.a
                href="https://maps.google.com/?q=Kantabania,Kuruda,Baleshwar,Odisha,756056"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative flex items-start gap-4 rounded-2xl border border-slate-800/80 bg-[#070e24]/80 p-4 backdrop-blur-md transition-all duration-300 hover:border-pink-500/60 hover:bg-[#0c1433] hover:shadow-lg hover:shadow-pink-500/15 hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-600/30 transition-transform duration-300 group-hover:scale-110 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-slate-400">Our Location</span>
                  <span className="block text-xs sm:text-sm font-bold text-white leading-relaxed transition-colors group-hover:text-pink-300">
                    Kantabania, Genguti, Kuruda, Baleshwar, Odisha – 756056
                  </span>
                  <span className="block text-xs font-semibold text-pink-300/90 mt-1">
                    Rasta bhatak jao toh call kar lena! 😉
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-pink-300 mt-1" />
              </motion.a>

            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Header Banner + Send Us a Message Form */}
          {/* ========================================================= */}
          <div className="flex flex-col lg:col-span-7 space-y-6">
            
            {/* Top Header Section */}
            <div className="relative">
              {/* Floating Paper Airplane & Curving Dotted Flight Trail (Top Right) */}
              <div className="absolute -top-4 right-0 sm:right-4 z-10 pointer-events-none select-none">
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.8,
                    ease: 'easeInOut'
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* Curving Dotted SVG Path Trail */}
                  <svg
                    width="110"
                    height="60"
                    viewBox="0 0 110 60"
                    fill="none"
                    className="absolute -left-20 top-2 opacity-50 hidden sm:block"
                  >
                    <path
                      d="M10 50 C 40 45, 60 10, 105 18"
                      stroke="#818cf8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>

                  {/* 3D-styled Vibrant Purple Paper Airplane */}
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-xl shadow-purple-600/40 transform -rotate-12 hover:scale-110 transition-transform">
                    <Send className="h-6 w-6 fill-white" />
                  </div>
                </motion.div>
              </div>

              {/* Badge: Contact Us */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/60 px-4 py-1.5 text-xs font-semibold text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.25)] backdrop-blur-md mb-4">
                <Headphones className="h-3.5 w-3.5 text-purple-400" />
                <span>Contact Us</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Hum aapka <br />
                <span className="relative inline-block bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">
                  dhyan rakhenge!
                  {/* Underline swoosh curve */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-cyan-400 opacity-90"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9C50 2 150 2 198 9"
                      stroke="url(#gradient-swoosh)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient-swoosh" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-sm sm:text-base text-slate-300 font-medium max-w-xl leading-relaxed">
                Design, Printing ya koi bhi sawaal? Bas humse sampark kariye!
              </p>
            </div>

            {/* "Send Us a Message" Form Card */}
            <div className="relative rounded-3xl border border-slate-800/90 bg-[#060b1d]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
              
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400" />

              {/* Card Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    Apni baat batayein, baaki hum sambhal lenge! 😉
                  </p>
                </div>
              </div>

              {/* Form or Sent Success State */}
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6 py-6 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Wah! Baat Pahunch Gayi! 🚀
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Aapka message hamari prepress & printing team tak pahunch gaya hai.
                        Hum jald hi aapse sampark karenge. Tab tak aaram se chai piyo! ☕✨
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Instant WhatsApp Pe Ping Karo</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-xs sm:text-sm font-bold text-slate-300 hover:border-slate-500 hover:text-white transition-all hover:bg-slate-800"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Ek Aur Sawaal Hai?</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name and Email */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Name input */}
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          aria-label="Your Name"
                          className="w-full rounded-2xl border border-slate-800 bg-[#040816]/90 pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:bg-[#070e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>

                      {/* Email input */}
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Email Address"
                          aria-label="Email Address"
                          className="w-full rounded-2xl border border-slate-800 bg-[#040816]/90 pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:bg-[#070e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    {/* Row 2: Subject / Project SKU */}
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <Tag className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Subject / Project SKU"
                        aria-label="Subject or Project SKU"
                        className="w-full rounded-2xl border border-slate-800 bg-[#040816]/90 pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:bg-[#070e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    {/* Row 3: Message Textarea */}
                    <div className="relative">
                      <div className="pointer-events-none absolute top-3.5 left-0 flex items-center pl-4 text-slate-400">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <textarea
                        rows="4"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we assist you with your print job?"
                        aria-label="How can we assist you with your print job?"
                        className="w-full rounded-2xl border border-slate-800 bg-[#040816]/90 pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 transition-all focus:border-purple-500 focus:bg-[#070e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-y"
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#9333ea] via-[#6366f1] to-[#2563eb] py-4 px-6 text-sm sm:text-base font-black text-white shadow-xl shadow-purple-600/30 transition-all duration-300 hover:from-[#a855f7] hover:via-[#818cf8] hover:to-[#3b82f6] hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4 transform -rotate-12 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      <span>{isSubmitting ? 'Bheja jaa raha hai...' : 'Chalo Ji, Baat Karte Hain! 🚀'}</span>
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
