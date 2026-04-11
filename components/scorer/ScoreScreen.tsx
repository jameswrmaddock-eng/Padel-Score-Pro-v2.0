'use client';
// components/scorer/ScoreScreen.tsx

import { MatchState, Side, getPointLabel, getServingTeamName } from '@/lib/scoringEngine';

interface ScoreScreenProps {
  state:   MatchState;
  onPoint: (side: Side) => void;
  onUndo:  () => void;
  canUndo: boolean;
  onReset: () => void;
}

export default function ScoreScreen({ state, onPoint, onUndo, canUndo, onReset }: ScoreScreenProps) {
  const {
    config, pointsA, pointsB, gamesA, gamesB, sets,
    deuce, deuceAdvantage, silverPointActive, inTiebreak, tbPointsA, tbPointsB, server,
  } = state;

  const servingName = getServingTeamName(state);

  // ── Point display labels ──────────────────────────────────────────────────
  const labelA = inTiebreak
    ? String(tbPointsA)
    : getPointLabel(pointsA, deuce, deuceAdvantage, 'A', silverPointActive);
  const labelB = inTiebreak
    ? String(tbPointsB)
    : getPointLabel(pointsB, deuce, deuceAdvantage, 'B', silverPointActive);

  // ── Colour logic ──────────────────────────────────────────────────────────
  // Points: volt for leader, white for both when tied
  const pointsLeadA = inTiebreak ? tbPointsA > tbPointsB : pointsA > pointsB;
  const pointsLeadB = inTiebreak ? tbPointsB > tbPointsA : pointsB > pointsA;
  // Deuce advantage overrides — ADV team gets volt, other stays white
  const pointColorA = deuce && deuceAdvantage === 'A' ? '#CCFF00'
    : deuce && deuceAdvantage === 'B' ? '#ffffff'
    : deuce ? '#ffffff'
    : pointsLeadA ? '#CCFF00' : '#ffffff';
  const pointColorB = deuce && deuceAdvantage === 'B' ? '#CCFF00'
    : deuce && deuceAdvantage === 'A' ? '#ffffff'
    : deuce ? '#ffffff'
    : pointsLeadB ? '#CCFF00' : '#ffffff';

  // Games: volt for leader, white when tied
  const gamesLeadA  = gamesA > gamesB;
  const gamesLeadB  = gamesB > gamesA;
  const gamesColorA = gamesLeadA ? '#CCFF00' : '#ffffff';
  const gamesColorB = gamesLeadB ? '#CCFF00' : '#ffffff';

  function TeamPanel({ side }: { side: Side }) {
    const isA      = side === 'A';
    const name     = isA ? config.teamA : config.teamB;
    const games    = isA ? gamesA : gamesB;
    const label    = isA ? labelA : labelB;
    const ptColor  = isA ? pointColorA : pointColorB;
    const gmColor  = isA ? gamesColorA : gamesColorB;
    const serves   = server === side;
    const isLeading = isA ? gamesLeadA : gamesLeadB;

    return (
      <button
        onClick={() => onPoint(side)}
        aria-label={`Point for ${name}`}
        className="group flex-1 flex flex-col items-center justify-between py-8 px-4 rounded-2xl border transition-all duration-200 ease-in-out active:scale-95"
        style={{
          background:  isLeading ? 'rgba(204,255,0,0.04)' : 'rgba(255,255,255,0.03)',
          borderColor: isLeading ? 'rgba(204,255,0,0.2)'  : 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
        }}
      >
        {/* Serve indicator */}
        <div className="h-4 flex items-center justify-center">
          {serves && (
            <div
              className="w-2 h-2 rounded-full bg-volt"
              style={{ animation: 'servePulse 1.8s ease-in-out infinite' }}
            />
          )}
        </div>

        {/* Team name */}
        <p className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-white/50 mb-1">
          {name}
        </p>

        {/* Point score — white default, volt when leading */}
        <p
          className="font-sans font-black leading-none tracking-[-0.04em] transition-colors duration-200"
          style={{
            fontSize: inTiebreak ? 'clamp(52px,9vw,88px)' : 'clamp(60px,10vw,100px)',
            color: ptColor,
          }}
        >
          {label}
        </p>

        {/* Games count — white default, volt when leading */}
        <p
          className="font-sans text-[32px] font-black leading-none tracking-[-0.02em] mt-3 transition-colors duration-200"
          style={{ color: gmColor }}
        >
          {games}
        </p>

        {/* Set chips — volt for won sets, white for lost */}
        <div className="flex gap-1.5 mt-3 flex-wrap justify-center min-h-[22px]">
          {sets.map((s, i) => {
            const myScore  = isA ? s.a : s.b;
            const oppScore = isA ? s.b : s.a;
            const won      = myScore > oppScore;
            return (
              <span
                key={i}
                className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background:  won ? 'rgba(204,255,0,0.1)'   : 'rgba(255,255,255,0.06)',
                  border:      `1px solid ${won ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.15)'}`,
                  color:       won ? '#CCFF00' : '#ffffff',
                }}
              >
                {myScore}
              </span>
            );
          })}
        </div>

        {/* Tap hint */}
        <p className="font-sans text-[10px] text-white/20 mt-4 tracking-[0.04em] uppercase">
          Tap to score
        </p>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Status bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-volt"
            style={{ animation: 'servePulse 1.8s ease-in-out infinite' }}
          />
          <span className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-volt">
            {inTiebreak ? 'Tiebreak' : silverPointActive ? 'Silver Point' : 'Live'}
          </span>
        </div>
        <span className="font-sans text-[11px] text-white/35 tracking-[0.04em]">
          {servingName} serving
        </span>
        <span className="font-sans text-[11px] text-white/35">
          Set {sets.length + 1}{config.format === 3 ? ' of 3' : ''}
        </span>
      </div>

      {/* Score panels */}
      <div className="grid grid-cols-2 gap-3">
        <TeamPanel side="A" />
        <TeamPanel side="B" />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="py-3.5 rounded-xl font-sans text-[12px] font-bold tracking-[0.06em] uppercase transition-all duration-200 border"
          style={{
            background:  canUndo ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
            borderColor: canUndo ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)',
            color:       canUndo ? '#ffffff' : 'rgba(255,255,255,0.2)',
            cursor:      canUndo ? 'pointer' : 'not-allowed',
          }}
        >
          ↩ Undo
        </button>

        <button
          onClick={onReset}
          className="py-3.5 rounded-xl font-sans text-[12px] font-bold tracking-[0.06em] uppercase text-white/40 border border-white/[0.1] hover:border-white/25 hover:text-white/70 transition-all duration-200 cursor-pointer"
        >
          New Match
        </button>
      </div>

      {/* Match log */}
      <details className="group">
        <summary className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/25 cursor-pointer hover:text-white/50 transition-colors duration-200 list-none flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-open:rotate-90" aria-hidden>
            <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Match Log
        </summary>
        <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 max-h-40 overflow-y-auto">
          {state.matchLog.slice().reverse().map((entry, i) => (
            <p key={i} className="font-sans text-[11px] text-white/40 py-0.5 border-b border-white/[0.04] last:border-0">
              {entry}
            </p>
          ))}
        </div>
      </details>

      <style>{`
        .group:hover { border-color: rgba(204,255,0,0.25) !important; }
        @keyframes servePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
      `}</style>
    </div>
  );
}
