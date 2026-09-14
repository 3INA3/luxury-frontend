'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { api } from '@/lib/api';

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string; time: string }[]>([
    { from: 'support', text: 'سلام! چطور می‌تونم کمکتون کنم؟', time: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const { user } = useAuth();

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages((m) => [...m, { from: 'user', text, time: new Date().toISOString() }]);
    try {
      if (user) await api.sendSupportMessage(text);
    } catch {}
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: 'support',
          text: 'پیام شما دریافت شد. کارشناسان ما به زودی پاسخ می‌دهند.',
          time: new Date().toISOString(),
        },
      ]);
    }, 1200);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center text-black"
        aria-label="پشتیبانی"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 h-[430px] glass-strong rounded-3xl flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-l from-gold/20 to-transparent border-b border-white/10 px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-sm">پشتیبانی آنلاین</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/10 transition" aria-label="بستن">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.from === 'user'
                        ? 'bg-gold/20 text-gold-light border border-gold/20'
                        : 'glass border border-white/10 text-gray-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 input-glass px-3.5 py-2.5 text-sm"
              />
              <button
                onClick={send}
                className="w-11 h-11 rounded-xl bg-gold-gradient text-black flex items-center justify-center shrink-0 hover:scale-105 transition"
                aria-label="ارسال"
              >
                <Send size={17} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}