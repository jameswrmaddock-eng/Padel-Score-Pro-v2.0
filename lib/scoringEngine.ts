// lib/scoringEngine.ts
// ─────────────────────────────────────────────────────────────────────────────
// Deuce modes:
//   longDeuce   — advantage, then must win two clear. Repeats indefinitely.
//   silverPoint — first deuce plays out with advantage (ADV / back to 40-40).
//                 If it returns to 40-40, the NEXT point wins outright (silver).
//   goldenPoint — 40-40 is reached, next single point wins immediately.
//   starPoint   — deuces 1 and 2 play out with normal advantage.
//                 On the THIRD deuce, Star Point activates: server nominates
//                 receiver, next single point wins the game outright.
//
// silverPointActive: boolean — true = silver point stage (next point wins).
// deuceCount: number        — increments on each new 40-40; resets on new game.
//                             Star Point activates when deuceCount reaches 3.
// ─────────────────────────────────────────────────────────────────────────────

export type DeuceMode    = 'longDeuce' | 'silverPoint' | 'goldenPoint' | 'starPoint';
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
  config:              MatchConfig;
  pointsA:             number;
  pointsB:             number;
  gamesA:              number;
  gamesB:              number;
  sets:                SetScore[];
  inTiebreak:          boolean;
  tbPointsA:           number;
  tbPointsB:           number;
  deuce:               boolean;
  deuceAdvantage:      Side | null;
  silverPointActive:   boolean;   // true = next point wins (silver point stage)
  deuceCount:          number;    // counts 40-40 occurrences; resets on new game
  server:              Side;
  tbServeCount:        number;
  winner:              Side | null;
  matchLog:            string[];
}

function randomSide(): Side { return Math.random() < 0.5 ? 'A' : 'B'; }
function otherSide(s: Side): Side { return s === 'A' ? 'B' : 'A'; }
function fmt(sets: SetScore[]): string { return sets.map(s => `${s.a}-${s.b}`).join(', '); }

// ── Init ──────────────────────────────────────────────────────────────────────
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
    silverPointActive: false,
    deuceCount: 0,
    server,
    tbServeCount: 0,
    winner: null,
    matchLog: [`${server === 'A' ? config.teamA : config.teamB} serves first`],
  };
}

// ── Public entry ──────────────────────────────────────────────────────────────
export function scorePoint(state: MatchState, scorer: Side): MatchState {
  if (state.winner) return state;
  const s = { ...state, matchLog: [...state.matchLog] };
  return s.inTiebreak ? scoreTiebreakPoint(s, scorer) : scoreGamePoint(s, scorer);
}

