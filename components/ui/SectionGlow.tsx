'use client';

import { motion } from 'framer-motion';

export function SectionGlow({ color = 'gold' }: { color?: 'gold' | 'accent' | 'purple' }) {
  const colors = {
    gold: 'rgba(212,175,55,0.12)',
    accent: 'rgba(233,69,96,0.12)',
    purple: 'rgba(168,85,247,0.1)',
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-3xl"
        style={{ background: colors[color] }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}