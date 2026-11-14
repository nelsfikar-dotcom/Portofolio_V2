'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MotionFadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export default function MotionFadeUp({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 24,
}: MotionFadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Cubic-bezier untuk gerakan yang presisi dan mulus
      }}
    >
      {children}
    </motion.div>
  );
}