import React from 'react';
import { motion } from 'framer-motion';
import photoFrame from '../../assets/images/photoFrame.png';

/**
 * PhotoWallCollage
 * Displays the photo frame showcase image with a clean dark ambient backdrop.
 */
export default function PhotoWallCollage({ className = '' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full select-none ${className}`}
    >
      <img
        src={photoFrame}
        alt="Premium Photo Frame Collection - Wall Collage Showcase"
        className="w-full rounded-2xl "
        loading="lazy"
      />
    </motion.div>
  );
}
