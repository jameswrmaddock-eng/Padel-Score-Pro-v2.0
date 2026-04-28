'use client';
// components/scorer/MatchScorer.tsx
// Orchestrates Setup → Live → Winner flow.

import { useEffect, useRef } from 'react';
import { useScorer }         from '@/hooks/useScorer';
import { useSyncData }       from '@/hooks/useSyncData';
import SetupScreen           from './SetupScreen';
import ScoreScreen           from './ScoreScreen';
import WinnerScreen          from './WinnerScreen';

export default function MatchScorer() {
  const { state, startMatch, addPoint, undo, resetMatch, canUndo } = useScorer();
  const { saveMatch } = useSyncData();
  const savedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state?.winner) return;
    const matchId = state.config.teamA + '|' + state.config.teamB + '|' + state.sets.map(s => `${s.a}-${s.b}`).join(',');
    if (savedRef.current === matchId) return;
    savedRef.current = matchId;

    const winnerName = state.winner === 'A' ? state.config.teamA : state.config.teamB;
    saveMatch({
      teamA:     state.config.teamA,
      teamB:     state.config.teamB,
      winner:    winnerName,
      sets:      state.sets,
      format:    state.config.format === 1 ? '1 Set' : 'Best of 3',
      deuceMode: state.config.deuceMode,
    });
  }, [state?.winner, state, saveMatch]);

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-[28px] border border-white/[0.08] overflow-hidden"
      style={{
        background:           'rgba(255,255,255,0.03)',
        backdropFilter:       'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-volt"
                  style={{ animation: 'scorerPulse 2s ease-in-out infinite' }} />
            <span className="font-sans text-[10px] font-bold tracking-[0.14em] uppercase text-volt">
              {state?.winner ? 'Match Over' : state ? 'Live Match' : 'New Match'}
            </span>
          </div>
          <h2 className="font-sans text-[20px] font-black tracking-[-0.02em] text-white leading-none uppercase">
            Score Tracker
          </h2>
        </div>

        {state && !state.winner && (
          <div className="text-right">
            <p className="font-sans text-[10px] text-white/50 uppercase tracking-[0.06em]">
              {state.config.format === 1 ? '1 Set' : 'Best of 3'}
            </p>
            <p className="font-sans text-[10px] text-white/50 uppercase tracking-[0.06em]">
              {state.config.deuceMode === 'longDeuce'    ? 'Long Deuce'
                : state.config.deuceMode === 'silverPoint' ? 'Silver Pt'
                : state.config.deuceMode === 'goldenPoint' ? 'Golden Pt'
                : 'Star Point'}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-7 py-6">
        {!state && (
          <SetupScreen onStart={startMatch} />
        )}
        {state && !state.winner && (
          <ScoreScreen
            state={state}
            onPoint={addPoint}
            onUndo={undo}
            canUndo={canUndo}
            onReset={resetMatch}
          />
        )}
        {state?.winner && (
          <WinnerScreen state={state} onReset={resetMatch} />
        )}
      </div>

      <style>{`
        @keyframes scorerPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
      `}</style>
    </div>
  );
}
