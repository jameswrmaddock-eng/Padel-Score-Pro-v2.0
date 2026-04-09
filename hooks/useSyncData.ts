// ─────────────────────────────────────────────────────────────────────────────
// hooks/useSyncData.ts
//
// Public API for all match persistence in PadelScorePro.
//
// Architecture overview:
//
//   Component
//       │
//       ▼
//   useSyncData          ← this file (orchestration & state)
//       │
//       ▼
//   localStorageAdapter  ← today
//   supabaseAdapter      ← Day 2 drop-in (swap the one import below)
//   firebaseAdapter      ← alternative Day 2 drop-in
//
// To migrate to the cloud on Day 2:
//   Change the single import line marked "← SWAP THIS LINE" and you're done.
//   Every component that calls useSyncData requires zero changes.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Match, NewMatchPayload, SyncStatus, UseSyncDataReturn } from '@/types/match';

// ─── SWAP THIS LINE to migrate to cloud storage ───────────────────────────────
import * as adapter from './localStorageAdapter';
// import * as adapter from './supabaseAdapter';   // Day 2 — Supabase
// import * as adapter from './firebaseAdapter';   // Day 2 — Firebase
// ─────────────────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  // crypto.randomUUID() is available in all modern browsers and Node 14.17+.
  // Falls back to a timestamp+random string for older environments.
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function deriveWinner(teamA: string, teamB: string, sets: Match['sets']): string {
  const winsA = sets.filter((s) => s.a > s.b).length;
  const winsB = sets.filter((s) => s.b > s.a).length;
  if (winsA > winsB) return teamA;
  if (winsB > winsA) return teamB;
  return 'Draw';
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSyncData(): UseSyncDataReturn {
  const [matches, setMatches]     = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Ref so async callbacks always read the latest matches without stale closure
  const matchesRef = useRef<Match[]>([]);
  matchesRef.current = matches;

  // ── Bootstrap: load from storage on mount ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await adapter.readAll();
        if (!cancelled) {
          setMatches(stored.slice().sort((a, b) => b.createdAt - a.createdAt));
        }
      } catch (err) {
        console.error('[useSyncData] initial load failed', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── saveMatch ────────────────────────────────────────────────────────────────
  //
  // Flow:
  //   1. Build a full Match object with isSynced: false, syncStatus: 'syncing'
  //   2. Optimistically update local React state immediately (fast UI)
  //   3. Await the adapter upsert (local today, remote on Day 2)
  //   4. On success → flip isSynced/syncStatus in state
  //   5. On error   → flip syncStatus to 'error', store message
  //
  const saveMatch = useCallback(async (payload: NewMatchPayload): Promise<Match> => {
    const now = Date.now();

    const draft: Match = {
      id:         generateId(),
      createdAt:  now,
      updatedAt:  now,
      teamA:      payload.teamA.trim(),
      teamB:      payload.teamB.trim(),
      sets:       payload.sets,
      winner:     deriveWinner(payload.teamA, payload.teamB, payload.sets),
      location:   payload.location.trim() || 'Unspecified',
      date:       formatDate(now),
      // ── Sync fields — start pessimistic ──────────────────────────────────
      isSynced:    false,
      syncStatus: 'syncing' as SyncStatus,
      syncError:   undefined,
    };

    // Step 1 — optimistic UI update
    setMatches((prev) => [draft, ...prev]);

    let finalMatch: Match;
    try {
      // Step 2 — persist via adapter
      // On Day 1: writes to localStorage, returns record with isSynced: false
      // On Day 2: upserts to Supabase/Firebase, returns record with isSynced: true
      finalMatch = await adapter.upsertOne(draft);
    } catch (err) {
      // Persist failed — mark error in state but keep the record
      const errorMatch: Match = {
        ...draft,
        syncStatus: 'error',
        syncError:  err instanceof Error ? err.message : 'Unknown error',
      };
      setMatches((prev) => prev.map((m) => (m.id === draft.id ? errorMatch : m)));
      throw err; // re-throw so the calling component can react
    }

    // Step 3 — update state with the adapter's confirmed version
    setMatches((prev) => prev.map((m) => (m.id === finalMatch.id ? finalMatch : m)));
    return finalMatch;
  }, []);

  // ── deleteMatch ──────────────────────────────────────────────────────────────
  const deleteMatch = useCallback(async (id: string): Promise<void> => {
    // Optimistic remove
    setMatches((prev) => prev.filter((m) => m.id !== id));
    try {
      await adapter.deleteOne(id);
    } catch (err) {
      // Rollback: restore the match if the delete failed
      const restored = matchesRef.current.find((m) => m.id === id);
      if (restored) {
        setMatches((prev) => [restored, ...prev].sort((a, b) => b.createdAt - a.createdAt));
      }
      throw err;
    }
  }, []);

  // ── syncAll ───────────────────────────────────────────────────────────────────
  //
  // Re-attempts upsert for every record where isSynced === false.
  // On Day 1 this is a no-op (there is no remote to sync to).
  // On Day 2, call this: on app focus, on network reconnect, on manual retry.
  //
  const syncAll = useCallback(async (): Promise<void> => {
    const pending = matchesRef.current.filter((m) => !m.isSynced);
    if (pending.length === 0) return;

    setIsSyncing(true);

    // Mark all pending as 'syncing'
    setMatches((prev) =>
      prev.map((m) =>
        m.isSynced ? m : { ...m, syncStatus: 'syncing' as SyncStatus },
      ),
    );

    const results = await Promise.allSettled(
      pending.map((m) =>
        adapter.upsertOne({ ...m, updatedAt: Date.now() }),
      ),
    );

    // Apply outcomes back to state
    setMatches((prev) => {
      const updated = [...prev];
      results.forEach((result, i) => {
        const id = pending[i].id;
        const idx = updated.findIndex((m) => m.id === id);
        if (idx < 0) return;
        if (result.status === 'fulfilled') {
          updated[idx] = result.value;
        } else {
          updated[idx] = {
            ...updated[idx],
            syncStatus: 'error' as SyncStatus,
            syncError:  result.reason instanceof Error
              ? result.reason.message
              : 'Sync failed',
          };
        }
      });
      return updated;
    });

    setIsSyncing(false);
  }, []);

  // ── clearAll ──────────────────────────────────────────────────────────────────
  const clearAll = useCallback(async (): Promise<void> => {
    setMatches([]);
    await adapter.clearAll();
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────────
  const pendingCount = matches.filter((m) => !m.isSynced).length;

  return {
    matches,
    isLoading,
    isSyncing,
    saveMatch,
    deleteMatch,
    syncAll,
    clearAll,
    pendingCount,
  };
}
