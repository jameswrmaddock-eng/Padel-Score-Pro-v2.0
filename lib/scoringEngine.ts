// lib/scoringEngine.ts
// ─────────────────────────────────────────────────────────────────────────────
// KEY FIX: The deuce condition is triggered when the SCORING player's points
// will reach 40 (i.e. myPts is 2 OR 3) AND the opponent is already at 40
// (oppPts === 3). This covers both:
//   • 30-all → scorer hits 40 while opp already at 40  (myPts=2, oppPts=3)
//   • 40-all edge case                                   (myPts=3, oppPts=3)
// The state is updated to reflect both players at 40, deuce:true, then
// the function returns immediately — no fall-through to winGame or increment.
// ─────────────────────────────────────────────────────────────────────────────

export type DeuceMode    = 'longDeuce' | 'silverPoint' | 'goldenPoint';
export type TiebreakMode = 'tiebreak' | 'playOn';
export type MatchFormat  = 1 | 3;
export type Side         = 'A' | 'B';

export interface MatchConfig {
  teamA:      string;
  teamB:      string;
  format:     MatchFormat;
  deuceMode:  DeuceMode;
  tiebreak:   TiebreakMode;
  playOnCap?: number | null;
  firstServe: Side | 'random';
}

export interface SetScore { a: number; b: number; }

export interface MatchState {
  config:         MatchConfig;
  pointsA:        number;
  pointsB:        number;
  gamesA:         number;
  gamesB:         number;
  sets:           SetScore[];
  inTiebreak:     boolean;
  tbPointsA:      number;
  tbPointsB:      number;
  deuce:          boolean;
  deuceAdvantage: Side | null;
  server:         Side;
  tbServeCount:   number;
  winner:         Side | null;
  matchLog:       string[];
}

function randomSide(): Side { return Math.random() < 0.5 ? 'A' : 'B'; }
function otherSide(s: Side): Side { return s === 'A' ? 'B' : 'A'; }
function fmt(sets: SetScore[]): string { return sets.map(s => `${s.a}-${s.b}`).join(', '); }

export function initMatch(config: MatchConfig): MatchState {
  const server: Side =
    config.firstServe === 'random' ? randomSide() : config.firstServe;
  return {
    config,
    pointsA: 0, pointsB: 0,
    gamesA: 0,  gamesB: 0,
    sets: [],
    inTiebreak: false, tbPointsA: 0, tbPointsB: 0,
    deuce: false, deuceAdvantage: null,
    server,
    tbServeCount: 0,
    winner: null,
    matchLog: [`${server === 'A' ? config.teamA : config.teamB} serves first`],
  };
}

export function scorePoint(state: MatchState, scorer: Side): MatchState {
  if (state.winner) return state;
  const s = { ...state, matchLog: [...state.matchLog] };
  return s.inTiebreak ? scoreTiebreakPoint(s, scorer) : scoreGamePoint(s, scorer);
}

function scoreGamePoint(s: MatchState, scorer: Side): MatchState {
  const other  = otherSide(scorer);
  const myPts  = scorer === 'A' ? s.pointsA : s.pointsB;
  const oppPts = scorer === 'A' ? s.pointsB : s.pointsA;

  // ── Step 1: already in a deuce state ──────────────────────────────────────
  if (s.deuce) {
    if (s.config.deuceMode === 'goldenPoint' || s.config.deuceMode === 'silverPoint') {
      return winGame(s, scorer);
    }
    // longDeuce
    if (s.deuceAdvantage === scorer) return winGame(s, scorer);
    if (s.deuceAdvantage === other)  return { ...s, deuceAdvantage: null, matchLog: [...s.matchLog, 'Deuce'] };
    return {
      ...s,
      deuceAdvantage: scorer,
      matchLog: [...s.matchLog, `Advantage ${scorer === 'A' ? s.config.teamA : s.config.teamB}`],
    };
  }

  // ── Step 2: will the scorer reach 40 while the opponent is at 40? ─────────
  // myPts === 2 means this click takes them to 40 (index 3)
  // myPts === 3 means they're already at 40 (shouldn't normally reach here but belt+braces)
  const scorerReaches40 = myPts === 2 || myPts === 3;

  if (scorerReaches40 && oppPts === 3) {
    // Both at 40 — enter deuce. Update pointsA/B so display shows 40-40.
    const newPointsA = scorer === 'A' ? 3 : s.pointsA;
    const newPointsB = scorer === 'B' ? 3 : s.pointsB;

    if (s.config.deuceMode === 'goldenPoint') {
      return {
        ...s,
        pointsA: newPointsA, pointsB: newPointsB,
        deuce: true, deuceAdvantage: null,
        matchLog: [...s.matchLog, 'Golden Point!'],
      };
    }
    if (s.config.deuceMode === 'silverPoint') {
      return {
        ...s,
        pointsA: newPointsA, pointsB: newPointsB,
        deuce: true, deuceAdvantage: null,
        matchLog: [...s.matchLog, 'Silver Point!'],
      };
    }
    // longDeuce
    return {
      ...s,
      pointsA: newPointsA, pointsB: newPointsB,
      deuce: true, deuceAdvantage: null,
      matchLog: [...s.matchLog, 'Deuce'],
    };
  }

  // ── Step 3: scorer at 40, opponent below 40 → win game ────────────────────
  if (myPts === 3) {
    return winGame(s, scorer);
  }

  // ── Step 4: normal increment ──────────────────────────────────────────────
  return {
    ...s,
    pointsA: scorer === 'A' ? s.pointsA + 1 : s.pointsA,
    pointsB: scorer === 'B' ? s.pointsB + 1 : s.pointsB,
  };
}

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

