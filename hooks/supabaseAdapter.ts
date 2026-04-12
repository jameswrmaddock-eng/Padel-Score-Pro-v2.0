// ─────────────────────────────────────────────────────────────────────────────
// hooks/supabaseAdapter.ts  (Day 2 drop-in — not active yet)
//
// This file is the cloud-ready replacement for localStorageAdapter.ts.
// It exports the EXACT same four functions so useSyncData.ts needs only
// one line changed to go fully cloud-backed.
//
// SETUP CHECKLIST:
//   1. npm install @supabase/supabase-js
//   2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
//   3. Create the matches table in Supabase (SQL below)
//   4. In useSyncData.ts, swap:
//        import * as adapter from './localStorageAdapter'
//      for:
//        import * as adapter from './supabaseAdapter'
//
// ─── Supabase SQL (run in the Supabase SQL editor) ────────────────────────────
//
//   create table public.matches (
//     id          uuid primary key,
//     created_at  timestamptz not null,
//     updated_at  timestamptz not null,
//     team_a      text not null,
//     team_b      text not null,
//     sets        jsonb not null default '[]',
//     winner      text not null,
//     location    text not null default 'Unspecified',
//     date        text not null,
//     is_synced   boolean not null default true,
//     user_id     uuid references auth.users(id) on delete cascade
//   );
//
//   -- Enable Row Level Security
//   alter table public.matches enable row level security;
//
//   -- Policy: users can only see their own matches
//   create policy "own matches" on public.matches
//     for all using (auth.uid() = user_id);
//
// ─────────────────────────────────────────────────────────────────────────────

import { Match } from '@/types/match';

// ─── Uncomment when ready ─────────────────────────────────────────────────────
// import { createClient } from '@supabase/supabase-js'
//
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// )
//
// ─── Column mapping helpers ───────────────────────────────────────────────────
// Supabase uses snake_case columns; our Match type uses camelCase.
// These helpers handle the translation in both directions.
//
// function toRow(match: Match) {
//   return {
//     id:         match.id,
//     created_at: new Date(match.createdAt).toISOString(),
//     updated_at: new Date(match.updatedAt).toISOString(),
//     team_a:     match.teamA,
//     team_b:     match.teamB,
//     sets:       match.sets,
//     winner:     match.winner,
//     location:   match.location,
//     date:       match.date,
//     is_synced:  true,
//   }
// }
//
// function fromRow(row: Record<string, unknown>): Match {
//   return {
//     id:         row.id as string,
//     createdAt:  new Date(row.created_at as string).getTime(),
//     updatedAt:  new Date(row.updated_at as string).getTime(),
//     teamA:      row.team_a as string,
//     teamB:      row.team_b as string,
//     sets:       row.sets as Match['sets'],
//     winner:     row.winner as string,
//     location:   row.location as string,
//     date:       row.date as string,
//     isSynced:   true,
//     syncStatus: 'synced',
//     syncError:  undefined,
//   }
// }

// ─── readAll ──────────────────────────────────────────────────────────────────
export async function readAll(): Promise<Match[]> {
  throw new Error(
    '[supabaseAdapter] Not yet activated. ' +
    'Follow the setup checklist in this file then uncomment the implementation.',
  );

  // UNCOMMENT WHEN READY:
  // const { data, error } = await supabase
  //   .from('matches')
  //   .select('*')
  //   .order('created_at', { ascending: false })
  //
  // if (error) throw new Error(error.message)
  // return (data ?? []).map(fromRow)
}

// ─── upsertOne ────────────────────────────────────────────────────────────────
export async function upsertOne(_match: Match): Promise<Match> {
  throw new Error('[supabaseAdapter] Not yet activated.');

  // UNCOMMENT WHEN READY:
  // const { error } = await supabase
  //   .from('matches')
  //   .upsert(toRow(match), { onConflict: 'id' })
  //
  // if (error) throw new Error(error.message)
  // return { ...match, isSynced: true, syncStatus: 'synced', syncError: undefined }
}

// ─── deleteOne ────────────────────────────────────────────────────────────────
export async function deleteOne(_id: string): Promise<void> {
  throw new Error('[supabaseAdapter] Not yet activated.');

  // UNCOMMENT WHEN READY:
  // const { error } = await supabase.from('matches').delete().eq('id', id)
  // if (error) throw new Error(error.message)
}

// ─── clearAll ─────────────────────────────────────────────────────────────────
export async function clearAll(): Promise<void> {
  throw new Error('[supabaseAdapter] Not yet activated.');

  // UNCOMMENT WHEN READY — deletes only the current user's rows (RLS handles this):
  // const { error } = await supabase.from('matches').delete().neq('id', '')
  // if (error) throw new Error(error.message)
}
