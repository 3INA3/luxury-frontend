'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-store';
import clsx from 'clsx';

const categories = [
  { name: 'آقایان', slug: 'men' },
  { name: 'خانم‌ها', slug: 'women' },
  { name: 'بچه‌گانه', slug: 'kids' },
  { name: 'ساعت', slug: 'watches' },
  { name: 'عطر', slug: 'perfumes' },
  { name: 'اکسسوری', slug: 'accessories' },
];

// افکت سه‌بعدی مشترک برای آیکون‌ها و لینک‌ها
const hover3d = {
  rest: { scale: 1, rotateX: 0, rotateY: 0, z: 0 },
  hover: { 
    scale: 1.15, 
    rotateX: -8, 
    rotateY: 8, 
    z: 30,
    transition: { type: 'spring', stiffness: 400, damping: 15 }
  },
  tap: { scale: 0.9 }
};

const navHover = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -3, 
    scale: 1.05,
    transition: { type: 'spring', stiffness: 500, damping: 20 }
  }
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-luxury-black/95 backdrop-blur-xl border-b border-white/5 shadow-luxury'
          : 'bg-transparent'
      )}
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo با افکت */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              variants={hover3d}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="text-black font-bold text-lg">L</span>
            </motion.div>
            <motion.span 
              className="text-xl font-bold tracking-wider text-gold"
              whileHover={{ scale: 1.05, color: '#f0d77b' }}
            >
              لوکسری
            </motion.span>
          </Link>

          {/* Desktop Nav با افکت سه‌بعدی */}
          <nav className="hidden lg:flex items-center gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.slug}
                variants={navHover}
                initial="rest"
                whileHover="hover"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Link
                  href={`/${cat.slug}`}
                  className={clsx(
                    'text-sm font-medium relative group block px-2 py-1',
                    pathname === `/${cat.slug}` ? 'text-gold' : 'text-gray-300'
                  )}
                >
                  {cat.name}
                  <motion.span 
                    className="absolute -bottom-1 right-0 h-0.5 bg-gold"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.25 }}
                  />
                </Link>
              </motion.div>
            ))}
            <motion.div variants={navHover} initial="rest" whileHover="hover">
              <Link
                href="/weekly-discounts"
                className="text-sm font-medium text-accent hover:text-red-400 transition block"
              >
                تخفیف‌های هفته
              </Link>
            </motion.div>
          </nav>

          {/* Actions با افکت سه‌بعدی قوی */}
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              variants={hover3d}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-gray-300 hover:text-gold rounded-full hover:bg-white/5 transition-colors"
              style={{ transformStyle: 'preserve-3d' }}
              aria-label="جستجو"
            >
              <Search size={20} />
            </motion.button>

            <motion.div variants={hover3d} initial="rest" whileHover="hover" whileTap="tap" style={{ transformStyle: 'preserve-3d' }}>
              <Link href="/account" className="p-2.5 text-gray-300 hover:text-gold rounded-full hover:bg-white/5 hidden sm:flex transition-colors" aria-label="حساب">
                <User size={20} />
              </Link>
            </motion.div>

            <motion.div variants={hover3d} initial="rest" whileHover="hover" whileTap="tap" style={{ transformStyle: 'preserve-3d' }}>
              <Link href="/wishlist" className="p-2.5 text-gray-300 hover:text-gold rounded-full hover:bg-white/5 hidden sm:flex transition-colors" aria-label="علاقه‌مندی">
                <Heart size={20} />
              </Link>
            </motion.div>

            <motion.div variants={hover3d} initial="rest" whileHover="hover" whileTap="tap" style={{ transformStyle: 'preserve-3d' }} className="relative">
              <Link href="/cart" className="p-2.5 text-gray-300 hover:text-gold rounded-full hover:bg-white/5 flex transition-colors" aria-label="سبد خرید">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            <motion.button
              variants={hover3d}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="lg:hidden p-2.5 text-gray-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ transformStyle: 'preserve-3d' }}
              aria-label="منو"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-4"
            >
              <form action="/search" className="relative">
                <input
                  type="search"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصولات..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 pr-12 text-sm focus:outline-none focus:border-gold/50 transition"
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-luxury-dark/98 backdrop-blur-xl border-t border-white/5"
          >
            <nav className="flex flex-col p-4 gap-1">
              {categories.map((cat) => (
                <motion.div key={cat.slug} whileHover={{ x: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={`/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 text-gray-200 hover:text-gold transition"
                  >
                    {cat.name}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/weekly-discounts"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-accent hover:bg-white/5"
              >
                تخفیف‌های هفته
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-white/5"
              >
                حساب کاربری
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-gold hover:bg-white/5"
              >
                پنل ادمین
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
