import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        volt: { DEFAULT: '#CCFF00', dark: '#B8E600' },
        black: { DEFAULT: '#050505', surface: '#0A0A0A', card: '#141414', elevated: '#1E1E1E' },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'system-ui', 'sans-serif'],
        body:    ['Barlow', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backdropBlur: {
        xs: '8px',
        DEFAULT: '16px',
        lg: '24px',
        xl: '40px',
      },
      keyframes: {
        phoneFloat: {
          '0%, 100%': { transform: 'perspective(1200px) rotateY(-14deg) rotateX(3deg) translateY(0)' },
          '50%':      { transform: 'perspective(1200px) rotateY(-14deg) rotateX(3deg) translateY(-12px)' },
        },
        cardIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        successPop: {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'phone-float':  'phoneFloat 5s ease-in-out infinite',
        'card-in':      'cardIn 0.4s ease both',
        'success-pop':  'successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both',
        'fade-up':      'fadeUp 0.4s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
