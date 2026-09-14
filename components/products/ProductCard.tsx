'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { formatPrice, getImageUrl } from '@/lib/api';
import { useCart } from '@/lib/cart-store';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const finalPrice = product.price * (1 - (product.discount || 0) / 100);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      nameFa: product.nameFa,
      nameEn: product.nameEn,
      price: product.price,
      discount: product.discount || 0,
      image: product.mainImage,
      quantity: 1,
      color: product.colors?.[0],
      size: product.sizes?.[0],
    });
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        whileHover={{ y: -6 }}
        className="group relative glass rounded-2xl overflow-hidden shadow-luxury hover:shadow-gold transition-shadow duration-300"
      >
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-accent text-white text-xs font-bold px-2 py-1 rounded-lg">
            {product.discount}٪
          </div>
        )}
        {product.newArrival && (
          <div className="absolute top-3 left-3 z-10 bg-gold text-black text-xs font-bold px-2 py-1 rounded-lg">
            جدید
          </div>
        )}

        <div className="relative aspect-square overflow-hidden bg-luxury-charcoal">
          <Image
            src={getImageUrl(product.mainImage)}
            alt={product.nameFa}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholders/product.jpg';
            }}
          />
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.categoryName}</p>
          <h3 className="font-medium text-sm sm:text-base line-clamp-1 group-hover:text-gold transition">
            {product.nameFa}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-gold fill-gold" />
            <span className="text-xs text-gray-400">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              {product.discount > 0 && (
                <span className="text-xs text-gray-500 line-through block">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-gold font-semibold text-sm sm:text-base">
                {formatPrice(finalPrice)}
              </span>
            </div>
            <button
              onClick={handleAdd}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-black flex items-center justify-center transition"
              aria-label="افزودن به سبد"
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
