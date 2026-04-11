'use client';

import PhoneMockup from '@/components/sections/PhoneMockup';

const STATS = [
  { num: '100%', label: 'Free forever'   },
  { num: '4',    label: 'Deuce modes'    },
  { num: '0',    label: 'Signups needed' },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden"
      aria-label="Hero"
    >
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

      <div className="relative z-10 w-full max-w-[1200px] mx-auto
                      px-10 py-20 max-sm:px-5 max-sm:py-12
                      grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">

        {/* ── Left column ── */}
        <div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-volt hero-pulse" />
            <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt">
              Performance Tracking · Free to use
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-7">
            <span
              className="block font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] text-white"
              style={{ fontSize: 'clamp(44px, 6.5vw, 88px)' }}
            >
              Track Every
            </span>
            <span
              className="block font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] text-volt"
              style={{ fontSize: 'clamp(44px, 6.5vw, 88px)' }}
            >
              Point.
            </span>
            <span
              className="block font-sans font-black uppercase leading-[0.95] tracking-[-0.04em] mt-1"
              style={{
                fontSize: 'clamp(44px, 6.5vw, 88px)',
                color: 'rgba(136,136,136,0.60)',
              }}
            >
              Win Every Match.
            </span>
          </h1>

          {/* Description */}
          <p className="font-sans text-[15px] font-normal leading-[1.65] text-white/45 max-w-[420px] mb-10 max-lg:max-w-full">
            <strong className="text-white/75 font-semibold">Real-time match scoring</strong>{' '}
            built for padel players who take the game seriously. Tap to score, track sets, log
            history — on any device, on any court. No account needed.
          </p>

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

        {/* ── Right column — phone mockup ── */}
        <div className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>

      </div>

      <style>{`
        @keyframes heroPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
        .hero-pulse { animation: heroPulse 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
