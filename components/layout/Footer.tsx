import Link from 'next/link';
import { Instagram, Send, Phone, MapPin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-luxury-dark border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-black font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gold">لوکسری</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              تجربه لوکس خرید آنلاین. بهترین برندهای پوشاک، ساعت، عطر و اکسسوری با کیفیت پریمیوم.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/luxery" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition" aria-label="اینستاگرام">
                <Instagram size={18} />
              </a>
              <a href="https://t.me/luxery" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition" aria-label="تلگرام">
                <Send size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-gold font-semibold mb-4">دسته‌بندی‌ها</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/men" className="hover:text-gold transition">آقایان</Link></li>
              <li><Link href="/women" className="hover:text-gold transition">خانم‌ها</Link></li>
              <li><Link href="/kids" className="hover:text-gold transition">بچه‌گانه</Link></li>
              <li><Link href="/watches" className="hover:text-gold transition">ساعت</Link></li>
              <li><Link href="/perfumes" className="hover:text-gold transition">عطر</Link></li>
              <li><Link href="/accessories" className="hover:text-gold transition">اکسسوری</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gold font-semibold mb-4">پشتیبانی</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/account" className="hover:text-gold transition">حساب کاربری</Link></li>
              <li><Link href="/cart" className="hover:text-gold transition">سبد خرید</Link></li>
              <li><Link href="/weekly-discounts" className="hover:text-gold transition">تخفیف‌های هفته</Link></li>
              <li><a href="#faq" className="hover:text-gold transition">سوالات متداول</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gold font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-gold shrink-0" />
                <span>تهران، خیابان ولیعصر، برج لوکس، طبقه ۱۲</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold shrink-0" />
                <span dir="ltr">021-91000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold shrink-0" />
                <span>info@luxery.ir</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© ۱۴۰۵ لوکسری. تمامی حقوق محفوظ است.</p>
          <p>طراحی و توسعه با عشق برای تجربه لوکس</p>
        </div>
      </div>
    </footer>
  );
}
