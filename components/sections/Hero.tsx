import PhoneMockup from '@/components/sections/PhoneMockup';

const stats = [
  { num: '100%', label: 'Free to use' },
  { num: '3',    label: 'Deuce modes' },
  { num: '0',    label: 'Signups needed' },
];

export default function Hero() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        {/* Ambient backgrounds */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 560px 400px at 75% 50%, rgba(204,255,0,0.04) 0%, transparent 70%),
              radial-gradient(ellipse 300px 300px at 15% 80%, rgba(204,255,0,0.03) 0%, transparent 60%)
            `,
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
          }}
        />

        <div className="relative z-10 container mx-auto px-6 md:px-10 py-20 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-0 items-center">

          {/* Copy */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
              <span className="font-display text-[11px] font-semibold tracking-[0.16em] uppercase text-volt">
                Performance Tracking
              </span>
            </div>

            <h1 className="font-display uppercase leading-[0.92] tracking-[-0.02em] mb-7">
              <span className="block text-[clamp(52px,8vw,80px)] font-extrabold text-white">
                Track<br />Every<br />
                <span className="text-volt">Point.</span>
              </span>
              <span className="block text-[clamp(52px,8vw,80px)] font-light text-white/[0.18] mt-1">
                Win<br />Every<br />Match.
              </span>
            </h1>

            <p className="text-[15px] font-normal leading-[1.65] text-white/50 max-w-[420px] mb-9">
              <strong className="text-white/80 font-medium">Real-time performance analytics</strong>{' '}
              built for padel. Track scores, analyse patterns, and take your game to the next level —
              on any device, on any court.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="/log"
                className="
                  inline-flex items-center gap-2
                  bg-volt text-[#050505]
                  font-display text-sm font-bold tracking-[0.08em] uppercase
                  px-6 py-3.5 rounded-lg
                  transition-all duration-300 ease-out
                  hover:bg-[#d4ff1a]
                  hover:shadow-[0_0_0_1px_rgba(204,255,0,0.6),0_0_24px_rgba(204,255,0,0.4),0_0_60px_rgba(204,255,0,0.15)]
                  hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-none
                "
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v9M4 7.5l3 3 3-3M2 13h10" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Start Scoring
              </a>

              {/* Smooth scroll to #how-it-works below */}
              <a
                href="#how-it-works"
                className="
                  inline-flex items-center gap-2
                  bg-transparent text-white/55
                  font-body text-[13px] font-medium
                  border border-white/15 rounded-lg
                  px-5 py-3.5
                  transition-all duration-200
                  hover:border-white/30 hover:text-white/80 hover:bg-white/[0.04]
                "
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5 5l3.5 1.5L5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-7 mt-12 pt-8 border-t border-white/[0.07]">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-7">
                  {i > 0 && <div className="w-px h-8 bg-white/[0.07]" />}
                  <div>
                    <div className="font-display text-[26px] font-bold text-volt tracking-[-0.01em] leading-none">
                      {s.num}
                    </div>
                    <div className="text-[11px] text-white/30 mt-1 tracking-[0.03em]">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex items-center justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>

        <style>{`
          @keyframes phoneFloat {
            0%, 100% { transform: perspective(1200px) rotateY(-14deg) rotateX(3deg) translateY(0); }
            50%       { transform: perspective(1200px) rotateY(-14deg) rotateX(3deg) translateY(-12px); }
          }
        `}</style>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative px-6 md:px-10 py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 text-center">
            <span className="font-display text-[11px] font-bold tracking-[0.16em] uppercase text-volt mb-3 block">
              How It Works
            </span>
            <h2 className="font-display text-[36px] font-extrabold tracking-tight text-white leading-none">
              Three taps to start scoring
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Set up your match',
                body: 'Choose your format — 1 set or best of 3. Pick your deuce mode, tiebreak rules, and who serves first.',
              },
              {
                step: '02',
                title: 'Tap to score',
                body: 'One tap per point. The app tracks games, sets, serve rotation and tiebreaks automatically.',
              },
              {
                step: '03',
                title: 'Review & share',
                body: 'See your full match log, share the result to WhatsApp, and track your history over time.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
              >
                <div className="font-display text-[40px] font-extrabold text-volt/20 leading-none mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-[17px] font-bold tracking-tight text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed font-light">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/log"
              className="
                inline-flex items-center gap-2
                bg-volt text-[#050505]
                font-display text-[13px] font-bold tracking-[0.08em] uppercase
                px-6 py-3.5 rounded-lg
                transition-all duration-300 ease-out
                hover:bg-[#d4ff1a]
                hover:shadow-[0_0_0_1px_rgba(204,255,0,0.6),0_0_24px_rgba(204,255,0,0.4),0_0_60px_rgba(204,255,0,0.15)]
                hover:-translate-y-0.5
              "
            >
              Start Scoring Now →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
