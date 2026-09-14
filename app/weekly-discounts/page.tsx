'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { CountdownTimer } from '@/components/products/CountdownTimer';
import { api } from '@/lib/api';
import { Sparkles } from 'lucide-react';

export default function WeeklyDiscountsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getWeeklyDiscounts()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-accent mb-2">
          <Sparkles size={20} />
          <span className="text-sm font-medium">پیشنهاد ویژه</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          تخفیف‌های <span className="text-accent">هفته</span>
        </h1>
        <div className="flex justify-center">
          <CountdownTimer endDate="2026-08-31T23:59:59" />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">بارگذاری...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-400">در حال حاضر تخفیف فعالی وجود ندارد.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((d) =>
            d.product ? <ProductCard key={d.productId} product={d.product} /> : null
          )}
        </div>
      )}
    </div>
  );
}
