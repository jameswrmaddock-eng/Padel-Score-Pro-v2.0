// ─────────────────────────────────────────────────────────────────────────────
// hooks/localStorageAdapter.ts
//
// A thin async wrapper around localStorage.
//
// WHY async?
// The public API of useSyncData is fully async so that swapping this file for
// a Supabase/Firebase adapter costs zero changes to any calling component.
// localStorage itself is synchronous, but wrapping it in Promise.resolve()
// means the interface is already correct for when you go async-for-real.
//
// HOW TO SWAP IT OUT (Day 2+):
//   1. Create supabaseAdapter.ts that exports the same five functions.
//   2. In useSyncData.ts, change the one import line at the top.
//   3. Done. No component code changes needed.
// ─────────────────────────────────────────────────────────────────────────────

import { Match } from '@/types/match';

const STORAGE_KEY = 'psp_matches_v2';

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function readAll(): Promise<Match[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Match[]) : [];
  } catch {
    console.warn('[localStorageAdapter] readAll failed — returning empty array');
    return [];
  }
}

// ─── Write (upsert semantics: insert or update by id) ────────────────────────

export async function upsertOne(match: Match): Promise<Match> {
  // ─────────────────────────────────────────────────────────────────────────
  // CLOUD UPSERT — INSERT THIS BLOCK ON DAY 2
  // ─────────────────────────────────────────────────────────────────────────
  //
  // SUPABASE EXAMPLE:
  // ─────────────────
  //   import { supabase } from '@/lib/supabaseClient'
  //
  //   const { error } = await supabase
  //     .from('matches')
  //     .upsert(
  //       {
  //         id:          match.id,
  //         created_at:  new Date(match.createdAt).toISOString(),
  //         updated_at:  new Date(match.updatedAt).toISOString(),
  //         team_a:      match.teamA,
  //         team_b:      match.teamB,
  //         sets:        match.sets,            // jsonb column
  //         winner:      match.winner,
  //         location:    match.location,
  //         date:        match.date,
  //       },
  //       { onConflict: 'id' }                  // <- idempotent upsert
  //     )
  //
  //   if (error) throw new Error(error.message)
  //   return { ...match, isSynced: true, syncStatus: 'synced', syncError: undefined }
  //
  // ─────────────────────────────────────────────────────────────────────────
  // FIREBASE EXAMPLE:
  // ─────────────────
  //   import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
  //   import { db } from '@/lib/firebaseClient'
  //
  //   await setDoc(
  //     doc(db, 'matches', match.id),
  //     {
  //       ...match,
  //       updatedAt: serverTimestamp(),          // let Firestore own the timestamp
  //     },
  //     { merge: true }                          // merge: true = upsert behaviour
  //   )
  //   return { ...match, isSynced: true, syncStatus: 'synced', syncError: undefined }
  //
  // ─────────────────────────────────────────────────────────────────────────
  //
  // DAY 1 — local only:
  // isSynced stays false because no remote write occurred.
  const all = await readAll();
  const idx = all.findIndex((m) => m.id === match.id);
  const updated: Match = { ...match, isSynced: false, syncStatus: 'idle' };
  if (idx >= 0) {
    all[idx] = updated;
  } else {
    all.push(updated);
  }
  await writeAll(all);
  return updated;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteOne(id: string): Promise<void> {
  // ─────────────────────────────────────────────────────────────────────────
  // CLOUD DELETE — INSERT THIS BLOCK ON DAY 2
  // ─────────────────────────────────────────────────────────────────────────
  //
  // SUPABASE EXAMPLE:
  //   const { error } = await supabase.from('matches').delete().eq('id', id)
  //   if (error) throw new Error(error.message)
  //
  // FIREBASE EXAMPLE:
  //   import { doc, deleteDoc } from 'firebase/firestore'
  //   await deleteDoc(doc(db, 'matches', id))
  //
  // ─────────────────────────────────────────────────────────────────────────
  const all = await readAll();
  await writeAll(all.filter((m) => m.id !== id));
}

// ─── Clear all ────────────────────────────────────────────────────────────────

export async function clearAll(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Internal: write the full array ──────────────────────────────────────────

async function writeAll(matches: Match[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  } catch (e) {
    console.error('[localStorageAdapter] writeAll failed', e);
    throw new Error('localStorage write failed — storage may be full');
  }
}
