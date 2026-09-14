'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { api, getImageUrl } from '@/lib/api';

interface Props {
  slug: string;
}

export function CategoryPage({ slug }: Props) {
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCategory(slug),
      api.getProducts({ category: slug, sort, limit: '50' }),
    ])
      .then(([cat, prods]) => {
        setCategory(cat);
        setProducts(prods.products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, sort]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src={getImageUrl(category?.heroImage, '/images/placeholders/category.jpg')}
          alt={category?.name || ''}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholders/category.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-gold">{category?.name}</h1>
          <p className="text-gray-300 mt-2">{category?.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-gray-400 text-sm">{products.length} محصول</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold/40"
          >
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
            <option value="discount">بیشترین تخفیف</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