function checkSetEnd(s: MatchState): MatchState {
  const { gamesA, gamesB, config } = s;
  const diff = Math.abs(gamesA - gamesB);

  if (gamesA === 6 && gamesB === 6) {
    if (config.tiebreak === 'tiebreak') {
      return {
        ...s, inTiebreak: true, tbPointsA: 0, tbPointsB: 0, tbServeCount: 0,
        matchLog: [...s.matchLog, 'Tiebreak!'],
      };
    }
    if (config.playOnCap && gamesA >= config.playOnCap && gamesB >= config.playOnCap) {
      return {
        ...s, inTiebreak: true, tbPointsA: 0, tbPointsB: 0, tbServeCount: 0,
        matchLog: [...s.matchLog, `${config.playOnCap}-${config.playOnCap} tiebreak!`],
      };
    }
    return s;
  }

  const w: Side | null =
    gamesA >= 6 && diff >= 2  ? 'A' :
    gamesB >= 6 && diff >= 2  ? 'B' :
    gamesA === 7 && gamesB === 6 ? 'A' :
    gamesB === 7 && gamesA === 6 ? 'B' : null;

  return w ? winSet(s, w) : s;
}

function winSet(s: MatchState, winner: Side): MatchState {
  const newSet: SetScore = { a: s.gamesA, b: s.gamesB };
  const sets     = [...s.sets, newSet];
  const teamName = winner === 'A' ? s.config.teamA : s.config.teamB;
  const winsA    = sets.filter(st => st.a > st.b).length;
  const winsB    = sets.filter(st => st.b > st.a).length;
  const needed   = s.config.format === 1 ? 1 : 2;
  const done     = winsA >= needed || winsB >= needed;

  const ns: MatchState = {
    ...s, sets,
    gamesA: 0, gamesB: 0,
    pointsA: 0, pointsB: 0,
    inTiebreak: false, tbPointsA: 0, tbPointsB: 0,
    deuce: false, deuceAdvantage: null,
    matchLog: [...s.matchLog, `Set ${sets.length} → ${teamName} (${newSet.a}-${newSet.b})`],
  };

  if (done) {
    return {
      ...ns,
      winner: winsA > winsB ? 'A' : 'B',
      matchLog: [...ns.matchLog, `Match → ${teamName}! ${fmt(sets)}`],
    };
  }
  return ns;
}

function scoreTiebreakPoint(s: MatchState, scorer: Side): MatchState {
  const newA     = scorer === 'A' ? s.tbPointsA + 1 : s.tbPointsA;
  const newB     = scorer === 'B' ? s.tbPointsB + 1 : s.tbPointsB;
  const newCount = s.tbServeCount + 1;
  let server     = s.server;
  if (newCount === 1) {
    server = otherSide(s.server);
  } else if ((newCount - 1) % 2 === 0) {
    server = otherSide(server);
  }

  const ns = { ...s, tbPointsA: newA, tbPointsB: newB, tbServeCount: newCount, server };
  const diff   = Math.abs(newA - newB);
  const leader: Side | null = newA > newB ? 'A' : newB > newA ? 'B' : null;

  if (leader && (newA >= 7 || newB >= 7) && diff >= 2) {
    return winSet({ ...ns, inTiebreak: false }, leader);
  }
  return ns;
}

export function getPointLabel(
  pts: number,
  isDeuce: boolean,
  advantage: Side | null,
  side: Side,
): string {
  if (isDeuce) {
    if (advantage === side) return 'ADV';
    return '40';
  }
  return ['0', '15', '30', '40'][pts] ?? '0';
}

export function getServingTeamName(state: MatchState): string {
  return state.server === 'A' ? state.config.teamA : state.config.teamB;
}
