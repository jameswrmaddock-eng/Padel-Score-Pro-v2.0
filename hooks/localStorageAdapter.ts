// hooks/localStorageAdapter.ts
// ─────────────────────────────────────────────────────────────────────────────
// Day 1 storage adapter. Swap the import in useSyncData.ts for
// supabaseAdapter.ts when ready to go cloud.
//
// All matches are stored under the key 'psp_matches' as a JSON array.
// IDs are now UUID v4 strings — safe for offline multi-device use.
// ─────────────────────────────────────────────────────────────────────────────

import { Match, SyncStatus } from '@/types/match';
import { generateUUID, nowISO } from '@/utils/uuid';
import { getDeviceId } from '@/utils/deviceId';

const STORAGE_KEY = 'psp_matches';

function load(): Match[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Match[];
  } catch {
    return [];
  }
}

function save(matches: Match[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}

// ── Public API (mirrors supabaseAdapter interface exactly) ────────────────────

export async function readAll(): Promise<Match[]> {
  return load();
}

export async function upsertOne(match: Partial<Match> & { teamA: string; teamB: string }): Promise<Match> {
  const matches  = load();
  const deviceId = getDeviceId();
  const now      = nowISO();

  const existing = match.id ? matches.find((m) => m.id === match.id) : null;

  const updated: Match = {
    // Defaults for new match
    id:            existing?.id            ?? generateUUID(),
    device_id:     existing?.device_id     ?? deviceId,
    created_at:    existing?.created_at    ?? now,
    sync_status:   'pending' as SyncStatus,
    format:        '1 Set',
    deuceMode:     'longDeuce',
    sets:          [],
    winner:        null,
    // Spread caller's data
    ...existing,
    ...match,
    // Always update last_modified
    last_modified: now,
  };

  const idx = matches.findIndex((m) => m.id === updated.id);
  if (idx >= 0) {
    matches[idx] = updated;
  } else {
    matches.unshift(updated);
  }

  save(matches);
  return updated;
}

export async function deleteOne(id: string): Promise<void> {
  save(load().filter((m) => m.id !== id));
}

export async function clearAll(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Conflict resolution helper — used by sync engine
// "Latest timestamp wins" strategy
export function resolveConflict(local: Match, remote: Match): Match {
  return new Date(local.last_modified) >= new Date(remote.last_modified) ? local : remote;
}
