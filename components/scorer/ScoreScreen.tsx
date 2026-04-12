'use client';
// components/scorer/ScoreScreen.tsx

import { useState, useRef, useCallback, useEffect } from 'react';
import { MatchState, Side, getPointLabel, getServingTeamName } from '@/lib/scoringEngine';

interface ScoreScreenProps {
  state:   MatchState;
  onPoint: (side: Side) => void;
  onUndo:  () => void;
  canUndo: boolean;
  onReset: () => void;
}

const LONG_PRESS_MS = 2000;

// ── Long-press New Match button ───────────────────────────────────────────────
function LongPressButton({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress]   = useState(0);       // 0–100
  const [holding,  setHolding]    = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef    = useRef<number>(0);
  const RADIUS = 18;
  const CIRC   = 2 * Math.PI * RADIUS;

  const start = useCallback(() => {
    setHolding(true);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / LONG_PRESS_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        setHolding(false);
        setProgress(0);
        onComplete();
      }
    }, 16);
  }, [onComplete]);

  const cancel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const strokeDash = CIRC - (progress / 100) * CIRC;

  return (
    <button
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={cancel}
      onTouchCancel={cancel}
      className="relative py-3.5 rounded-xl font-sans text-[12px] font-bold tracking-[0.06em] uppercase transition-colors duration-200 select-none overflow-hidden"
      style={{
        background:  holding ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        borderColor: holding ? 'rgba(255,255,255,0.2)'  : 'rgba(255,255,255,0.1)',
        border: '1px solid',
        color: holding ? '#fff' : 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        width: '100%',
      }}
      aria-label="Hold 2 seconds to start new match"
      title="Hold for 2 seconds to reset"
    >
      {/* Circular SVG progress ring */}
      {holding && (
        <svg
          width="40" height="40" viewBox="0 0 40 40"
          className="absolute inset-0 m-auto pointer-events-none"
          style={{ opacity: 0.9 }}
          aria-hidden
        >
          <circle
            cx="20" cy="20" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2.5"
          />
          <circle
            cx="20" cy="20" r={RADIUS}
            fill="none"
            stroke="#CCFF00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={strokeDash}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.016s linear' }}
          />
        </svg>
      )}
      <span style={{ opacity: holding ? 0.3 : 1, transition: 'opacity 0.2s' }}>
        {holding ? 'Hold…' : 'New Match'}
      </span>
    </button>
  );
}

