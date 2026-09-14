'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AccountPage() {
  const { user, login, register, logout, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (loading) return <div className="py-20 text-center text-gray-400">بارگذاری...</div>;

  if (user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gold-gradient text-black flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            {user.name[0]}
          </div>
          <h1 className="text-xl font-bold mb-1">{user.name}</h1>
          <p className="text-gray-400 text-sm mb-6" dir="ltr">{user.phone}</p>
          <div className="space-y-2 text-sm text-right">
            <p className="text-gray-400">سفارش‌ها، آدرس‌ها و علاقه‌مندی‌ها در نسخه کامل پنل قابل دسترسی هستند.</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.refresh();
            }}
            className="mt-6 px-6 py-2.5 btn-glass rounded-xl hover:bg-white/10 transition"
          >
            خروج
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(form.phone, form.password);
      } else {
        await register(form.name, form.phone, form.password);
      }
    } catch (err: any) {
      setError(err.message || 'خطا');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gold">
          {mode === 'login' ? 'ورود' : 'ثبت‌نام'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">نام</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full input-glass px-4 py-3 text-sm"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">شماره موبایل</label>
            <input
              required
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0912..."
              className="w-full input-glass px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">رمز عبور</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full input-glass px-4 py-3 text-sm"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gold-gradient text-black font-semibold rounded-xl disabled:opacity-50 hover:scale-[1.02] transition"
          >
            {submitting ? '...' : mode === 'login' ? 'ورود' : 'ثبت‌نام'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-5">
          {mode === 'login' ? (
            <>
              حساب ندارید؟{' '}
              <button onClick={() => setMode('register')} className="text-gold hover:underline">
                ثبت‌نام
              </button>
            </>
          ) : (
            <>
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <button onClick={() => setMode('login')} className="text-gold hover:underline">
                ورود
              </button>
            </>
          )}
        </p>
        <p className="text-center text-xs text-gray-500 mt-4">
          برای دمو: هر شماره‌ای + هر رمزی
        </p>
      </motion.div>
    </div>
  );
}