// lib/scoringEngine.ts
// ─────────────────────────────────────────────────────────────────────────────
// Complete padel scoring engine. All logic is pure — no side effects.
// Fix: 40-40 deuce now correctly returns immediately without incrementing.
// ─────────────────────────────────────────────────────────────────────────────

export type DeuceMode    = 'longDeuce' | 'silverPoint' | 'goldenPoint';
export type TiebreakMode = 'tiebreak' | 'playOn';
export type MatchFormat  = 1 | 3;
export type Side         = 'A' | 'B';

export interface MatchConfig {
  teamA:       string;
  teamB:       string;
  format:      MatchFormat;
  deuceMode:   DeuceMode;
  tiebreak:    TiebreakMode;
  playOnCap?:  number | null;
  firstServe:  Side | 'random';
}

export interface SetScore { a: number; b: number; }

export interface MatchState {
  config:          MatchConfig;
  pointsA:         number;   // 0–3 = 0,15,30,40
  pointsB:         number;
  gamesA:          number;
  gamesB:          number;
  sets:            SetScore[];
  inTiebreak:      boolean;
  tbPointsA:       number;
  tbPointsB:       number;
  deuce:           boolean;
  deuceAdvantage:  Side | null;
  server:          Side;
  tbServeCount:    number;
  winner:          Side | null;
  matchLog:        string[];
}

const POINT_LABELS = ['0', '15', '30', '40'];

function randomSide(): Side { return Math.random() < 0.5 ? 'A' : 'B'; }
function otherSide(s: Side): Side { return s === 'A' ? 'B' : 'A'; }

function formatSetScore(sets: SetScore[]): string {
  return sets.map((s) => `${s.a}-${s.b}`).join(', ');
}

// ── Init ──────────────────────────────────────────────────────────────────────
export function initMatch(config: MatchConfig): MatchState {
  const server: Side =
    config.firstServe === 'random' ? randomSide() : config.firstServe;
  return {
    config,
    pointsA: 0, pointsB: 0,
    gamesA: 0, gamesB: 0,
    sets: [],
    inTiebreak: false, tbPointsA: 0, tbPointsB: 0,
    deuce: false, deuceAdvantage: null,
    server,
    tbServeCount: 0,
    winner: null,
    matchLog: [`${server === 'A' ? config.teamA : config.teamB} serves first`],
  };
}

// ── Score a point ─────────────────────────────────────────────────────────────
export function scorePoint(state: MatchState, scorer: Side): MatchState {
  if (state.winner) return state;
  const s = { ...state, matchLog: [...state.matchLog] };
  return s.inTiebreak ? scoreTiebreakPoint(s, scorer) : scoreGamePoint(s, scorer);
}

// ── Game point ────────────────────────────────────────────────────────────────
function scoreGamePoint(s: MatchState, scorer: Side): MatchState {
  const other = otherSide(scorer);

  // ── Already in deuce ──────────────────────────────────────────────────────
  if (s.deuce) {
    if (s.config.deuceMode === 'goldenPoint' || s.config.deuceMode === 'silverPoint') {
      return winGame(s, scorer);
    }
    // longDeuce
    if (s.deuceAdvantage === scorer) {
      return winGame(s, scorer);
    }
    if (s.deuceAdvantage === other) {
      // Back to deuce
      return { ...s, deuceAdvantage: null, matchLog: [...s.matchLog, 'Deuce'] };
    }
    // No advantage yet — give it to scorer
    return {
      ...s,
      deuceAdvantage: scorer,
      matchLog: [...s.matchLog, `Advantage ${scorer === 'A' ? s.config.teamA : s.config.teamB}`],
    };
  }

  const myPts  = scorer === 'A' ? s.pointsA : s.pointsB;
  const oppPts = scorer === 'A' ? s.pointsB : s.pointsA;

  // ── Scorer was at 40, opponent also at 40 → DEUCE ─────────────────────────
  // BUG FIX: this must return immediately before the normal increment below
  if (myPts === 3 && oppPts === 3) {
    if (s.config.deuceMode === 'goldenPoint' || s.config.deuceMode === 'silverPoint') {
      return { ...s, deuce: true, deuceAdvantage: null };
    }
    return { ...s, deuce: true, deuceAdvantage: null, matchLog: [...s.matchLog, 'Deuce'] };
  }

  // ── Scorer was at 40, opponent below 40 → win game ────────────────────────
  if (myPts === 3) {
    return winGame(s, scorer);
  }

  // ── Normal point increment ────────────────────────────────────────────────
  return {
    ...s,
    pointsA: scorer === 'A' ? s.pointsA + 1 : s.pointsA,
    pointsB: scorer === 'B' ? s.pointsB + 1 : s.pointsB,
  };
}

