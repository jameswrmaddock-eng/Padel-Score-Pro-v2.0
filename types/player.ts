// types/player.ts
export type MatchResult = 'W' | 'L' | 'D';

export interface FormEntry {
  matchId: string;
  date: string;
  result: MatchResult;
  opponent: string;
  sets: string;
  location?: string;
}

export interface SurfaceStat {
  surface: string;
  wins: number;
  played: number;
}

export interface PlayerStats {
  displayName: string;
  handle: string;
  initials: string;
  level: string;
  club: string;
  avatarUrl?: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  setsWon: number;
  winRate: number;
  avgSetsPerMatch: number;
  threeSetsWins: number;
  currentStreak: string;
  bestStreak: number;
  recentForm: FormEntry[];
  surfaceStats: SurfaceStat[];
  lastUpdated: number;
}

export interface UseUserStatsReturn {
  stats: PlayerStats | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refresh: () => void;
}
