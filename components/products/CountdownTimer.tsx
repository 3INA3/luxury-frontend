'use client';

import { useState, useEffect } from 'react';

export function CountdownTimer({ endDate }: { endDate: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (expired) {
    return <span className="text-gray-500 text-sm">تخفیف به پایان رسید</span>;
  }

  const Item = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white/5 rounded-lg px-3 py-2 min-w-[56px]">
      <span className="text-lg font-bold text-gold tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400 hidden sm:inline">مانده:</span>
      <Item value={time.days} label="روز" />
      <Item value={time.hours} label="ساعت" />
      <Item value={time.minutes} label="دقیقه" />
      <Item value={time.seconds} label="ثانیه" />
    </div>
  );
}
