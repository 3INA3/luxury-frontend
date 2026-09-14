'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-store';
import { formatPrice, api } from '@/lib/api';
import { MapPin, User, Phone, Home, Hash, Building2 } from 'lucide-react';

const MapPicker = dynamic(() => import('@/components/checkout/MapPicker').then((m) => m.MapPicker), {
  ssr: false,
  loading: () => <div className="h-64 bg-white/5 rounded-xl animate-pulse" />,
});

const PROVINCES = [
  'تهران', 'البرز', 'اصفهان', 'خراسان رضوی', 'فارس', 'آذربایجان شرقی',
  'خوزستان', 'مازندران', 'گیلان', 'کرمان', 'آذربایجان غربی', 'قم',
  'همدان', 'کرمانشاه', 'مرکزی', 'یزد', 'قزوین', 'گلستان', 'لرستان',
  'اردبیل', 'بوشهر', 'سمنان', 'زنجان', 'کردستان', 'هرمزگان',
  'چهارمحال و بختیاری', 'ایلام', 'کهگیلویه و بویراحمد', 'خراسان شمالی',
  'خراسان جنوبی', 'سیستان و بلوچستان',
];

export default function CheckoutPage() {
  const { items, finalTotal, discountTotal, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    province: 'تهران',
    city: '',
    address: '',
    plaque: '',
    unit: '',
    postalCode: '',
    lat: 35.6892,
    lng: 51.389,
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = finalTotal >= 5000000 ? 0 : 150000;
  const total = finalTotal + shipping;

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'نام الزامی است';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'شماره موبایل معتبر وارد کنید';
    if (!form.city.trim()) e.city = 'شهر الزامی است';
    if (!form.address.trim()) e.address = 'آدرس الزامی است';
    if (!form.plaque.trim()) e.plaque = 'پلاک الزامی است';
    if (!form.postalCode.trim() || form.postalCode.length < 10) e.postalCode = 'کد پستی ۱۰ رقمی وارد کنید';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const fullAddress = `${form.province}، ${form.city}، ${form.address}، پلاک ${form.plaque}${form.unit ? `، واحد ${form.unit}` : ''}، کدپستی ${form.postalCode}`;

      await api.createOrder({
        items,
        name: form.name,
        phone: form.phone,
        address: fullAddress,
        province: form.province,
        city: form.city,
        plaque: form.plaque,
        unit: form.unit,
        postalCode: form.postalCode,
        lat: form.lat,
        lng: form.lng,
        subtotal,
        discount: discountTotal,
        shipping,
        total,
      });
      clearCart();
      setDone(true);
    } catch (err) {
      alert('خطا در ثبت سفارش. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="glass-strong rounded-3xl p-10">
          <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold mb-2">سفارش با موفقیت ثبت شد</h1>
          <p className="text-gray-400 mb-2">به زودی با شما تماس گرفته می‌شود.</p>
          <p className="text-sm text-gray-500 mb-6">آدرس ارسال ذخیره شد.</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gold-gradient text-black font-semibold rounded-xl"
          >
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="glass-strong rounded-3xl p-10">
          <p className="text-gray-400 mb-4">سبد خرید خالی است.</p>
          <button onClick={() => router.push('/')} className="text-gold underline">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">تسویه حساب و آدرس ارسال</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* اطلاعات گیرنده */}
          <div className="glass-strong rounded-3xl p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2 text-gold">
              <User size={18} />
              اطلاعات گیرنده
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">نام و نام خانوادگی *</label>
                <input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={`w-full input-glass px-4 py-3 text-sm ${errors.name ? 'border-red-400' : ''}`}
                  placeholder="مثلاً علی محمدی"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">شماره موبایل *</label>
                <div className="relative">
                  <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={`w-full input-glass px-4 py-3 pr-10 text-sm ${errors.phone ? 'border-red-400' : ''}`}
                    placeholder="0912xxxxxxx"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* آدرس کامل */}
          <div className="glass-strong rounded-3xl p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2 text-gold">
              <Home size={18} />
              آدرس ارسال
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">استان *</label>
                <select
                  value={form.province}
                  onChange={(e) => update('province', e.target.value)}
                  className="w-full input-glass px-4 py-3 text-sm"
                >
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">شهر *</label>
                <input
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className={`w-full input-glass px-4 py-3 text-sm ${errors.city ? 'border-red-400' : ''}`}
                  placeholder="مثلاً تهران"
                />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1.5">آدرس کامل (خیابان، کوچه، ...) *</label>
              <textarea
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                rows={3}
                className={`w-full input-glass px-4 py-3 text-sm ${errors.address ? 'border-red-400' : ''}`}
                placeholder="خیابان ولیعصر، کوچه فلان، ..."
              />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">پلاک *</label>
                <div className="relative">
                  <Hash size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={form.plaque}
                    onChange={(e) => update('plaque', e.target.value)}
                    className={`w-full input-glass px-4 py-3 pr-10 text-sm ${errors.plaque ? 'border-red-400' : ''}`}
                    placeholder="۱۲"
                  />
                </div>
                {errors.plaque && <p className="text-red-400 text-xs mt-1">{errors.plaque}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">واحد</label>
                <div className="relative">
                  <Building2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={form.unit}
                    onChange={(e) => update('unit', e.target.value)}
                    className="w-full input-glass px-4 py-3 pr-10 text-sm"
                    placeholder="۳ (اختیاری)"
                  />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-gray-400 block mb-1.5">کد پستی *</label>
                <input
                  dir="ltr"
                  value={form.postalCode}
                  onChange={(e) => update('postalCode', e.target.value)}
                  className={`w-full input-glass px-4 py-3 text-sm ${errors.postalCode ? 'border-red-400' : ''}`}
                  placeholder="1234567890"
                  maxLength={10}
                />
                {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>}
              </div>
            </div>
          </div>

          {/* نقشه */}
          <div className="glass-strong rounded-3xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-gold">
              <MapPin size={18} />
              موقعیت روی نقشه (اختیاری)
            </h2>
            <p className="text-xs text-gray-500 mb-3">روی نقشه کلیک کنید یا مارکر را جابه‌جا کنید</p>
            <MapPicker
              lat={form.lat}
              lng={form.lng}
              onChange={(lat, lng) => {
                setForm((prev) => ({ ...prev, lat, lng }));
              }}
            />
          </div>
        </div>

        {/* خلاصه سفارش */}
        <div className="glass-strong rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="font-semibold mb-4">خلاصه سفارش</h2>
          <div className="space-y-2 text-sm mb-4 max-h-40 overflow-y-auto">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}`} className="flex justify-between text-gray-400">
                <span className="truncate ml-2">
                  {i.nameFa} × {i.quantity}
                </span>
                <span>
                  {formatPrice(i.price * (1 - i.discount / 100) * i.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-400">جمع</span>
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
              <span>{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>مجموع</span>
              <span className="text-gold">{formatPrice(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 bg-gold-gradient text-black font-semibold rounded-xl shadow-gold disabled:opacity-50 hover:scale-[1.02] transition"
          >
            {loading ? 'در حال ثبت...' : 'ثبت سفارش و ارسال'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            سفارش‌های بالای ۵ میلیون تومان ارسال رایگان
          </p>
        </div>
      </form>
    </div>
  );
}