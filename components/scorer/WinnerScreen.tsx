'use client';
// components/scorer/WinnerScreen.tsx

import { MatchState } from '@/lib/scoringEngine';
import { buildWhatsAppText } from '@/utils/whatsapp';

interface WinnerScreenProps {
  state:    MatchState;
  onReset:  () => void;
}

export default function WinnerScreen({ state, onReset }: WinnerScreenProps) {
  const { winner, config, sets } = state;
  if (!winner) return null;

  const winnerName = winner === 'A' ? config.teamA : config.teamB;
  const loserName  = winner === 'A' ? config.teamB : config.teamA;
  const scoreStr   = sets.map((s) => `${s.a}-${s.b}`).join(', ');

  function handleShare() {
    const text = buildWhatsAppText({
      teamA:   config.teamA,
      teamB:   config.teamB,
      sets,
      winner:  winnerName,
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  return (
    <div className="flex flex-col items-center text-center gap-5 py-6 w-full"
         style={{ animation: 'fadeUp 0.4s ease both' }}>

      {/* Trophy ring */}
      <div className="relative">
        <div className="absolute inset-[-10px] rounded-full border border-volt/[0.12]"
             style={{ animation: 'ringPulse 2.5s ease-in-out infinite' }} />
        <div className="w-20 h-20 rounded-full bg-volt/[0.08] border border-volt/25 flex items-center justify-center"
             style={{ animation: 'successPop .5s cubic-bezier(.175,.885,.32,1.275) both' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
            <path d="M16 24v4M11 28h10" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 4h20v10a10 10 0 01-20 0V4z" stroke="#CCFF00" strokeWidth="2"/>
            <path d="M6 7H3v4a6 6 0 003 5.2M26 7h3v4a6 6 0 01-3 5.2" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div style={{ animation: 'fadeUp 0.4s 0.2s ease both', opacity: 0 }}>
        <p className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-volt mb-1">Match Over</p>
        <h2 className="font-sans text-[32px] font-black tracking-[-0.03em] text-white leading-none">
          {winnerName}
        </h2>
        <p className="font-sans text-[14px] text-white/65 mt-1">wins the match</p>
      </div>

      <div className="bg-volt/[0.05] border border-volt/[0.15] rounded-2xl px-6 py-4 w-full"
           style={{ animation: 'fadeUp 0.4s 0.3s ease both', opacity: 0 }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/50">Score</span>
          <span className="font-sans font-mono text-[13px] font-bold text-volt">{scoreStr}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/50">Winner</span>
          <span className="font-sans text-[13px] font-bold text-volt">{winnerName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/50">Runner-up</span>
          <span className="font-sans text-[13px] font-bold text-white/65">{loserName}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full"
           style={{ animation: 'fadeUp 0.4s 0.4s ease both', opacity: 0 }}>
        <button
          onClick={handleShare}
          className="py-3.5 rounded-xl font-sans text-[12px] font-bold tracking-[0.06em] uppercase text-[#25D366] border transition-all duration-200 hover:bg-[#25D366]/[0.08]"
          style={{ borderColor: 'rgba(37,211,102,0.3)' }}
        >
          Share Result
        </button>
        <button
          onClick={onReset}
          className="py-3.5 rounded-xl font-sans text-[12px] font-bold tracking-[0.06em] uppercase winner-new-btn"
        >
          New Match
        </button>
      </div>

      <style>{`
        @keyframes successPop { 0%{transform:scale(0);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes ringPulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .winner-new-btn {
          background: #CCFF00; color: #050505;
          transition: all 0.3s ease-in-out;
        }
        .winner-new-btn:hover {
          background: #d4ff1a;
          box-shadow: 0 0 0 1px rgba(204,255,0,.5), 0 0 20px rgba(204,255,0,.3);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
