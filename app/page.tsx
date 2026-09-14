'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ProductCard } from '@/components/products/ProductCard';
import { CountdownTimer } from '@/components/products/CountdownTimer';
import { FAQ } from '@/components/ui/FAQ';
import { SectionGlow } from '@/components/ui/SectionGlow';
import { api, getImageUrl } from '@/lib/api';
import { ChevronLeft, Sparkles } from 'lucide-react';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-luxury-gradient" />,
});

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.getProducts({ limit: '8', sort: 'popular' }),
      api.getProducts({ newArrival: 'true', limit: '8' }),
      api.getWeeklyDiscounts(),
    ])
      .then(([cats, feat, news, disc]) => {
        setCategories(cats);
        setFeatured(feat.products || []);
        setNewArrivals(news.products || []);
        setWeekly(disc || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* 3D Hero */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4"
          >
            <span className="text-gold">لوکسری</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-300 max-w-xl mb-8"
          >
            تجربه خرید لوکس با طراحی سه‌بعدی و محصولات پریمیوم
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <Link
              href="/men"
              className="px-8 py-3 bg-gold-gradient text-black font-semibold rounded-xl shadow-gold hover:scale-105 transition"
            >
              شروع خرید
            </Link>
            <Link
              href="/weekly-discounts"
              className="px-8 py-3 glass border border-gold/30 text-gold rounded-xl hover:bg-gold/10 transition"
            >
              تخفیف‌های هفته
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="relative max-w-7xl mx-auto px-4 py-16 overflow-hidden">
        <SectionGlow color="gold" />
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 relative z-10">
          <span className="text-gold">دسته‌بندی</span> محصولات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link href={`/${cat.slug}`} className="group block">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass shadow-luxury group-hover:shadow-gold transition">
                  <Image
                    src={getImageUrl(cat.cardImage, '/images/placeholders/category.jpg')}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width:768px) 50vw, 16vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholders/category.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-3 text-center">
                    <span className="font-semibold text-sm sm:text-base group-hover:text-gold transition">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Weekly Discounts */}
      <section className="relative bg-gradient-to-b from-red-950/20 to-transparent py-16 overflow-hidden">
        <SectionGlow color="accent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="text-accent" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                تخفیف‌های <span className="text-accent">هفته</span>
              </h2>
            </div>
            <CountdownTimer endDate="2026-08-31T23:59:59" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {weekly.slice(0, 8).map((d) =>
              d.product ? <ProductCard key={d.productId} product={d.product} /> : null
            )}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/weekly-discounts"
              className="inline-flex items-center gap-2 text-gold hover:underline"
            >
              مشاهده همه تخفیف‌ها <ChevronLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="relative max-w-7xl mx-auto px-4 py-16 overflow-hidden">
        <SectionGlow color="gold" />
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 relative z-10">
          محصولات <span className="text-gold">ویژه</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="relative max-w-7xl mx-auto px-4 py-16 overflow-hidden">
        <SectionGlow color="purple" />
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 relative z-10">
          <span className="text-gold">تازه‌ها</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative max-w-3xl mx-auto px-4 py-16 overflow-hidden">
        <SectionGlow color="gold" />
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 relative z-10">
          سوالات <span className="text-gold">متداول</span>
        </h2>
        <div className="relative z-10">
          <FAQ />
        </div>
      </section>
    </div>
  );
}