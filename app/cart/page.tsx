'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { formatPrice, getImageUrl } from '@/lib/api';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, discountTotal, finalTotal, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold mb-2">سبد خرید خالی است</h1>
          <p className="text-gray-400 mb-6">محصولی به سبد اضافه نکرده‌اید.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gold-gradient text-black font-semibold rounded-xl"
          >
            ادامه خرید
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">سبد خرید ({totalItems} کالا)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.price * (1 - item.discount / 100);
            return (
              <div
                key={`${item.productId}-${item.color?.hex}-${item.size}`}
                className="glass-strong rounded-2xl p-4 flex gap-4"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.nameFa}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium hover:text-gold line-clamp-1"
                  >
                    {item.nameFa}
                  </Link>
                  <div className="text-xs text-gray-500 mt-1 space-x-2 space-x-reverse">
                    {item.color && <span>رنگ: {item.color.name}</span>}
                    {item.size && <span>سایز: {item.size}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center glass rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.color?.hex,
                            item.size
                          )
                        }
                        className="p-2"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.color?.hex,
                            item.size
                          )
                        }
                        className="p-2"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-gold font-semibold">
                      {formatPrice(price * item.quantity)}
                    </span>
                    <button
                      onClick={() =>
                        removeItem(item.productId, item.color?.hex, item.size)
                      }
                      className="text-gray-500 hover:text-red-400 p-2"
                      aria-label="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-strong rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="font-semibold mb-4">خلاصه سفارش</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">جمع جزء</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-green-400">
                <span>تخفیف</span>
                <span>-{formatPrice(discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">ارسال</span>
              <span>محاسبه در مرحله بعد</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-gold">{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full text-center py-3 bg-gold-gradient text-black font-semibold rounded-xl shadow-gold"
          >
            ادامه فرآیند خرید
          </Link>
        </div>
      </div>
    </div>
  );
}