// ── Game point ────────────────────────────────────────────────────────────────
function scoreGamePoint(s: MatchState, scorer: Side): MatchState {
  const other  = otherSide(scorer);
  const myPts  = scorer === 'A' ? s.pointsA : s.pointsB;
  const oppPts = scorer === 'A' ? s.pointsB : s.pointsA;

  // ── Step 1: already in a deuce state ──────────────────────────────────────
  if (s.deuce) {
    switch (s.config.deuceMode) {

      case 'goldenPoint':
        // Always one point wins
        return winGame(s, scorer);

      case 'silverPoint':
        if (s.silverPointActive) {
          // Silver point stage — next point wins outright
          return winGame(s, scorer);
        }
        // Advantage stage (first deuce)
        if (s.deuceAdvantage === scorer) {
          // Had advantage → win game
          return winGame(s, scorer);
        }
        if (s.deuceAdvantage === other) {
          // Opponent had advantage → back to 40-40, NOW activate silver point
          return {
            ...s,
            deuceAdvantage: null,
            silverPointActive: true,
            matchLog: [...s.matchLog, '40-40 — Silver Point!'],
          };
        }
        // No advantage yet → give advantage
        return {
          ...s,
          deuceAdvantage: scorer,
          matchLog: [
            ...s.matchLog,
            `Advantage ${scorer === 'A' ? s.config.teamA : s.config.teamB}`,
          ],
        };

      case 'starPoint':
        // Star Point activates on the THIRD deuce (deuceCount === 3).
        // Deuces 1 and 2 behave identically to longDeuce (normal advantage).
        if (s.deuceCount >= 3) {
          // Sudden death — next point wins outright
          return winGame(s, scorer);
        }
        // Normal advantage play (deuces 1 and 2)
        if (s.deuceAdvantage === scorer) {
          // Had advantage → win game
          return winGame(s, scorer);
        }
        if (s.deuceAdvantage === other) {
          // Opponent had advantage → back to 40-40, increment deuceCount
          const newDeuceCount = s.deuceCount + 1;
          const isStarPoint   = newDeuceCount >= 3;
          return {
            ...s,
            deuceAdvantage: null,
            deuceCount: newDeuceCount,
            matchLog: [
              ...s.matchLog,
              isStarPoint ? '40-40 — Star Point!' : 'Deuce',
            ],
          };
        }
        // No advantage yet → give advantage
        return {
          ...s,
          deuceAdvantage: scorer,
          matchLog: [
            ...s.matchLog,
            `Advantage ${scorer === 'A' ? s.config.teamA : s.config.teamB}`,
          ],
        };

      case 'longDeuce':
      default:
        if (s.deuceAdvantage === scorer) return winGame(s, scorer);
        if (s.deuceAdvantage === other) {
          return {
            ...s,
            deuceAdvantage: null,
            matchLog: [...s.matchLog, 'Deuce'],
          };
        }
        return {
          ...s,
          deuceAdvantage: scorer,
          matchLog: [
            ...s.matchLog,
            `Advantage ${scorer === 'A' ? s.config.teamA : s.config.teamB}`,
          ],
        };
    }
  }

  // ── Step 2: scorer reaches 40 while opponent already at 40 → enter deuce ──
  // myPts === 2: scorer goes from 30 → 40 this click
  // myPts === 3: scorer already at 40 (belt + braces)
  const scorerReaches40 = myPts === 2 || myPts === 3;

  if (scorerReaches40 && oppPts === 3) {
    const newPointsA = scorer === 'A' ? 3 : s.pointsA;
    const newPointsB = scorer === 'B' ? 3 : s.pointsB;

    switch (s.config.deuceMode) {
      case 'goldenPoint':
        return {
          ...s,
          pointsA: newPointsA, pointsB: newPointsB,
          deuce: true, deuceAdvantage: null, silverPointActive: false,
          matchLog: [...s.matchLog, 'Golden Point!'],
        };

      case 'silverPoint':
        // First deuce — play advantage out first
        return {
          ...s,
          pointsA: newPointsA, pointsB: newPointsB,
          deuce: true, deuceAdvantage: null, silverPointActive: false,
          matchLog: [...s.matchLog, 'Deuce'],
        };

      case 'starPoint': {
        // First time reaching 40-40: deuceCount becomes 1
        const newDeuceCount = s.deuceCount + 1;
        const isStarPoint   = newDeuceCount >= 3;
        return {
          ...s,
          pointsA: newPointsA, pointsB: newPointsB,
          deuce: true, deuceAdvantage: null, silverPointActive: false,
          deuceCount: newDeuceCount,
          matchLog: [
            ...s.matchLog,
            isStarPoint ? '40-40 — Star Point!' : 'Deuce',
          ],
        };
      }

      case 'longDeuce':
      default:
        return {
          ...s,
          pointsA: newPointsA, pointsB: newPointsB,
          deuce: true, deuceAdvantage: null, silverPointActive: false,
          matchLog: [...s.matchLog, 'Deuce'],
        };
    }
  }

  // ── Step 3: scorer at 40, opponent below → win game ───────────────────────
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

// ── Win a game ────────────────────────────────────────────────────────────────
function winGame(s: MatchState, winner: Side): MatchState {
  const newGamesA = winner === 'A' ? s.gamesA + 1 : s.gamesA;
  const newGamesB = winner === 'B' ? s.gamesB + 1 : s.gamesB;
  const teamName  = winner === 'A' ? s.config.teamA : s.config.teamB;
  const ns: MatchState = {
    ...s,
    pointsA: 0, pointsB: 0,
    gamesA: newGamesA, gamesB: newGamesB,
    deuce: false, deuceAdvantage: null, silverPointActive: false,
    deuceCount: 0,           // reset for every new game
    server: otherSide(s.server),
    matchLog: [...s.matchLog, `Game ${teamName} (${newGamesA}-${newGamesB})`],
  };
  return checkSetEnd(ns);
}

// ── Set end check ─────────────────────────────────────────────────────────────
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
    gamesA >= 6 && diff >= 2     ? 'A' :
    gamesB >= 6 && diff >= 2     ? 'B' :
    gamesA === 7 && gamesB === 6 ? 'A' :
    gamesB === 7 && gamesA === 6 ? 'B' : null;

  return w ? winSet(s, w) : s;
}

// ── Win a set ─────────────────────────────────────────────────────────────────
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
    deuce: false, deuceAdvantage: null, silverPointActive: false,
    deuceCount: 0,           // reset for every new game (new set = new game)
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

// ── Tiebreak point ────────────────────────────────────────────────────────────
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
    return winSet({
      ...ns,
      inTiebreak: false,
      gamesA: leader === 'A' ? ns.gamesA + 1 : ns.gamesA,
      gamesB: leader === 'B' ? ns.gamesB + 1 : ns.gamesB,
    }, leader);
  }
  return ns;
}

// ── Display helpers ───────────────────────────────────────────────────────────
export function getPointLabel(
  pts: number,
  isDeuce: boolean,
  advantage: Side | null,
  side: Side,
  silverPointActive: boolean,
  deuceMode?: DeuceMode,
  deuceCount?: number,
): string {
  if (isDeuce) {
    if (silverPointActive) return 'SP';
    // Star Point: show 'SP' label on the third deuce
    if (deuceMode === 'starPoint' && (deuceCount ?? 0) >= 3) return 'SP';
    if (advantage === side) return 'ADV';
    return '40';
  }
  return ['0', '15', '30', '40'][pts] ?? '0';
}

export function getServingTeamName(state: MatchState): string {
  return state.server === 'A' ? state.config.teamA : state.config.teamB;
}
