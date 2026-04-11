// types/match.ts
// ─────────────────────────────────────────────────────────────────────────────
// Universal Match schema. Identical shape across Website, iOS, Android,
// and Apple Watch so every platform can write and read without conversion.
//
// Changes from v1:
//   id          → UUID v4 string (was: number)
//   created_at  → ISO 8601 string (new)
//   last_modified → ISO 8601 string (was: number ms)
//   device_id   → string (new — set on first app load, stored in localStorage)
//   sync_status → 'pending' | 'synced' | 'error' (was: boolean isSynced)
// ─────────────────────────────────────────────────────────────────────────────

export type SyncStatus = 'pending' | 'synced' | 'error';

export type MatchResult = 'W' | 'L' | 'D';

export interface SetScore {
  a: number;
  b: number;
}

export interface Match {
  // ── Identity ───────────────────────────────────────────────────────────────
  id:            string;        // UUID v4 — safe for multi-device offline use
  device_id:     string;        // which device created this match

  // ── Teams ──────────────────────────────────────────────────────────────────
  teamA:         string;
  teamB:         string;
  winner:        string | null;

  // ── Score ──────────────────────────────────────────────────────────────────
  sets:          SetScore[];
  format:        '1 Set' | 'Best of 3';
  deuceMode:     'longDeuce' | 'silverPoint' | 'goldenPoint' | 'starPoint';

  // ── Context ────────────────────────────────────────────────────────────────
  location?:     string;
  notes?:        string;

  // ── Timestamps ─────────────────────────────────────────────────────────────
  created_at:    string;        // ISO 8601 — when the match was started
  last_modified: string;        // ISO 8601 — last write, used for conflict resolution

  // ── Sync ───────────────────────────────────────────────────────────────────
  sync_status:   SyncStatus;    // 'pending' until confirmed by cloud
}

// Helper — builds a new match shell with all required fields pre-filled
// Call this when starting a match instead of constructing the object manually
export function createMatchShell(
  teamA: string,
  teamB: string,
  format: Match['format'],
  deuceMode: Match['deuceMode'],
  deviceId: string,
): Omit<Match, 'sets' | 'winner'> {
  const now = new Date().toISOString();
  // Inline UUID generation to avoid circular imports
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });

  return {
    id,
    device_id:     deviceId,
    teamA,
    teamB,
    format,
    deuceMode,
    created_at:    now,
    last_modified: now,
    sync_status:   'pending',
  };
}
