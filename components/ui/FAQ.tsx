'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';

export function FAQ() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    api.getFaq().then(setItems).catch(() => {
      setItems([
        { id: 1, question: 'چگونه سفارش خود را پیگیری کنم؟', answer: 'پس از ثبت سفارش، کد پیگیری از طریق پیامک ارسال می‌شود.' },
        { id: 2, question: 'هزینه ارسال چقدر است؟', answer: 'برای سفارش‌های بالای ۵ میلیون تومان ارسال رایگان است.' },
      ]);
    });
  }, []);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="glass rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-right hover:bg-white/5 transition"
          >
            <span className="font-medium text-sm sm:text-base">{item.question}</span>
            <ChevronDown
              size={18}
              className={`text-gold transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
