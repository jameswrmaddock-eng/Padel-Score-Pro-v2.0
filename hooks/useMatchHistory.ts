'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SetScore {
  a: number;
  b: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  sets: SetScore[];
  location: string;
  winner: string;
  date: string;
  createdAt: number;
}

const STORAGE_KEY = 'psp_match_history';

function loadFromStorage(): Match[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Match[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(matches: Match[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  } catch {
    console.warn('[useMatchHistory] localStorage write failed');
  }
}

function deriveWinner(teamA: string, teamB: string, sets: SetScore[]): string {
  const winsA = sets.filter((s) => s.a > s.b).length;
  const winsB = sets.filter((s) => s.b > s.a).length;
  if (winsA > winsB) return teamA;
  if (winsB > winsA) return teamB;
  return 'Draw';
}

export function useMatchHistory() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setMatches(loadFromStorage());
    setIsHydrated(true);
  }, []);

  const saveMatch = useCallback(
    (payload: Omit<Match, 'id' | 'winner' | 'date' | 'createdAt'>): Match => {
      const createdAt = Date.now();
      const entry: Match = {
        ...payload,
        id: createdAt.toString(),
        createdAt,
        winner: deriveWinner(payload.teamA, payload.teamB, payload.sets),
        date: new Date(createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      setMatches((prev) => {
        const next = [...prev, entry];
        saveToStorage(next);
        return next;
      });
      return entry;
    },
    [],
  );

  const deleteMatch = useCallback((id: string) => {
    setMatches((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setMatches([]);
    saveToStorage([]);
  }, []);

  return { matches, saveMatch, deleteMatch, clearHistory, isHydrated };
}
