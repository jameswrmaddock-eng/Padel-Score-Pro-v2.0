// ─────────────────────────────────────────────────────────────────────────────
// types/match.ts
//
// Central type definitions. These are intentionally designed to mirror
// the shape you would use in a Supabase table or Firestore document so
// that the migration from local → cloud storage requires zero schema changes.
// ─────────────────────────────────────────────────────────────────────────────

export interface SetScore {
  a: number;
  b: number;
}

// ─── Sync Status ─────────────────────────────────────────────────────────────
// isSynced: false  → persisted locally only, not yet written to the cloud
// isSynced: true   → confirmed written to remote (Supabase / Firebase / etc.)
//
// On Day 1 every record will have isSynced: false because we have no remote.
// On the day you wire up a backend, the upsert call flips this to true.
// ─────────────────────────────────────────────────────────────────────────────
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface Match {
  // ── Identity ────────────────────────────────────────────────────────────────
  id: string;          // UUID — stable across local and remote
  createdAt: number;   // Unix ms — used for ordering and conflict resolution
  updatedAt: number;   // Updated on every mutation; cloud uses this for upsert ordering

  // ── Match data ──────────────────────────────────────────────────────────────
  teamA: string;
  teamB: string;
  sets: SetScore[];
  winner: string;
  location: string;
  date: string;        // Human-readable: "5 Jul 2026"

  // ── Sync ────────────────────────────────────────────────────────────────────
  isSynced: boolean;         // false until a successful remote write is confirmed
  syncStatus: SyncStatus;    // granular state for UI feedback
  syncError?: string;        // last error message if syncStatus === 'error'
}

// ─── Hook return shape ───────────────────────────────────────────────────────
export interface UseSyncDataReturn {
  matches: Match[];
  isLoading: boolean;
  isSyncing: boolean;
  saveMatch: (payload: NewMatchPayload) => Promise<Match>;
  deleteMatch: (id: string) => Promise<void>;
  syncAll: () => Promise<void>;         // manually re-attempt sync for all un-synced records
  clearAll: () => Promise<void>;
  pendingCount: number;                 // how many records are isSynced: false
}

// ─── Input type (what callers pass to saveMatch) ─────────────────────────────
export type NewMatchPayload = Pick<Match,
  'teamA' | 'teamB' | 'sets' | 'location'
>;
