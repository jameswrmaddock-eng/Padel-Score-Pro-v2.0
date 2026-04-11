// lib/scoringEngine.ts
// ─────────────────────────────────────────────────────────────────────────────
// Complete padel scoring engine. Mirrors the rules implemented in the
// iPhone app (scoring.js / scoring.cjs). All logic is pure — no side effects.
// ─────────────────────────────────────────────────────────────────────────────

export type DeuceMode   = 'longDeuce' | 'silverPoint' | 'goldenPoint';
export type TiebreakMode = 'tiebreak' | 'playOn';
export type MatchFormat  = 1 | 3;   // 1 set or best-of-3
export type Side         = 'A' | 'B';

export interface MatchConfig {
  teamA:       string;
  teamB:       string;
  format:      MatchFormat;
  deuceMode:   DeuceMode;
  tiebreak:    TiebreakMode;
  playOnCap?:  number | null;  // 8, 9, 10 or null
  firstServe:  Side | 'random';
}

export interface SetScore {
  a: number;
  b: number;
}

export interface MatchState {
  config:       MatchConfig;

  // Points within current game (tennis scoring)
  pointsA:      number;   // 0,1,2,3 = 0,15,30,40
  pointsB:      number;

  // Games within current set
  gamesA:       number;
  gamesB:       number;

  // Completed sets
  sets:         SetScore[];

  // Tiebreak mode
  inTiebreak:   boolean;
  tbPointsA:    number;
  tbPointsB:    number;

  // Deuce
  deuce:        boolean;
  deuceAdvantage: Side | null;  // who has advantage (longDeuce only)

  // Serve
  server:       Side;
  tbServeCount: number;   // tracks tiebreak serve rotation

  // Match over
  winner:       Side | null;
  matchLog:     string[];
}

