'use client';
// hooks/useScorer.ts

import { useState, useCallback } from 'react';
import {
  MatchConfig, MatchState, Side,
  initMatch, scorePoint,
} from '@/lib/scoringEngine';

const MAX_HISTORY = 50;

export interface UseScorerReturn {
  state:        MatchState | null;
  history:      MatchState[];
  startMatch:   (config: MatchConfig) => void;
  addPoint:     (side: Side) => void;
  undo:         () => void;
  resetMatch:   () => void;
  canUndo:      boolean;
}

export function useScorer(): UseScorerReturn {
  const [state,   setState]   = useState<MatchState | null>(null);
  const [history, setHistory] = useState<MatchState[]>([]);

  const startMatch = useCallback((config: MatchConfig) => {
    const initial = initMatch(config);
    setState(initial);
    setHistory([]);
  }, []);

  const addPoint = useCallback((side: Side) => {
    setState((prev) => {
      if (!prev || prev.winner) return prev;
      const next = scorePoint(prev, side);
      setHistory((h) => [...h.slice(-MAX_HISTORY), prev]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setState(prev);
      return h.slice(0, -1);
    });
  }, []);

  const resetMatch = useCallback(() => {
    setState(null);
    setHistory([]);
  }, []);

  return {
    state,
    history,
    startMatch,
    addPoint,
    undo,
    resetMatch,
    canUndo: history.length > 0,
  };
}
