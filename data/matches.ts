// data/matches.ts
// ─────────────────────────────────────────────────────────────────────────────
// Local match data. Swap the adapter import in useMatches.ts to pull from
// Supabase or your useSyncData hook when you're ready to go live.
// ─────────────────────────────────────────────────────────────────────────────

export type MatchStatus = 'live' | 'final';

export interface SetScore {
  a: number;
  b: number;
}

export interface Match {
  id: number;
  status: MatchStatus;
  teamA: string;
  teamB: string;
  sets: SetScore[];
  format: '1 Set' | 'Best of 3';
  location: string;
  date: string;
  featured?: boolean;
}

export const MATCHES: Match[] = [
  {
    id: 1,
    status: 'live',
    teamA: 'Los Tigres',
    teamB: 'Raqueteros FC',
    sets: [{ a: 6, b: 3 }, { a: 5, b: 4 }],
    format: 'Best of 3',
    location: 'Club Padel Norte',
    date: 'Today · 15:30',
    featured: true,
  },
  {
    id: 2,
    status: 'final',
    teamA: 'Los Tigres',
    teamB: 'Smash Bros',
    sets: [{ a: 6, b: 4 }, { a: 3, b: 6 }, { a: 7, b: 5 }],
    format: 'Best of 3',
    location: 'Pista Central',
    date: '10 Apr',
  },
  {
    id: 3,
    status: 'final',
    teamA: 'Net Ninjas',
    teamB: 'Los Tigres',
    sets: [{ a: 6, b: 7 }, { a: 4, b: 6 }],
    format: 'Best of 3',
    location: 'Club Del Sol',
    date: '8 Apr',
  },
  {
    id: 4,
    status: 'final',
    teamA: 'Los Tigres',
    teamB: 'Court Kings',
    sets: [{ a: 6, b: 1 }, { a: 6, b: 3 }],
    format: '1 Set',
    location: 'Club Padel Norte',
    date: '5 Apr',
  },
  {
    id: 5,
    status: 'final',
    teamA: 'Ace Bros',
    teamB: 'Los Tigres',
    sets: [{ a: 6, b: 4 }, { a: 3, b: 6 }, { a: 6, b: 3 }],
    format: 'Best of 3',
    location: 'Pista Central',
    date: '2 Apr',
  },
  {
    id: 6,
    status: 'final',
    teamA: 'Los Tigres',
    teamB: 'Volantes',
    sets: [{ a: 7, b: 5 }, { a: 6, b: 4 }],
    format: 'Best of 3',
    location: 'Club Padel Norte',
    date: '30 Mar',
  },
  {
    id: 7,
    status: 'final',
    teamA: 'Dream Smash',
    teamB: 'Los Tigres',
    sets: [{ a: 6, b: 7 }, { a: 6, b: 4 }, { a: 5, b: 7 }],
    format: 'Best of 3',
    location: 'Club Del Sol',
    date: '27 Mar',
  },
];
