'use client';

export default function PhoneMockup() {
  return (
    <div className="relative flex items-center justify-center">

      {/* Ambient glow ring */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(204,255,0,0.08) 0%, rgba(204,255,0,0.02) 50%, transparent 70%)',
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
      />

      {/* Phone shell */}
      <div
        className="relative w-64 rounded-[44px] border border-white/[0.14]"
        style={{
          background: 'linear-gradient(160deg, #1c1c1e 0%, #0f0f10 100%)',
          padding: '14px',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.6), 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation: 'phoneBob 4s ease-in-out infinite',
          transform: 'perspective(1100px) rotateY(-12deg) rotateX(4deg)',
        }}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[88px] h-7 bg-[#0a0a0a] rounded-b-[20px] z-10" />

        {/* Hardware buttons */}
        <div className="absolute -left-0.5 top-[100px] w-[3px] h-7 bg-white/[0.12] rounded-l-sm" />
        <div className="absolute -left-0.5 top-[138px] w-[3px] h-7 bg-white/[0.12] rounded-l-sm" />
        <div className="absolute -right-0.5 top-[118px] w-[3px] h-11 bg-white/[0.12] rounded-r-sm" />

        {/* Screen */}
        <div className="bg-[#070d12] rounded-[32px] overflow-hidden">

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-9 pb-2">
            <span className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/30">
              Match
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.1em] uppercase text-volt bg-volt/10 border border-volt/20 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-volt animate-[livePulse_1.4s_ease-in-out_infinite]" />
              Live
            </span>
          </div>

          {/* Score area */}
          <div className="px-4 pb-4">
            <div className="h-px bg-white/[0.05] mb-3" />

            {/* Teams */}
            <div className="grid grid-cols-[1fr_40px_1fr] items-center gap-1 text-center">

              {/* Team A — winning */}
              <div>
                <p className="font-sans text-[9px] font-bold tracking-[0.1em] uppercase text-white/30 mb-2">
                  Team A
                </p>
                <p className="font-sans text-[56px] font-black leading-none tracking-[-0.04em] text-volt">
                  40
                </p>
                <div className="flex justify-center gap-1 mt-2.5">
                  <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full bg-volt/[0.08] border border-volt/20 text-volt">
                    6
                  </span>
                  <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-white/20">
                    3
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[9px] text-white/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-volt" />
                  Serving
                </div>
              </div>

              {/* VS */}
              <p className="font-sans text-[13px] text-white/[0.12] self-center pt-4">—</p>

              {/* Team B — losing */}
              <div>
                <p className="font-sans text-[9px] font-bold tracking-[0.1em] uppercase text-white/30 mb-2">
                  Team B
                </p>
                <p className="font-sans text-[56px] font-black leading-none tracking-[-0.04em] text-white/10">
                  15
                </p>
                <div className="flex justify-center gap-1 mt-2.5">
                  <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-white/20">
                    3
                  </span>
                  <span className="font-sans text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-white/20">
                    2
                  </span>
                </div>
                <div className="h-5" />
              </div>
            </div>
          </div>

          {/* Score buttons */}
          <div className="grid grid-cols-2 gap-2 px-3 pb-3">
            <div className="py-3 rounded-[10px] bg-volt/10 border border-volt/[0.25] font-sans text-[10px] font-bold tracking-[0.06em] uppercase text-center text-volt">
              + Team A
            </div>
            <div className="py-3 rounded-[10px] bg-white/[0.04] border border-white/[0.08] font-sans text-[10px] font-bold tracking-[0.06em] uppercase text-center text-white/30">
              + Team B
            </div>
          </div>

          <p className="text-center font-sans text-[9px] text-white/[0.15] pb-3.5 tracking-[0.04em]">
            ↩ undo last point
          </p>
        </div>

        {/* Ground glow */}
        <div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[260px] h-20 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(204,255,0,0.1) 0%, transparent 70%)',
            filter: 'blur(16px)',
          }}
        />
      </div>

      <style>{`
        @keyframes glowPulse {
          0%,100% { transform:scale(1); opacity:0.8; }
          50% { transform:scale(1.08); opacity:1; }
        }
        @keyframes phoneBob {
          0%,100% { transform:perspective(1100px) rotateY(-12deg) rotateX(4deg) translateY(0); }
          50%      { transform:perspective(1100px) rotateY(-12deg) rotateX(4deg) translateY(-14px); }
        }
        @keyframes livePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.7); }
        }
      `}</style>
    </div>
  );
}
