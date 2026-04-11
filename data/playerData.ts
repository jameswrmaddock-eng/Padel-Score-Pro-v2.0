// data/playerData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Static seed data for Day 1. Replace the import in useUserStats.ts with
// a live Supabase query when you're ready to go cloud.
// ─────────────────────────────────────────────────────────────────────────────

import { PlayerStats } from '@/types/player';

export const LOCAL_PLAYER_STATS: PlayerStats = {
  displayName:      'James Maddock',
  handle:           '@jmadd',
  initials:         'JM',
  level:            'Club Player · Lvl 4',
  club:             'Club Padel Norte',
  avatarUrl:        undefined,

  matchesPlayed:    24,
  wins:             17,
  losses:           7,
  draws:            0,
  setsWon:          41,
  winRate:          71,
  avgSetsPerMatch:  2.4,
  threeSetsWins:    5,

  currentStreak:    'W3',
  bestStreak:       6,

  recentForm: [
    { matchId: '1', date: 'Today',  result: 'W', opponent: 'Raqueteros FC', sets: '6-3 / 5-4*', location: 'Club Padel Norte' },
    { matchId: '2', date: 'Apr 12', result: 'W', opponent: 'Court Kings',   sets: '6-3 / 6-4',      location: 'Club Padel Norte' },
    { matchId: '3', date: 'Apr 11', result: 'W', opponent: 'Volantes',      sets: '7-5 / 6-4',      location: 'Club Padel Norte' },
    { matchId: '4', date: 'Apr 10', result: 'W', opponent: 'Smash Bros',    sets: '6-4 / 3-6 / 7-5',location: 'Pista Central'    },
    { matchId: '5', date: 'Apr 8',  result: 'L', opponent: 'Net Ninjas',    sets: '7-6 / 4-6',      location: 'Club Del Sol'     },
    { matchId: '6', date: 'Apr 5',  result: 'W', opponent: 'Court Kings',   sets: '6-1 / 6-3',      location: 'Club Padel Norte' },
    { matchId: '7', date: 'Apr 2',  result: 'L', opponent: 'Ace Bros',      sets: '4-6 / 6-3 / 3-6',location: 'Pista Central'    },
    { matchId: '8', date: 'Mar 27', result: 'W', opponent: 'Dream Smash',   sets: '6-3 / 6-2',      location: 'Club Del Sol'     },
  ],

  surfaceStats: [
    { surface: 'Hard court',  wins: 9, played: 12 },
    { surface: 'Clay',        wins: 5, played:  7 },
    { surface: 'Artificial',  wins: 2, played:  3 },
    { surface: 'Indoor',      wins: 1, played:  2 },
  ],

  lastUpdated: Date.now(),
};
