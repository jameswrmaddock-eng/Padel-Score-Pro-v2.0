export default function PhoneMockup() {
  return (
    <div className="relative w-[240px] h-[488px] flex-shrink-0">

      {/* Ambient glow beneath phone */}
      <div
        className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-[280px] h-[120px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(204,255,0,0.12), transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* Phone shell */}
      <div
        className="relative w-full h-full rounded-[42px] border border-white/[0.12]"
        style={{
          background: 'linear-gradient(155deg, #1a1a1a 0%, #0d0d0d 60%, #111 100%)',
          boxShadow: `
            0 0 0 0.5px rgba(255,255,255,0.06),
            32px 48px 80px rgba(0,0,0,0.7),
            -8px -8px 32px rgba(204,255,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.08)
          `,
          transform: 'perspective(1200px) rotateY(-14deg) rotateX(3deg)',
          animation: 'phoneFloat 5s ease-in-out infinite',
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[72px] h-[26px] bg-[#050505] rounded-b-[18px] z-10" />

        {/* Hardware buttons */}
        <div className="absolute -left-0.5 top-[110px] w-[3px] h-[30px] bg-white/10 rounded-l-sm" />
        <div className="absolute -left-0.5 top-[150px] w-[3px] h-[30px] bg-white/10 rounded-l-sm" />
        <div className="absolute -right-0.5 top-[130px] w-[3px] h-[44px] bg-white/10 rounded-r-sm" />

        {/* Screen */}
        <div className="absolute inset-[10px] bg-[#080e14] rounded-[34px] overflow-hidden flex flex-col">

          {/* Screen header */}
          <div className="flex items-center justify-between px-4 pt-9 pb-3">
            <span className="font-display text-[11px] font-bold tracking-[0.1em] uppercase text-white/30">
              Match
            </span>
            <span className="flex items-center gap-1.5 font-display text-[9px] font-bold tracking-[0.1em] uppercase text-volt bg-volt/[0.08] border border-volt/20 rounded-full px-2 py-0.5">
              <span className="w-1 h-1 rounded-full bg-volt animate-pulse" />
              Live
            </span>
          </div>

          {/* Score */}
          <div className="flex-1 flex flex-col items-center justify-center px-3 py-2">
            <div className="grid grid-cols-[1fr_32px_1fr] items-center w-full text-center gap-1">
              <div>
                <div className="font-display text-[9px] font-bold tracking-[0.1em] uppercase text-white/30 mb-1.5">
                  Team A
                </div>
                <div className="font-display text-[52px] font-extrabold leading-none tracking-tight text-volt">
                  40
                </div>
              </div>
              <div className="font-display text-base text-white/10 font-light">—</div>
              <div>
                <div className="font-display text-[9px] font-bold tracking-[0.1em] uppercase text-white/30 mb-1.5">
                  Team B
                </div>
                <div className="font-display text-[52px] font-extrabold leading-none tracking-tight text-white/10">
                  15
                </div>
              </div>
            </div>

            {/* Set badges */}
            <div className="flex gap-1 mt-2.5">
              <span className="font-display text-[9px] font-bold px-2 py-0.5 rounded-full bg-volt/[0.08] border border-volt/20 text-volt tracking-[0.06em]">
                Set 1: 6–3
              </span>
              <span className="font-display text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-white/20 tracking-[0.06em]">
                Set 2: 3–2
              </span>
            </div>

            {/* Serve indicator */}
            <div className="flex items-center gap-1.5 mt-2 text-[9px] text-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-volt" />
              Team A serving
            </div>
          </div>

          {/* Score buttons */}
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-4">
            <div className="py-2.5 rounded-[10px] font-display text-[11px] font-bold tracking-[0.06em] uppercase text-center text-volt bg-volt/[0.12] border border-volt/30">
              + Team A
            </div>
            <div className="py-2.5 rounded-[10px] font-display text-[11px] font-bold tracking-[0.06em] uppercase text-center text-white/30 bg-white/[0.04] border border-white/[0.08]">
              + Team B
            </div>
          </div>
          <div className="text-center text-[9px] text-white/15 pb-3.5">
            ↩ undo last point
          </div>
        </div>
      </div>
    </div>
  );
}
