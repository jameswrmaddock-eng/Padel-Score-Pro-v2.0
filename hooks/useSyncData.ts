'use client';
// hooks/useSyncData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Day 1: reads/writes from localStorageAdapter.
//
// Day 2 migration (3 steps):
//   1. npm install @supabase/supabase-js
//   2. Add NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
//   3. Change the import below from './localStorageAdapter' to './supabaseAdapter'
//
// The hook's public API never changes — no component updates needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { Match }                             from '@/types/match';

// ── Day 2: cloud ─────────────────────────────────────────────────────────────
import * as adapter from './supabaseAdapter';

export interface UseSyncDataReturn {
  matches:     Match[];
  isLoading:   boolean;
  isError:     boolean;
  saveMatch:   (match: Partial<Match> & { teamA: string; teamB: string }) => Promise<Match>;
  deleteMatch: (id: string) => Promise<void>;
  clearAll:    () => Promise<void>;
  syncAll:     () => Promise<void>;
}

export function useSyncData(): UseSyncDataReturn {
  const [matches,   setMatches]   = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError,   setIsError]   = useState(false);

  // Load on mount
  useEffect(() => {
    adapter.readAll()
      .then(setMatches)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const saveMatch = useCallback(
    async (match: Partial<Match> & { teamA: string; teamB: string }): Promise<Match> => {
      const saved = await adapter.upsertOne(match);
      setMatches((prev) => {
        const idx = prev.findIndex((m) => m.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      return saved;
    },
    [],
  );

  const deleteMatch = useCallback(async (id: string) => {
    await adapter.deleteOne(id);
    setMatches((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    await adapter.clearAll();
    setMatches([]);
  }, []);

  // syncAll — on Day 1 this is a no-op.
  // On Day 2, replace with: find all matches where sync_status === 'pending'
  // and upsert them to Supabase, then mark as 'synced'.
  const syncAll = useCallback(async () => {
    const pending = matches.filter((m) => m.sync_status === 'pending');
    if (!pending.length) return;
    // Day 2: await supabaseAdapter.batchUpsert(pending);
    // For now, mark all pending as synced locally as a stub
    const updated = matches.map((m) =>
      m.sync_status === 'pending' ? { ...m, sync_status: 'synced' as const } : m,
    );
    setMatches(updated);
  }, [matches]);

  return { matches, isLoading, isError, saveMatch, deleteMatch, clearAll, syncAll };
}