const POINT_LABELS = ['0', '15', '30', '40'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function randomSide(): Side { return Math.random() < 0.5 ? 'A' : 'B'; }

function otherSide(s: Side): Side { return s === 'A' ? 'B' : 'A'; }

function setsWon(state: MatchState, side: Side): number {
  return state.sets.filter((s) => (side === 'A' ? s.a > s.b : s.b > s.a)).length;
}

function formatSetScore(sets: SetScore[]): string {
  return sets.map((s) => `${s.a}-${s.b}`).join(', ');
}

// ── Initialise ────────────────────────────────────────────────────────────────

export function initMatch(config: MatchConfig): MatchState {
  const server: Side =
    config.firstServe === 'random' ? randomSide() : config.firstServe;

  return {
    config,
    pointsA: 0,
    pointsB: 0,
    gamesA: 0,
    gamesB: 0,
    sets: [],
    inTiebreak: false,
    tbPointsA: 0,
    tbPointsB: 0,
    deuce: false,
    deuceAdvantage: null,
    server,
    tbServeCount: 0,
    winner: null,
    matchLog: [`${server === 'A' ? config.teamA : config.teamB} serves first`],
  };
}

// ── Score a point ──────────────────────────────────────────────────────────────

export function scorePoint(state: MatchState, scorer: Side): MatchState {
  if (state.winner) return state;

  const s = { ...state, matchLog: [...state.matchLog] };

  if (s.inTiebreak) {
    return scoreTiebreakPoint(s, scorer);
  }
  return scoreGamePoint(s, scorer);
}

// ── Game point ────────────────────────────────────────────────────────────────

function scoreGamePoint(s: MatchState, scorer: Side): MatchState {
  const other = otherSide(scorer);
  const myPts  = scorer === 'A' ? s.pointsA : s.pointsB;
  const oppPts = scorer === 'A' ? s.pointsB : s.pointsA;

  // ── Deuce situation ────────────────────────────────────────────────────────
  if (s.deuce) {
    if (s.config.deuceMode === 'goldenPoint') {
      // One decisive point wins the game
      return winGame(s, scorer);
    }
    if (s.config.deuceMode === 'silverPoint') {
      // Receiver chooses side — for web demo receiver just wins the game
      return winGame(s, scorer);
    }
    // longDeuce
    if (s.deuceAdvantage === scorer) {
      return winGame(s, scorer);
    } else if (s.deuceAdvantage === other) {
      // back to deuce
      return {
        ...s,
        deuceAdvantage: null,
        matchLog: [...s.matchLog, 'Deuce'],
      };
    } else {
      // no advantage yet — scorer gets advantage
      return {
        ...s,
        deuceAdvantage: scorer,
        matchLog: [...s.matchLog, `Advantage ${scorer === 'A' ? s.config.teamA : s.config.teamB}`],
      };
    }
  }

  // ── Normal point ──────────────────────────────────────────────────────────
  if (myPts === 3) {
    // was at 40
    if (oppPts === 3) {
      // both at 40 — deuce
      if (s.config.deuceMode === 'goldenPoint' || s.config.deuceMode === 'silverPoint') {
        // one decisive point
        return { ...s, deuce: true, deuceAdvantage: null };
      }
      return { ...s, deuce: true, deuceAdvantage: null, matchLog: [...s.matchLog, 'Deuce'] };
    }
    return winGame(s, scorer);
  }

  // Increment points
  const newA = scorer === 'A' ? s.pointsA + 1 : s.pointsA;
  const newB = scorer === 'B' ? s.pointsB + 1 : s.pointsB;
  return { ...s, pointsA: newA, pointsB: newB };
}

// ── Win a game ────────────────────────────────────────────────────────────────

function winGame(s: MatchState, winner: Side): MatchState {
  const newGamesA = winner === 'A' ? s.gamesA + 1 : s.gamesA;
  const newGamesB = winner === 'B' ? s.gamesB + 1 : s.gamesB;
  const teamName  = winner === 'A' ? s.config.teamA : s.config.teamB;

  let ns: MatchState = {
    ...s,
    pointsA: 0, pointsB: 0,
    gamesA: newGamesA, gamesB: newGamesB,
    deuce: false, deuceAdvantage: null,
    server: otherSide(s.server),
    matchLog: [...s.matchLog, `Game ${teamName} (${newGamesA}-${newGamesB})`],
  };

  return checkSetEnd(ns);
}

// ── Check if set has ended ────────────────────────────────────────────────────

function checkSetEnd(s: MatchState): MatchState {
  const { gamesA, gamesB, config } = s;
  const diff = Math.abs(gamesA - gamesB);

  const winnerSide: Side | null =
    (gamesA >= 6 && diff >= 2)   ? 'A' :
    (gamesB >= 6 && diff >= 2)   ? 'B' :
    (gamesA === 7 && gamesB === 6) ? 'A' :
    (gamesB === 7 && gamesA === 6) ? 'B' : null;

  // Check for tiebreak at 6-6
  if (gamesA === 6 && gamesB === 6) {
    if (config.tiebreak === 'tiebreak') {
      return {
        ...s, inTiebreak: true, tbPointsA: 0, tbPointsB: 0, tbServeCount: 0,
        matchLog: [...s.matchLog, 'Tiebreak!'],
      };
    }
    // Play on — check cap
    if (config.playOnCap) {
      const cap = config.playOnCap;
      if (gamesA === cap && gamesB === cap) {
        return { ...s, inTiebreak: true, tbPointsA: 0, tbPointsB: 0, tbServeCount: 0, matchLog: [...s.matchLog, `${cap}-${cap} — tiebreak!`] };
      }
    }
    return s; // keep playing
  }

  if (!winnerSide) return s;

  return winSet(s, winnerSide);
}

// ── Win a set ────────────────────────────────────────────────────────────────

function winSet(s: MatchState, winner: Side): MatchState {
  const newSet: SetScore = { a: s.gamesA, b: s.gamesB };
  const sets = [...s.sets, newSet];
  const teamName = winner === 'A' ? s.config.teamA : s.config.teamB;

  const winsA = sets.filter((st) => st.a > st.b).length;
  const winsB = sets.filter((st) => st.b > st.a).length;

  const setsNeeded = s.config.format === 1 ? 1 : 2;
  const matchWon = winsA >= setsNeeded || winsB >= setsNeeded;

  const ns: MatchState = {
    ...s,
    sets,
    gamesA: 0, gamesB: 0,
    pointsA: 0, pointsB: 0,
    inTiebreak: false, tbPointsA: 0, tbPointsB: 0,
    deuce: false, deuceAdvantage: null,
    matchLog: [...s.matchLog, `Set ${sets.length} to ${teamName} (${newSet.a}-${newSet.b})`],
  };

  if (matchWon) {
    return {
      ...ns,
      winner: winsA > winsB ? 'A' : 'B',
      matchLog: [...ns.matchLog, `Match won by ${teamName}! ${formatSetScore(sets)}`],
    };
  }

  return ns;
}

// ── Tiebreak point ────────────────────────────────────────────────────────────

function scoreTiebreakPoint(s: MatchState, scorer: Side): MatchState {
  const newA = scorer === 'A' ? s.tbPointsA + 1 : s.tbPointsA;
  const newB = scorer === 'B' ? s.tbPointsB + 1 : s.tbPointsB;

  // Serve rotation: 1, then every 2
  const newCount = s.tbServeCount + 1;
  let server = s.server;
  if (newCount === 1) { server = otherSide(s.server); }
  else if (newCount > 1 && (newCount - 1) % 2 === 0) { server = otherSide(server); }

  const ns = { ...s, tbPointsA: newA, tbPointsB: newB, tbServeCount: newCount, server };

  // Win tiebreak: first to 7 with 2-point lead (or match-point in play-on cap scenario)
  const diff = Math.abs(newA - newB);
  const leader: Side | null = newA > newB ? 'A' : newB > newA ? 'B' : null;

  if (leader && ((newA >= 7 || newB >= 7) && diff >= 2)) {
    return winSet({ ...ns, inTiebreak: false }, leader);
  }

  return ns;
}

// ── Undo last point ───────────────────────────────────────────────────────────
// We store a history stack outside this engine — see useScorer hook.

// ── Display helpers ───────────────────────────────────────────────────────────

export function getPointLabel(pts: number, isDeuce: boolean, advantage: Side | null, side: Side): string {
  if (isDeuce) {
    if (advantage === side) return 'ADV';
    if (advantage === null) return '40';
    return '40';
  }
  return POINT_LABELS[pts] ?? '0';
}

export function getServingTeamName(state: MatchState): string {
  return state.server === 'A' ? state.config.teamA : state.config.teamB;
}
