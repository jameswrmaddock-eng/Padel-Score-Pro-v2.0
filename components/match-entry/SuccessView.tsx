'use client';

import { Match } from '@/hooks/useMatchHistory';

interface SuccessViewProps {
  match: Match;
  totalSaved: number;
  onReset: () => void;
}

export default function SuccessView({ match, totalSaved, onReset }: SuccessViewProps) {
  const scoreStr = match.sets.map((s) => `${s.a}–${s.b}`).join('  ');

  const summaryRows = [
    { label: 'Teams',    value: `${match.teamA}  vs  ${match.teamB}` },
    { label: 'Score',    value: scoreStr },
    { label: 'Winner',   value: match.winner },
    { label: 'Location', value: match.location },
  ].filter((r) => r.value && r.value !== 'Unspecified');

  return (
    <div className="flex flex-col items-center text-center px-7 py-12 animate-fadeIn">

      {/* Animated check circle */}
      <div
        className="w-16 h-16 rounded-full bg-volt/10 border border-volt/30 flex items-center justify-center mb-5"
        style={{ animation: 'successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both' }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
          <path
            d="M6 14l6 6 10-10"
            stroke="#CCFF00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: 0,
              animation: 'drawCheck 0.4s 0.2s ease both',
            }}
          />
        </svg>
      </div>

      <h2
        className="font-display text-[28px] font-extrabold tracking-tight text-white mb-1.5"
        style={{ animation: 'fadeUp 0.4s 0.3s ease both', opacity: 0 }}
      >
        Match Saved!
      </h2>
      <p
        className="text-sm text-white/40 leading-relaxed mb-5"
        style={{ animation: 'fadeUp 0.4s 0.4s ease both', opacity: 0 }}
      >
        {totalSaved} match{totalSaved !== 1 ? 'es' : ''} logged in your history.
      </p>

      {/* Summary card */}
      <div
        className="w-full bg-volt/[0.06] border border-volt/[0.15] rounded-xl p-3.5 text-left mb-5"
        style={{ animation: 'fadeUp 0.4s 0.5s ease both', opacity: 0 }}
      >
        {summaryRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-1">
            <span className="font-display text-[11px] font-bold tracking-[0.08em] uppercase text-white/25">
              {row.label}
            </span>
            <span className="font-display text-[13px] font-bold text-volt tracking-wide">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="px-7 py-3 bg-transparent border border-white/15 rounded-xl font-display text-[13px] font-bold tracking-[0.08em] uppercase text-white/50 hover:border-white/35 hover:text-white/90 transition-colors duration-200"
        style={{ animation: 'fadeUp 0.4s 0.6s ease both', opacity: 0 }}
      >
        + Log Another Match
      </button>
    </div>
  );
}
