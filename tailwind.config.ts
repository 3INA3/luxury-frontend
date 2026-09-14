import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0a0a0a',
          dark: '#111111',
          charcoal: '#1a1a1a',
          gold: '#d4af37',
          'gold-light': '#f0d77b',
          'gold-dark': '#b8860b',
          silver: '#c0c0c0',
          cream: '#f5f0e6',
          accent: '#e94560',
        },
      },
      fontFamily: {
        vazir: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f0d77b 50%, #b8860b 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'luxury': '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.1)',
        'gold': '0 4px 20px rgba(212,175,55,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212,175,55,0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