// ── Win a game ────────────────────────────────────────────────────────────────
function winGame(s: MatchState, winner: Side): MatchState {
  const newGamesA = winner === 'A' ? s.gamesA + 1 : s.gamesA;
  const newGamesB = winner === 'B' ? s.gamesB + 1 : s.gamesB;
  const teamName  = winner === 'A' ? s.config.teamA : s.config.teamB;

  const ns: MatchState = {
    ...s,
    pointsA: 0, pointsB: 0,
    gamesA: newGamesA, gamesB: newGamesB,
    deuce: false, deuceAdvantage: null,
    server: otherSide(s.server),
    matchLog: [...s.matchLog, `Game ${teamName} (${newGamesA}-${newGamesB})`],
  };
  return checkSetEnd(ns);
}

// ── Check set end ─────────────────────────────────────────────────────────────
function checkSetEnd(s: MatchState): MatchState {
  const { gamesA, gamesB, config } = s;
  const diff = Math.abs(gamesA - gamesB);

  // Tiebreak at 6-6
  if (gamesA === 6 && gamesB === 6) {
    if (config.tiebreak === 'tiebreak') {
      return {
        ...s, inTiebreak: true, tbPointsA: 0, tbPointsB: 0, tbServeCount: 0,
        matchLog: [...s.matchLog, 'Tiebreak!'],
      };
    }
    // Play On — cap check
    if (config.playOnCap) {
      if (gamesA >= config.playOnCap && gamesB >= config.playOnCap) {
        return {
          ...s, inTiebreak: true, tbPointsA: 0, tbPointsB: 0, tbServeCount: 0,
          matchLog: [...s.matchLog, `${config.playOnCap}-${config.playOnCap} tiebreak!`],
        };
      }
    }
    return s;
  }

  const winnerSide: Side | null =
    (gamesA >= 6 && diff >= 2) ? 'A' :
    (gamesB >= 6 && diff >= 2) ? 'B' :
    (gamesA === 7 && gamesB === 6) ? 'A' :
    (gamesB === 7 && gamesA === 6) ? 'B' : null;

  return winnerSide ? winSet(s, winnerSide) : s;
}

// ── Win a set ─────────────────────────────────────────────────────────────────
function winSet(s: MatchState, winner: Side): MatchState {
  const newSet: SetScore = { a: s.gamesA, b: s.gamesB };
  const sets = [...s.sets, newSet];
  const teamName = winner === 'A' ? s.config.teamA : s.config.teamB;

  const winsA = sets.filter((st) => st.a > st.b).length;
  const winsB = sets.filter((st) => st.b > st.a).length;
  const setsNeeded = s.config.format === 1 ? 1 : 2;
  const matchWon   = winsA >= setsNeeded || winsB >= setsNeeded;

  const ns: MatchState = {
    ...s,
    sets,
    gamesA: 0, gamesB: 0,
    pointsA: 0, pointsB: 0,
    inTiebreak: false, tbPointsA: 0, tbPointsB: 0,
    deuce: false, deuceAdvantage: null,
    matchLog: [...s.matchLog, `Set ${sets.length} → ${teamName} (${newSet.a}-${newSet.b})`],
  };

  if (matchWon) {
    return {
      ...ns,
      winner: winsA > winsB ? 'A' : 'B',
      matchLog: [...ns.matchLog, `Match → ${teamName}! ${formatSetScore(sets)}`],
    };
  }
  return ns;
}

// ── Tiebreak point ────────────────────────────────────────────────────────────
function scoreTiebreakPoint(s: MatchState, scorer: Side): MatchState {
  const newA = scorer === 'A' ? s.tbPointsA + 1 : s.tbPointsA;
  const newB = scorer === 'B' ? s.tbPointsB + 1 : s.tbPointsB;

  // Serve rotation: 1 then every 2
  const newCount = s.tbServeCount + 1;
  let server = s.server;
  if (newCount === 1) { server = otherSide(s.server); }
  else if (newCount > 1 && (newCount - 1) % 2 === 0) { server = otherSide(server); }

  const ns = { ...s, tbPointsA: newA, tbPointsB: newB, tbServeCount: newCount, server };

  const diff   = Math.abs(newA - newB);
  const leader: Side | null = newA > newB ? 'A' : newB > newA ? 'B' : null;

  if (leader && (newA >= 7 || newB >= 7) && diff >= 2) {
    return winSet({ ...ns, inTiebreak: false }, leader);
  }
  return ns;
}

// ── Display helpers ───────────────────────────────────────────────────────────
export function getPointLabel(
  pts: number,
  isDeuce: boolean,
  advantage: Side | null,
  side: Side,
): string {
  if (isDeuce) {
    if (advantage === side)             return 'ADV';
    if (advantage === otherSide(side))  return '40';
    return '40';
  }
  return ['0', '15', '30', '40'][pts] ?? '0';
}

export function getServingTeamName(state: MatchState): string {
  return state.server === 'A' ? state.config.teamA : state.config.teamB;
}
