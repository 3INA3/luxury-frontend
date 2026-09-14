'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { api } from '@/lib/api';
import { useCart } from '@/lib/cart-store';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // خواندن لیست علاقه‌مندی از localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch {
        setWishlist([]);
      }
    }
  }, []);

  // گرفتن اطلاعات کامل محصولات
  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .getProducts({ limit: '100' })
      .then((res) => {
        const all = res.products || [];
        const filtered = all.filter((p: any) => wishlist.includes(p.id));
        setProducts(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [wishlist]);

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter((item) => item !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400">
        در حال بارگذاری...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <Heart size={48} className="mx-auto text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold mb-2">لیست علاقه‌مندی خالی است</h1>
          <p className="text-gray-400 mb-6">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gold-gradient text-black font-semibold rounded-xl"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="text-accent fill-accent" size={24} />
          علاقه‌مندی‌ها
          <span className="text-sm text-gray-400 font-normal">({products.length} کالا)</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-red-400 hover:bg-red-500/80 hover:text-white transition opacity-0 group-hover:opacity-100"
              title="حذف از علاقه‌مندی"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}