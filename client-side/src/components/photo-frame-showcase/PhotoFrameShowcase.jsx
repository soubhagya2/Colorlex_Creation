import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import HeroSection from './HeroSection';
import GlowSignSection from './GlowSignSection';
import PhotoAlbumSection from './PhotoAlbumSection';
import MugPrintingSection from './MugPrintingSection';
import LaserCuttingSection from './LaserCuttingSection';

/**
 * Individual Stacking Card Wrapper
 * Features:
 * - Proper scoped z-index (1 to 5) so cards stack seamlessly without ever overlapping the navbar (z-40)
 * - Configurable stickyTop offset (e.g. top-4 sm:top-6 lg:top-8 for page 1)
 * - Outgoing card scales down and dims smoothly using Framer Motion useScroll, useTransform & useSpring
 * - Incoming card slides up naturally from bottom with a dramatic dark elevation drop-shadow
 */
function StackingCard({ children, index, total, id, stickyTop = 'top-0' }) {
  const cardRef = useRef(null);

  // Track scroll progress as this section reaches top-0 and the next section scrolls over it
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });

  const isLast = index === total - 1;

  // Outgoing card physics: subtle scale down and gentle dim
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);

  const smoothScale = useSpring(rawScale, { stiffness: 320, damping: 32 });
  const smoothOpacity = useSpring(rawOpacity, { stiffness: 320, damping: 32 });

  return (
    <div
      ref={cardRef}
      id={id}
      style={{ zIndex: index + 1 }}
      className={`sticky ${stickyTop} w-full`}
    >
      <motion.div
        style={{
          scale: isLast ? 1 : smoothScale,
          opacity: isLast ? 1 : smoothOpacity,
          transformOrigin: 'center top',
        }}
        className={`w-full bg-slate-950 overflow-y-auto sm:overflow-hidden ${
          index > 0
            ? 'shadow-[0_-24px_60px_rgba(0,0,0,0.95)] border-t border-slate-800/80'
            : 'shadow-[0_-12px_40px_rgba(0,0,0,0.8)] border-t border-slate-800/60 rounded-t-2xl sm:rounded-t-3xl'
        }`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * PhotoFrameShowcase
 * 5 Full-Screen Scroll-Stacking Sections in Dark Theme:
 * 1) Custom Photo Frames (Page 1 with slightly increased sticky position: top-4 sm:top-6 lg:top-8)
 * 2) Outdoor Advertisement & Glow Sign Board Printing (Dark Theme)
 * 3) Spiral Photo Album Books (Dark Theme)
 * 4) Customized Cup & Mug Printing (Dark Theme)
 * 5) Precision Laser Cutting & 3D Décor (Dark Theme with Order, WhatsApp & Call)
 *
 * Scoped inside z-10 so the sticky navbar (z-40) and modals (z-50) stay on top.
 */
export default function PhotoFrameShowcase() {
  return (
    <div
      className=" relative z-10 w-full select-none"
      aria-label="ColorLex Creation Product Showcase"
    >
      {/* 1. Custom Photo Frames (Sticky position decreased by 2: top-2 sm:top-4 lg:top-6) */}
      <StackingCard
        index={0}
        total={5}
        id="colorlex-photo-frames"
        stickyTop="top-4 sm:top-8 lg:top-10"
      >
        <HeroSection />
      </StackingCard>

      {/* 2. Outdoor Advertisement & Glow Sign Boards */}
      <StackingCard index={1} total={5} id="colorlex-glow-signs" stickyTop="top-4">
        <GlowSignSection />
      </StackingCard>

      {/* 3. Spiral Photo Album Books */}
      <StackingCard index={2} total={5} id="colorlex-photo-albums" stickyTop="top-4">
        <PhotoAlbumSection />
      </StackingCard>

      {/* 4. Customized Cup & Mug Printing */}
      <StackingCard index={3} total={5} id="colorlex-mug-printing" stickyTop="top-4">
        <MugPrintingSection />
      </StackingCard>

      {/* 5. Precision Laser Cutting & 3D Décor */}
      <StackingCard index={4} total={5} id="colorlex-laser-cutting" stickyTop="top-4">
        <LaserCuttingSection />
      </StackingCard>
    </div>
  );
}
