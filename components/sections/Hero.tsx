import PhoneMockup from '@/components/sections/PhoneMockup';

const STATS = [
  { num: '100%', label: 'Free forever' },
  { num: '3',    label: 'Deuce modes'  },
  { num: '0',    label: 'Signups needed' },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── 20px grid is applied on body in globals.css ── */}

      {/* Radial ambient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 600px 500px at 70% 50%, rgba(204,255,0,0.04) 0%, transparent 65%),
            radial-gradient(ellipse 400px 400px at 10% 80%, rgba(204,255,0,0.025) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-10 py-20
                      grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center
                      max-sm:px-5 max-sm:py-14">

        {/* ── Left column ─────────────────────────────────── */}
        <div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="w-1.5 h-1.5 rounded-full bg-volt"
              style={{ animation: 'livePulse 2s ease-in-out infinite' }}
            />
            <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
              Performance Tracking · Free to use
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-7">
            {/* Solid white line */}
            <span
              className="block font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] text-white"
              style={{ fontSize: 'clamp(44px, 6.5vw, 88px)' }}
            >
              Track Every<br />Point.
            </span>
            {/* Outline-only line */}
            <span
              className="block font-sans font-black uppercase leading-[0.95] tracking-[-0.04em]"
              style={{
                fontSize: 'clamp(44px, 6.5vw, 88px)',
                color: 'transparent',
                WebkitTextStroke: '2px rgba(255,255,255,0.82)',
              }}
            >
              Win Every<br />Match.
            </span>
          </h1>

          {/* Description */}
          <p className="font-sans text-[15px] font-normal leading-[1.65] text-white/45 max-w-[420px] mb-9 max-lg:max-w-full">
            <strong className="text-white/75 font-semibold">Real-time match scoring</strong>{' '}
            built for padel players who take the game seriously. Tap to score, track sets, log
            history — on any device, on any court. No account needed.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-12 max-sm:justify-center">

            {/* Primary — solid volt with outer glow on hover */}
            <a
              href="/log"
              className="inline-flex items-center gap-2
                         bg-volt text-bg font-sans text-[13px] font-bold
                         tracking-[0.08em] uppercase px-7 py-3.5 rounded-lg
                         transition-all duration-300 ease-in-out
                         hover:bg-[#d4ff1a] hover:-translate-y-0.5
                         active:scale-[0.97]"
              style={{
                /* Hover shadow applied via CSS custom class in globals.css */
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 0 0 1px rgba(204,255,0,0.6), 0 0 24px rgba(204,255,0,0.45), 0 0 60px rgba(204,255,0,0.18), 0 0 100px rgba(204,255,0,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M7 1v9M4 7.5l3 3 3-3M2 13h10"
                  stroke="#050505"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download App
            </a>

            {/* Ghost — transparent with 1px white border */}
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2
                         bg-transparent text-white/60 font-sans text-[13px] font-semibold
                         tracking-[0.04em] px-6 py-3.5 rounded-lg
                         border border-white/20
                         transition-all duration-300 ease-in-out
                         hover:border-white/50 hover:text-white/90 hover:bg-white/[0.04]
                         hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M5 5l3.5 1.5L5 8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              See How It Works
            </a>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-7 pt-8 border-t border-white/[0.07] max-sm:justify-center">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-7">
                {i > 0 && <div className="w-px h-8 bg-white/10" />}
                <div>
                  <p className="font-sans text-[22px] font-extrabold tracking-[-0.03em] leading-none text-volt">
                    {s.num}
                  </p>
                  <p className="font-sans text-[11px] font-medium text-white/30 mt-1 tracking-[0.03em]">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — phone mockup ──────────────────── */}
        <div className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>

      </div>

      {/* Global keyframes */}
      <style>{`
        @keyframes livePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
      `}</style>
    </section>
  );
}
