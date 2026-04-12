// hooks/supabaseAdapter.ts
// ─────────────────────────────────────────────────────────────────────────────
// Cloud storage adapter — drop-in replacement for localStorageAdapter.ts.
// Exports the exact same four functions so useSyncData.ts needs no further
// changes after swapping the import.
//
// SETUP CHECKLIST (one-time):
//   1. npm install @supabase/supabase-js          ← already done
//   2. Add to .env.local:
//        NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
//        NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
//   3. Create the matches table in Supabase (SQL below)
//
// ─── Supabase SQL ─────────────────────────────────────────────────────────────
//
//   create table public.matches (
//     id            text primary key,
//     device_id     text not null,
//     team_a        text not null,
//     team_b        text not null,
//     winner        text,
//     sets          jsonb not null default '[]',
//     format        text not null,
//     deuce_mode    text not null,
//     location      text,
//     notes         text,
//     created_at    timestamptz not null,
//     last_modified timestamptz not null,
//     sync_status   text not null default 'pending',
//     user_id       uuid references auth.users(id) on delete cascade
//   );
//
//   alter table public.matches enable row level security;
//
//   create policy "own matches" on public.matches
//     for all using (auth.uid()::text = user_id::text);
//
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';
import { Match, SetScore, SyncStatus } from '@/types/match';
import { generateUUID, nowISO } from '@/utils/uuid';
import { getDeviceId } from '@/utils/deviceId';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── Column mapping helpers ───────────────────────────────────────────────────

function toRow(match: Match): Record<string, unknown> {
  return {
    id:            match.id,
    device_id:     match.device_id,
    team_a:        match.teamA,
    team_b:        match.teamB,
    winner:        match.winner ?? null,
    sets:          match.sets,
    format:        match.format,
    deuce_mode:    match.deuceMode,
    location:      match.location ?? null,
    notes:         match.notes ?? null,
    created_at:    match.created_at,
    last_modified: match.last_modified,
    sync_status:   match.sync_status,
  };
}

function fromRow(row: Record<string, unknown>): Match {
  return {
    id:            row.id            as string,
    device_id:     row.device_id     as string,
    teamA:         row.team_a        as string,
    teamB:         row.team_b        as string,
    winner:        (row.winner       as string | null) ?? null,
    sets:          (row.sets         as SetScore[]) ?? [],
    format:        row.format        as Match['format'],
    deuceMode:     row.deuce_mode    as Match['deuceMode'],
    location:      row.location      as string | undefined,
    notes:         row.notes         as string | undefined,
    created_at:    row.created_at    as string,
    last_modified: row.last_modified as string,
    sync_status:   row.sync_status   as SyncStatus,
  };
}

// ─── readAll ──────────────────────────────────────────────────────────────────

export async function readAll(): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

// ─── upsertOne ────────────────────────────────────────────────────────────────
// Accepts the same shape as localStorageAdapter so useSyncData.ts needs no
// changes. Generates an ID and defaults for new matches client-side (offline-
// first: IDs are UUID v4 strings safe to create without a server round-trip).

export async function upsertOne(
  match: Partial<Match> & { teamA: string; teamB: string },
): Promise<Match> {
  const deviceId = getDeviceId();
  const now      = nowISO();

  // Build a complete Match, merging caller data over safe defaults
  const full: Match = {
    id:            match.id            ?? generateUUID(),
    device_id:     match.device_id     ?? deviceId,
    created_at:    match.created_at    ?? now,
    last_modified: now,
    sync_status:   'pending' as SyncStatus,
    format:        match.format        ?? '1 Set',
    deuceMode:     match.deuceMode     ?? 'longDeuce',
    sets:          match.sets          ?? [],
    winner:        match.winner        ?? null,
    teamA:         match.teamA,
    teamB:         match.teamB,
    location:      match.location,
    notes:         match.notes,
  };

  const { error } = await supabase
    .from('matches')
    .upsert(toRow(full), { onConflict: 'id' });

  if (error) throw new Error(error.message);

  return { ...full, sync_status: 'synced' };
}

// ─── deleteOne ────────────────────────────────────────────────────────────────

export async function deleteOne(id: string): Promise<void> {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ─── clearAll ─────────────────────────────────────────────────────────────────
// Deletes only the current user's rows — Row Level Security enforces this.

export async function clearAll(): Promise<void> {
  const { error } = await supabase
    .from('matches')
    .delete()
    .neq('id', '');

  if (error) throw new Error(error.message);
}
