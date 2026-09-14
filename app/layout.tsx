import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupportWidget } from '@/components/support/SupportWidget';
import { CartProvider } from '@/lib/cart-store';
import { AuthProvider } from '@/lib/auth-store';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export const metadata: Metadata = {
  title: 'لوکسری | تجربه لوکس خرید آنلاین',
  description: 'فروشگاه آنلاین لوکس پوشاک، ساعت، عطر و اکسسوری با طراحی سه‌بعدی',
  openGraph: {
    title: 'لوکسری',
    description: 'تجربه لوکس خرید آنلاین',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir antialiased bg-luxury-black text-gray-100 relative">
        <AuthProvider>
          <CartProvider>
            <AmbientBackground />
            <Header />
            <main className="min-h-screen pt-20 relative z-10">{children}</main>
            <Footer />
            <SupportWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}