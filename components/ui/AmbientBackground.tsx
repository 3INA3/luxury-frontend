'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AmbientBackground({ variant = 'default' }: { variant?: 'default' | 'gold' | 'soft' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const colors =
    variant === 'gold'
      ? ['#d4af37', '#b8860b', '#f0d77b']
      : variant === 'soft'
      ? ['#e94560', '#d4af37', '#7c3aed']
      : ['#d4af37', '#e94560', '#3b82f6', '#a855f7'];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* گرادیان نرم پس‌زمینه */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(233,69,96,0.04)_0%,_transparent_50%)]" />

      {/* دایره‌های نورانی بزرگ */}
      <motion.div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, ${colors[0]}40 0%, transparent 70%)` }}
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full opacity-15 blur-3xl"
        style={{ background: `radial-gradient(circle, ${colors[1]}50 0%, transparent 70%)` }}
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ذرات شناور */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            opacity: 0.25 + Math.random() * 0.3,
            boxShadow: `0 0 ${6 + Math.random() * 10}px ${colors[i % colors.length]}60`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* خطوط نورانی ظریف */}
      <motion.div
        className="absolute top-1/4 left-0 right-0 h-px opacity-10"
        style={{ background: `linear-gradient(90deg, transparent, ${colors[0]}, transparent)` }}
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-2/3 left-0 right-0 h-px opacity-10"
        style={{ background: `linear-gradient(90deg, transparent, ${colors[1]}, transparent)` }}
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}