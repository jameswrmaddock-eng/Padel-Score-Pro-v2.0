'use client';
import { useState, useEffect, useCallback } from 'react';
import { PlayerStats, UseUserStatsReturn } from '@/types/player';
import { LOCAL_PLAYER_STATS } from '@/data/playerData';

// Day 2 — Supabase migration: uncomment block below, remove local block.
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// )
// async function fetchStatsFromSupabase(userId: string): Promise<PlayerStats> {
//   const { data, error } = await supabase
//     .from('player_stats').select('*').eq('user_id', userId).single()
//   if (error) throw new Error(error.message)
//   return {
//     displayName:     data.display_name,
//     handle:          data.handle,
//     initials:        data.initials,
//     level:           data.level,
//     club:            data.club,
//     avatarUrl:       data.avatar_url ?? undefined,
//     matchesPlayed:   data.matches_played,
//     wins:            data.wins,
//     losses:          data.losses,
//     draws:           data.draws,
//     setsWon:         data.sets_won,
//     winRate:         Math.round(data.wins / Math.max(data.matches_played,1) * 100),
//     avgSetsPerMatch: Number((data.sets_won / Math.max(data.matches_played,1)).toFixed(1)),
//     threeSetsWins:   data.three_sets_wins,
//     currentStreak:   data.current_streak,
//     bestStreak:      data.best_streak,
//     recentForm:      data.recent_form,
//     surfaceStats:    data.surface_stats,
//     lastUpdated:     new Date(data.updated_at).getTime(),
//   }
// }

export function useUserStats(userId?: string): UseUserStatsReturn {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    try {
      // Day 1: simulate async latency with local data
      await new Promise((res) => setTimeout(res, 600));
      setStats(LOCAL_PLAYER_STATS);
      // Day 2: replace the two lines above with:
      // if (!userId) throw new Error('No userId provided')
      // const data = await fetchStatsFromSupabase(userId)
      // setStats(data)
    } catch (err) {
      setIsError(true);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, isLoading, isError, errorMessage, refresh: fetchStats };
}
