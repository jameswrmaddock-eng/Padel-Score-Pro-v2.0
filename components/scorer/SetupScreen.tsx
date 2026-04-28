'use client';
// components/scorer/SetupScreen.tsx

import { useState } from 'react';
import { MatchConfig, DeuceMode, TiebreakMode, MatchFormat, Side } from '@/lib/scoringEngine';

interface SetupScreenProps {
  onStart: (config: MatchConfig) => void;
}

const PILL = 'px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.06em] uppercase transition-all duration-200 ease-in-out border cursor-pointer';
const PILL_ON  = `${PILL} bg-volt text-[#050505] border-volt`;
const PILL_OFF = `${PILL} bg-transparent text-white/65 border-white/12 hover:border-white/25 hover:text-white/70`;

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/55">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [teamA,      setTeamA]      = useState('Team A');
  const [teamB,      setTeamB]      = useState('Team B');
  const [format,     setFormat]     = useState<MatchFormat>(3);
  const [deuceMode,  setDeuceMode]  = useState<DeuceMode>('longDeuce');
  const [tiebreak,   setTiebreak]   = useState<TiebreakMode>('tiebreak');
  const [playOnCap,  setPlayOnCap]  = useState<number | null>(null);
  const [firstServe, setFirstServe] = useState<Side | 'random'>('random');

  function handleStart() {
    onStart({
      teamA:      teamA.trim() || 'Team A',
      teamB:      teamB.trim() || 'Team B',
      format,
      deuceMode,
      tiebreak,
      playOnCap:  tiebreak === 'playOn' ? playOnCap : null,
      firstServe,
    });
  }

  const INPUT = [
    'w-full bg-transparent border-b border-white/15 py-2.5 text-white font-bold text-[16px]',
    'outline-none caret-volt transition-colors duration-200 focus:border-volt placeholder-white/20',
  ].join(' ');

  return (
    <div className="flex flex-col gap-7 w-full max-w-md mx-auto">

      {/* Teams */}
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/55">Team A</span>
          <input className={INPUT} value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Team A" maxLength={20} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/55">Team B</span>
          <input className={INPUT} value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Team B" maxLength={20} />
        </div>
      </div>

      {/* Format */}
      <OptionRow label="Format">
        {([1, 3] as MatchFormat[]).map((f) => (
          <button key={f} className={format === f ? PILL_ON : PILL_OFF} onClick={() => setFormat(f)}>
            {f === 1 ? '1 Set' : 'Best of 3'}
          </button>
        ))}
      </OptionRow>

      {/* Deuce */}
      <OptionRow label="Deuce Mode">
        {([
          ['longDeuce',   'Long Deuce'],
          ['silverPoint', 'Silver Point'],
          ['goldenPoint', 'Golden Point'],
          ['starPoint',   'Star Point'],
        ] as [DeuceMode, string][]).map(([val, label]) => (
          <button key={val} className={deuceMode === val ? PILL_ON : PILL_OFF} onClick={() => setDeuceMode(val)}>
            {label}
          </button>
        ))}
      </OptionRow>

      {/* Tiebreak */}
      <OptionRow label="At 6-6">
        <button className={tiebreak === 'tiebreak' ? PILL_ON : PILL_OFF} onClick={() => setTiebreak('tiebreak')}>Tiebreak</button>
        <button className={tiebreak === 'playOn'   ? PILL_ON : PILL_OFF} onClick={() => setTiebreak('playOn')}>Play On</button>
      </OptionRow>

      {/* Play-on cap */}
      {tiebreak === 'playOn' && (
        <OptionRow label="Cap">
          {([null, 8, 9, 10] as (number | null)[]).map((cap) => (
            <button key={String(cap)} className={playOnCap === cap ? PILL_ON : PILL_OFF} onClick={() => setPlayOnCap(cap)}>
              {cap === null ? 'No cap' : `${cap}-${cap}`}
            </button>
          ))}
        </OptionRow>
      )}

      {/* First serve */}
      <OptionRow label="First Serve">
        <button className={firstServe === 'random' ? PILL_ON : PILL_OFF} onClick={() => setFirstServe('random')}>Random</button>
        <button className={firstServe === 'A'      ? PILL_ON : PILL_OFF} onClick={() => setFirstServe('A')}>{teamA || 'Team A'}</button>
        <button className={firstServe === 'B'      ? PILL_ON : PILL_OFF} onClick={() => setFirstServe('B')}>{teamB || 'Team B'}</button>
      </OptionRow>

      {/* Start */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-xl bg-volt text-[#050505] font-bold text-[14px] tracking-[0.08em] uppercase transition-all duration-300 scorer-start-btn"
      >
        Start Match
      </button>

      <style>{`
        .scorer-start-btn:hover {
          background: #d4ff1a;
          box-shadow: 0 0 0 1px rgba(204,255,0,.5), 0 0 24px rgba(204,255,0,.35);
          transform: translateY(-2px);
        }
        .scorer-start-btn:active { transform: scale(.97); }
      `}</style>
    </div>
  );
}