// ── Animated score number ──────────────────────────────────────────────────────
function AnimatedScore({
  value, color, size, undoKey,
}: { value: string; color: string; size: string; undoKey: number }) {
  const [displayed,   setDisplayed]   = useState(value);
  const [animClass,   setAnimClass]   = useState('');
  const prevKey = useRef(undoKey);

  useEffect(() => {
    if (undoKey !== prevKey.current) {
      // Undo — slide down
      setAnimClass('score-slide-down');
      const t = setTimeout(() => {
        setDisplayed(value);
        setAnimClass('score-slide-up-in');
        prevKey.current = undoKey;
        setTimeout(() => setAnimClass(''), 200);
      }, 150);
      return () => clearTimeout(t);
    } else if (value !== displayed) {
      // Normal score — slide up
      setAnimClass('score-slide-out-up');
      const t = setTimeout(() => {
        setDisplayed(value);
        setAnimClass('score-slide-in-up');
        setTimeout(() => setAnimClass(''), 200);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [value, undoKey, displayed]);

  const isAdv = displayed === 'ADV';

  return (
    <span
      className={`score-animated ${animClass} ${isAdv ? 'adv-pulse' : ''}`}
      style={{ color, fontSize: size, fontFamily: 'Inter, sans-serif', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, display: 'inline-block' }}
    >
      {displayed}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ScoreScreen({ state, onPoint, onUndo, canUndo, onReset }: ScoreScreenProps) {
  const [undoKey, setUndoKey] = useState(0);

  const {
    config, pointsA, pointsB, gamesA, gamesB, sets,
    deuce, deuceAdvantage, silverPointActive, deuceCount, inTiebreak,
    tbPointsA, tbPointsB, server,
  } = state;

  const servingName = getServingTeamName(state);

  // ── Point labels ──────────────────────────────────────────────────────────
  const labelA = inTiebreak
    ? String(tbPointsA)
   : getPointLabel(pointsA, deuce, deuceAdvantage, 'A', silverPointActive ?? false, config.deuceMode, deuceCount);
  const labelB = inTiebreak
    ? String(tbPointsB)
: getPointLabel(pointsB, deuce, deuceAdvantage, 'B', silverPointActive ?? false, config.deuceMode, deuceCount);

  // ── Colour logic: white default, volt when strictly leading ───────────────
  const ptLeadA = inTiebreak ? tbPointsA > tbPointsB : pointsA > pointsB;
  const ptLeadB = inTiebreak ? tbPointsB > tbPointsA : pointsB > pointsA;
  const ptColorA = deuce && deuceAdvantage === 'A' ? '#CCFF00'
    : deuce ? '#ffffff'
    : ptLeadA ? '#CCFF00' : '#ffffff';
  const ptColorB = deuce && deuceAdvantage === 'B' ? '#CCFF00'
    : deuce ? '#ffffff'
    : ptLeadB ? '#CCFF00' : '#ffffff';

  const gmLeadA  = gamesA > gamesB;
  const gmLeadB  = gamesB > gamesA;
  const gmColorA = gmLeadA ? '#CCFF00' : '#ffffff';
  const gmColorB = gmLeadB ? '#CCFF00' : '#ffffff';

  // ── Undo with animation trigger ───────────────────────────────────────────
  function handleUndo() {
    if (!canUndo) return;
    setUndoKey((k) => k + 1);
    onUndo();
  }

  function TeamPanel({ side }: { side: Side }) {
    const isA    = side === 'A';
    const name   = isA ? config.teamA : config.teamB;
    const games  = isA ? gamesA : gamesB;
    const label  = isA ? labelA : labelB;
    const ptColor = isA ? ptColorA : ptColorB;
    const gmColor = isA ? gmColorA : gmColorB;
    const serves  = server === side;
    const isLeading = isA ? gmLeadA : gmLeadB;

    return (
      <button
        onClick={() => onPoint(side)}
        aria-label={`Point for ${name}`}
        className="group flex-1 flex flex-col items-center justify-between py-8 px-4 rounded-2xl border transition-all duration-200 ease-in-out active:scale-95 team-panel-btn"
        style={{
          background:  isLeading ? 'rgba(204,255,0,0.04)' : 'rgba(255,255,255,0.03)',
          borderColor: isLeading ? 'rgba(204,255,0,0.2)'  : 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
        }}
      >
        {/* ── Serve indicator ── */}
        <div className="h-5 flex items-center justify-center">
          {serves ? (
            <div
              title={`${name} is serving`}
              className="flex items-center gap-1.5"
            >
              <div className="serve-dot w-2 h-2 rounded-full bg-volt" />
              <span className="font-sans text-[9px] font-bold tracking-[0.1em] uppercase text-volt">
                Serving
              </span>
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full" style={{ background: 'transparent' }} />
          )}
        </div>

        {/* Team name */}
        <p className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-white/50 mb-1">
          {name}
        </p>

        {/* Point score — animated */}
        <AnimatedScore
          value={label}
          color={ptColor}
          size={inTiebreak ? 'clamp(52px,9vw,88px)' : 'clamp(60px,10vw,100px)'}
          undoKey={undoKey}
        />

        {/* Games count */}
        <p
          className="font-sans text-[32px] font-black leading-none tracking-[-0.02em] mt-3 transition-colors duration-200"
          style={{ color: gmColor }}
        >
          {games}
        </p>

        {/* Set chips */}
        <div className="flex gap-1.5 mt-3 flex-wrap justify-center min-h-[22px]">
          {sets.map((s, i) => {
            const myScore  = isA ? s.a : s.b;
            const oppScore = isA ? s.b : s.a;
            const won      = myScore > oppScore;
            return (
              <span key={i} className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background:  won ? 'rgba(204,255,0,0.1)'   : 'rgba(255,255,255,0.06)',
                  border:      `1px solid ${won ? 'rgba(204,255,0,0.3)' : 'rgba(255,255,255,0.15)'}`,
                  color:       won ? '#CCFF00' : '#ffffff',
                }}>
                {myScore}
              </span>
            );
          })}
        </div>

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
          <div className="serve-dot w-1.5 h-1.5 rounded-full bg-volt" />
          <span className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-volt">
            {inTiebreak ? 'Tiebreak' : (silverPointActive ? 'Silver Point' : (config.deuceMode === 'starPoint' && deuceCount >= 3 ? 'Star Point' : 'Live'))}
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

        {/* Undo — disabled at 30% opacity when no history */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="py-3.5 rounded-xl font-sans text-[12px] font-bold tracking-[0.06em] uppercase transition-all duration-200 border"
          style={{
            background:  'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255,255,255,0.12)',
            color:       '#ffffff',
            opacity:     canUndo ? 1 : 0.3,
            cursor:      canUndo ? 'pointer' : 'not-allowed',
            transform:   'none',
          }}
          title={canUndo ? 'Undo last point' : 'Nothing to undo'}
        >
          ↩ Undo
        </button>

        {/* Long-press New Match */}
        <LongPressButton onComplete={onReset} />
      </div>

      {/* Match log */}
      <details className="group">
        <summary className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-white/25 cursor-pointer hover:text-white/50 transition-colors duration-200 list-none flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-open:rotate-90" aria-hidden>
            <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
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
        /* ── Serve dot pulse ── */
        .serve-dot { animation: servePulse 1.8s ease-in-out infinite; }
        @keyframes servePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }

        /* ── ADV glow pulse ── */
        .adv-pulse { animation: advPulse 1.2s ease-in-out infinite; }
        @keyframes advPulse {
          0%,100% { text-shadow: 0 0 0px rgba(204,255,0,0); }
          50%      { text-shadow: 0 0 18px rgba(204,255,0,0.6), 0 0 40px rgba(204,255,0,0.25); }
        }

        /* ── Score slide animations ── */
        .score-animated { transition: none; }

        /* Forward score — slide up */
        .score-slide-out-up {
          animation: slideOutUp 0.12s ease-in both;
        }
        .score-slide-in-up {
          animation: slideInUp 0.18s ease-out both;
        }
        @keyframes slideOutUp {
          from { opacity:1; transform:translateY(0); }
          to   { opacity:0; transform:translateY(-16px); }
        }
        @keyframes slideInUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Undo — slide down */
        .score-slide-down {
          animation: slideDown 0.15s ease-in both;
        }
        .score-slide-up-in {
          animation: slideUpIn 0.2s ease-out both;
        }
        @keyframes slideDown {
          from { opacity:1; transform:translateY(0); }
          to   { opacity:0; transform:translateY(20px); }
        }
        @keyframes slideUpIn {
          from { opacity:0; transform:translateY(-14px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Team panel hover ── */
        .team-panel-btn:hover {
          border-color: rgba(204,255,0,0.28) !important;
          background: rgba(204,255,0,0.05) !important;
        }
      `}</style>
    </div>
  );
}
