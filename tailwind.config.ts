import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {

      // ── Colours ───────────────────────────────────────────────────────────
      colors: {
        volt: {
          DEFAULT: '#CCFF00',
          dark:    '#B8E600',
          '10':    'rgba(204,255,0,0.10)',
          '20':    'rgba(204,255,0,0.20)',
          '30':    'rgba(204,255,0,0.30)',
        },
        bg: {
          DEFAULT:  '#050505',
          card:     '#1A1A1A',
          elevated: '#222222',
          grid:     '#111111',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          volt:    'rgba(204,255,0,0.20)',
          strong:  'rgba(255,255,255,0.14)',
          subtle:  '#2A2A2A',
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Segoe UI',
          'sans-serif',
        ],
      },

      fontSize: {
        '2xs':    ['10px', { lineHeight: '14px', letterSpacing: '0.08em' }],
        xs:       ['11px', { lineHeight: '16px', letterSpacing: '0.06em' }],
        sm:       ['13px', { lineHeight: '20px' }],
        base:     ['15px', { lineHeight: '1.65' }],
        lg:       ['17px', { lineHeight: '1.5',  letterSpacing: '-0.01em' }],
        xl:       ['20px', { lineHeight: '1.3',  letterSpacing: '-0.02em' }],
        '2xl':    ['24px', { lineHeight: '1.2',  letterSpacing: '-0.02em' }],
        '3xl':    ['32px', { lineHeight: '1.1',  letterSpacing: '-0.03em' }],
        '4xl':    ['40px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '5xl':    ['52px', { lineHeight: '1.0',  letterSpacing: '-0.04em' }],
        display:  ['72px', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        score:    ['80px', { lineHeight: '1.0',  letterSpacing: '-0.05em' }],
      },

      fontWeight: {
        light:    '300',
        normal:   '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
        extrabold:'800',
        black:    '900',
      },

      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.04em',
        tight:    '-0.03em',
        snug:     '-0.02em',
        normal:   '0em',
        wide:     '0.04em',
        wider:    '0.08em',
        widest:   '0.12em',
        'ultra':  '0.16em',
      },

      // ── Spacing — 4px base unit ───────────────────────────────────────────
      spacing: {
        px:   '1px',
        0:    '0px',
        1:    '4px',
        2:    '8px',
        3:    '12px',
        4:    '16px',
        5:    '20px',
        6:    '24px',
        7:    '28px',
        8:    '32px',
        9:    '36px',
        10:   '40px',
        11:   '44px',
        12:   '48px',
        14:   '56px',
        16:   '64px',
        20:   '80px',
        24:   '96px',
        28:   '112px',
        32:   '128px',
        36:   '144px',
        40:   '160px',
        48:   '192px',
        56:   '224px',
        64:   '256px',
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        none:  '0px',
        xs:    '4px',
        sm:    '8px',    // buttons
        md:    '12px',
        lg:    '16px',   // cards
        xl:    '20px',   // large cards
        '2xl': '24px',
        '3xl': '32px',
        full:  '9999px', // pills
      },

      // ── Transitions — everything uses 0.3s ease-in-out ───────────────────
      transitionDuration: {
        fast:    '150ms',
        DEFAULT: '300ms',
        slow:    '500ms',
      },

      transitionTimingFunction: {
        DEFAULT: 'ease-in-out',
        'in':    'ease-in',
        'out':   'ease-out',
        spring:  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      // ── Grid ──────────────────────────────────────────────────────────────
      gridTemplateColumns: {
        'auto-fill-280': 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
        'auto-fill-360': 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
      },

      maxWidth: {
        content: '1200px',
        prose:   '65ch',
        narrow:  '480px',
      },

      // ── Backdrop blur (glassmorphism) ─────────────────────────────────────
      backdropBlur: {
        xs:  '8px',
        sm:  '12px',
        md:  '20px',
        lg:  '32px',
        xl:  '48px',
      },

      // ── Animations ────────────────────────────────────────────────────────
      keyframes: {
        cardIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        successPop: {
          '0%':   { transform: 'scale(0)',   opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        livePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.7)' },
        },
        phoneFloat: {
          '0%, 100%': {
            transform: 'perspective(1200px) rotateY(-14deg) rotateX(3deg) translateY(0)',
          },
          '50%': {
            transform: 'perspective(1200px) rotateY(-14deg) rotateX(3deg) translateY(-12px)',
          },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },

      animation: {
        'card-in':      'cardIn 0.4s ease-in-out both',
        'fade-up':      'fadeUp 0.4s ease-in-out both',
        'success-pop':  'successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both',
        'live-pulse':   'livePulse 1.8s ease-in-out infinite',
        'phone-float':  'phoneFloat 5s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },

      // ── Box shadows ───────────────────────────────────────────────────────
      boxShadow: {
        'volt-sm':  '0 0 0 1px rgba(204,255,0,0.3), 0 0 16px rgba(204,255,0,0.2)',
        'volt-md':  '0 0 0 1px rgba(204,255,0,0.5), 0 0 24px rgba(204,255,0,0.35), 0 0 60px rgba(204,255,0,0.12)',
        'volt-lg':  '0 0 0 1px rgba(204,255,0,0.6), 0 0 40px rgba(204,255,0,0.5), 0 0 80px rgba(204,255,0,0.2)',
        'card':     '0 4px 24px rgba(0,0,0,0.4)',
        'none':     'none',
      },
    },
  },

  plugins: [],
};

export default config;
