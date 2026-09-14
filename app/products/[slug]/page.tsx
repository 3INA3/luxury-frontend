'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { api, formatPrice, getImageUrl } from '@/lib/api';
import { useCart } from '@/lib/cart-store';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    api
      .getProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        setMainImg(p.mainImage);
        setSelectedColor(p.colors?.[0] || null);
        setSelectedSize(p.sizes?.[0] || '');
        return api.getProducts({ category: p.category, limit: '4' });
      })
      .then((r) => setRelated((r.products || []).filter((x: any) => x.slug !== slug).slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        در حال بارگذاری محصول...
      </div>
    );
  }

  const finalPrice = product.price * (1 - (product.discount || 0) / 100);
  const images = [product.mainImage, ...(product.gallery || [])].filter(Boolean);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      nameFa: product.nameFa,
      nameEn: product.nameEn,
      price: product.price,
      discount: product.discount || 0,
      image: product.mainImage,
      quantity: qty,
      color: selectedColor,
      size: selectedSize || undefined,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden glass mb-4">
            <Image
              src={getImageUrl(mainImg)}
              alt={product.nameFa}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholders/product.jpg';
              }}
            />
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setMainImg(img)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  mainImg === img ? 'border-gold' : 'border-transparent'
                }`}
              >
                <Image
                  src={getImageUrl(img)}
                  alt=""
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholders/product.jpg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500 mb-2">
            <Link href={`/${product.category}`} className="hover:text-gold">
              {product.categoryName}
            </Link>
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.nameFa}</h1>
          <p className="text-gray-400 text-sm mb-4">{product.nameEn}</p>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-gold fill-gold" />
              <span>{product.rating}</span>
            </div>
            <span className="text-gray-500 text-sm">({product.reviewsCount} نظر)</span>
            {product.stock > 0 ? (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <Check size={14} /> موجود
              </span>
            ) : (
              <span className="text-red-400 text-sm">ناموجود</span>
            )}
          </div>

          <div className="mb-6">
            {product.discount > 0 && (
              <span className="text-gray-500 line-through text-lg ml-3">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-2xl font-bold text-gold">{formatPrice(finalPrice)}</span>
            {product.discount > 0 && (
              <span className="mr-3 bg-accent text-white text-xs px-2 py-1 rounded">
                {product.discount}٪ تخفیف
              </span>
            )}
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-8">{product.description}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">رنگ: {selectedColor?.name}</p>
              <div className="flex gap-2">
                {product.colors.map((c: any) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-full border-2 transition ${
                      selectedColor?.hex === c.hex ? 'border-gold scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">سایز</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      selectedSize === s
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty & Add */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center glass rounded-xl">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 hover:text-gold"
                aria-label="کاهش"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="p-3 hover:text-gold"
                aria-label="افزایش"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold-gradient text-black font-semibold rounded-xl shadow-gold hover:scale-[1.02] transition disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              افزودن به سبد
            </button>
            <button className="p-3 glass rounded-xl hover:text-gold transition" aria-label="علاقه‌مندی">
              <Heart size={20} />
            </button>
          </div>

          {/* Specs */}
          {product.specifications && (
            <div className="glass rounded-xl p-4 text-sm space-y-2">
              <p>
                <span className="text-gray-500">جنس:</span> {product.specifications.material}
              </p>
              <p>
                <span className="text-gray-500">مبدا:</span> {product.specifications.origin}
              </p>
              <p>
                <span className="text-gray-500">نگهداری:</span> {product.specifications.care}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">محصولات مرتبط</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
