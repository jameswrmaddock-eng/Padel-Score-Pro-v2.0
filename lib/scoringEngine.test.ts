// lib/scoringEngine.test.ts
// Run: npm test  (requires Node 22.12+ or Node 24+, which strip TS types natively)

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { initMatch, scorePoint } from './scoringEngine.ts';
import type { MatchConfig, MatchState, Side, DeuceMode } from './scoringEngine.ts';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeConfig(
  deuceMode: DeuceMode,
  tiebreak: 'tiebreak' | 'playOn' = 'tiebreak',
): MatchConfig {
  return {
    teamA: 'Team A',
    teamB: 'Team B',
    format: 1,
    deuceMode,
    tiebreak,
    firstServe: 'A',
  };
}

/** Score <side> a given number of consecutive points. */
function score(state: MatchState, side: Side, count = 1): MatchState {
  let s = state;
  for (let i = 0; i < count; i++) s = scorePoint(s, side);
  return s;
}

/** Win a game 4-0 for <side> (opponent never scores, so deuce is never reached). */
function winGameClean(state: MatchState, side: Side): MatchState {
  return score(state, side, 4);
}

/**
 * Bring both sides to 40-40 (deuce) from the start of a game.
 * Alternates A, B three times: 0-0 → 15-0 → 15-15 → 30-15 → 30-30 → 40-30 → 40-40.
 */
function toDeuce(state: MatchState): MatchState {
  let s = state;
  for (let i = 0; i < 3; i++) {
    s = scorePoint(s, 'A');
    s = scorePoint(s, 'B');
  }
  return s;
}

/**
 * Score clean games for each side alternately until 6-6, triggering a tiebreak.
 * A wins odd games, B wins even games.
 */
function to6_6(state: MatchState): MatchState {
  let s = state;
  for (let i = 0; i < 6; i++) {
    s = winGameClean(s, 'A');
    s = winGameClean(s, 'B');
  }
  return s;
}

// ── longDeuce ─────────────────────────────────────────────────────────────────

describe('longDeuce', () => {
  it('enters deuce at 40-40', () => {
    const s = toDeuce(initMatch(makeConfig('longDeuce')));
    assert.equal(s.deuce, true);
    assert.equal(s.deuceAdvantage, null);
    assert.ok(s.matchLog.some(l => l.includes('Deuce')));
  });

  it('gives advantage to the scorer', () => {
    const s = scorePoint(toDeuce(initMatch(makeConfig('longDeuce'))), 'A');
    assert.equal(s.deuceAdvantage, 'A');
    assert.equal(s.deuce, true);
    assert.ok(s.matchLog.some(l => l.includes('Advantage')));
  });

  it('returns to deuce when the advantage is broken', () => {
    let s = toDeuce(initMatch(makeConfig('longDeuce')));
    s = scorePoint(s, 'A'); // ADV A
    s = scorePoint(s, 'B'); // advantage broken → deuce
    assert.equal(s.deuce, true);
    assert.equal(s.deuceAdvantage, null);
  });

  it('wins the game from advantage', () => {
    let s = toDeuce(initMatch(makeConfig('longDeuce')));
    s = scorePoint(s, 'A'); // ADV A
    s = scorePoint(s, 'A'); // game
    assert.equal(s.deuce, false);
    assert.equal(s.gamesA, 1);
    assert.equal(s.gamesB, 0);
  });

  it('can cycle through deuce indefinitely', () => {
    let s = toDeuce(initMatch(makeConfig('longDeuce')));
    for (let i = 0; i < 10; i++) {
      s = scorePoint(s, 'A'); // ADV A
      s = scorePoint(s, 'B'); // back to deuce
      assert.equal(s.deuce, true);
      assert.equal(s.gamesA, 0);
    }
  });
});

// ── silverPoint ───────────────────────────────────────────────────────────────

describe('silverPoint', () => {
  it('first deuce starts with advantage play (not silver point yet)', () => {
    const s = toDeuce(initMatch(makeConfig('silverPoint')));
    assert.equal(s.deuce, true);
    assert.equal(s.silverPointActive, false);
  });

  it('gives advantage at first deuce', () => {
    let s = toDeuce(initMatch(makeConfig('silverPoint')));
    s = scorePoint(s, 'A');
    assert.equal(s.deuceAdvantage, 'A');
    assert.equal(s.silverPointActive, false);
  });

  it('activates silver point when first-deuce advantage is broken', () => {
    let s = toDeuce(initMatch(makeConfig('silverPoint')));
    s = scorePoint(s, 'A'); // ADV A
    s = scorePoint(s, 'B'); // back to 40-40 → silver point activated
    assert.equal(s.silverPointActive, true);
    assert.equal(s.deuceAdvantage, null);
    assert.ok(s.matchLog.some(l => l.includes('Silver Point')));
  });

  it('next point wins the game in silver point stage', () => {
    let s = toDeuce(initMatch(makeConfig('silverPoint')));
    s = scorePoint(s, 'A'); // ADV A
    s = scorePoint(s, 'B'); // silver point active
    s = scorePoint(s, 'B'); // B wins outright
    assert.equal(s.gamesB, 1);
    assert.equal(s.gamesA, 0);
    assert.equal(s.deuce, false);
  });

  it('wins directly from advantage — no silver point needed', () => {
    let s = toDeuce(initMatch(makeConfig('silverPoint')));
    s = scorePoint(s, 'A'); // ADV A
    s = scorePoint(s, 'A'); // A wins; silver point was never activated
    assert.equal(s.gamesA, 1);
    assert.equal(s.silverPointActive, false);
  });

  it('resets silverPointActive after the game ends', () => {
    let s = toDeuce(initMatch(makeConfig('silverPoint')));
    s = scorePoint(s, 'A');
    s = scorePoint(s, 'B'); // silver point
    s = scorePoint(s, 'A'); // A wins
    assert.equal(s.silverPointActive, false);
    assert.equal(s.deuce, false);
  });
});

// ── goldenPoint ───────────────────────────────────────────────────────────────

describe('goldenPoint', () => {
  it('enters deuce at 40-40 with Golden Point log entry', () => {
    const s = toDeuce(initMatch(makeConfig('goldenPoint')));
    assert.equal(s.deuce, true);
    assert.ok(s.matchLog.some(l => l.includes('Golden Point')));
  });

  it('scorer wins the game immediately after deuce', () => {
    let s = toDeuce(initMatch(makeConfig('goldenPoint')));
    s = scorePoint(s, 'A');
    assert.equal(s.gamesA, 1);
    assert.equal(s.gamesB, 0);
    assert.equal(s.deuce, false);
  });

  it('opponent can also win the golden point', () => {
    let s = toDeuce(initMatch(makeConfig('goldenPoint')));
    s = scorePoint(s, 'B');
    assert.equal(s.gamesB, 1);
    assert.equal(s.gamesA, 0);
  });

  it('no advantage is ever granted', () => {
    let s = toDeuce(initMatch(makeConfig('goldenPoint')));
    s = scorePoint(s, 'A'); // game — not advantage
    assert.equal(s.deuceAdvantage, null);
  });

  it('game resets cleanly after golden point win', () => {
    let s = toDeuce(initMatch(makeConfig('goldenPoint')));
    s = scorePoint(s, 'A');
    assert.equal(s.pointsA, 0);
    assert.equal(s.pointsB, 0);
    assert.equal(s.silverPointActive, false);
    assert.equal(s.deuceCount, 0);
  });
});

// ── starPoint ─────────────────────────────────────────────────────────────────

describe('starPoint', () => {
  it('first deuce sets deuceCount to 1', () => {
    const s = toDeuce(initMatch(makeConfig('starPoint')));
    assert.equal(s.deuceCount, 1);
    assert.equal(s.deuce, true);
  });

  it('first two deuces use normal advantage play', () => {
    let s = toDeuce(initMatch(makeConfig('starPoint'))); // deuceCount = 1
    s = scorePoint(s, 'A'); // ADV A
    assert.equal(s.deuceAdvantage, 'A');

    s = scorePoint(s, 'B'); // back to deuce, deuceCount = 2
    assert.equal(s.deuceCount, 2);
    assert.equal(s.deuceAdvantage, null);
    assert.equal(s.deuce, true);
  });

  it('activates on the third deuce (deuceCount reaches 3)', () => {
    let s = toDeuce(initMatch(makeConfig('starPoint'))); // deuceCount = 1
    s = scorePoint(s, 'A'); // ADV A
    s = scorePoint(s, 'B'); // deuce, deuceCount = 2
    s = scorePoint(s, 'B'); // ADV B
    s = scorePoint(s, 'A'); // deuce, deuceCount = 3 — Star Point!
    assert.equal(s.deuceCount, 3);
    assert.ok(s.matchLog.some(l => l.includes('Star Point')));
  });

  it('next point wins immediately after star point activates', () => {
    let s = toDeuce(initMatch(makeConfig('starPoint'))); // deuceCount = 1
    s = scorePoint(s, 'A');
    s = scorePoint(s, 'B'); // deuceCount = 2
    s = scorePoint(s, 'B');
    s = scorePoint(s, 'A'); // deuceCount = 3
    s = scorePoint(s, 'B'); // B wins outright
    assert.equal(s.gamesB, 1);
    assert.equal(s.gamesA, 0);
    assert.equal(s.deuce, false);
  });

  it('can win from advantage before star point activates', () => {
    let s = toDeuce(initMatch(makeConfig('starPoint'))); // deuceCount = 1
    s = scorePoint(s, 'A'); // ADV A
    s = scorePoint(s, 'A'); // A wins — no star point reached
    assert.equal(s.gamesA, 1);
    assert.equal(s.deuceCount, 0); // reset after game ends
  });

  it('deuceCount resets to 0 after each game', () => {
    let s = toDeuce(initMatch(makeConfig('starPoint')));
    s = scorePoint(s, 'A');
    s = scorePoint(s, 'A'); // A wins game
    assert.equal(s.deuceCount, 0);
  });
});

// ── Tiebreak ──────────────────────────────────────────────────────────────────

describe('tiebreak', () => {
  it('starts when games reach 6-6', () => {
    const s = to6_6(initMatch(makeConfig('longDeuce')));
    assert.equal(s.inTiebreak, true);
    assert.equal(s.gamesA, 6);
    assert.equal(s.gamesB, 6);
    assert.equal(s.tbPointsA, 0);
    assert.equal(s.tbPointsB, 0);
    assert.ok(s.matchLog.some(l => l.includes('Tiebreak')));
  });

  it('scores tiebreak points on tbPointsA / tbPointsB', () => {
    let s = to6_6(initMatch(makeConfig('longDeuce')));
    s = scorePoint(s, 'A');
    assert.equal(s.tbPointsA, 1);
    assert.equal(s.tbPointsB, 0);
    s = scorePoint(s, 'B');
    assert.equal(s.tbPointsA, 1);
    assert.equal(s.tbPointsB, 1);
  });

  it('does not end at 6-6 inside the tiebreak — requires 2-point lead', () => {
    let s = to6_6(initMatch(makeConfig('longDeuce')));
    for (let i = 0; i < 6; i++) {
      s = scorePoint(s, 'A');
      s = scorePoint(s, 'B');
    }
    assert.equal(s.inTiebreak, true); // still going at 6-6
    assert.equal(s.tbPointsA, 6);
    assert.equal(s.tbPointsB, 6);

    s = scorePoint(s, 'A'); // 7-6 — not enough
    assert.equal(s.inTiebreak, true);

    s = scorePoint(s, 'A'); // 8-6 — wins
    assert.equal(s.inTiebreak, false);
    assert.equal(s.sets.length, 1);
  });

  it('wins the tiebreak and set at 7-5', () => {
    let s = to6_6(initMatch(makeConfig('longDeuce')));
    for (let i = 0; i < 5; i++) {
      s = scorePoint(s, 'A');
      s = scorePoint(s, 'B');
    }
    s = scorePoint(s, 'A');
    s = scorePoint(s, 'A'); // 7-5 — A wins
    assert.equal(s.inTiebreak, false);
    assert.equal(s.sets.length, 1);
    assert.equal(s.winner, 'A'); // A wins the 1-set match
  });

  it('tiebreak winner wins the match in 1-set format', () => {
    let s = to6_6(initMatch(makeConfig('longDeuce')));
    for (let i = 0; i < 7; i++) s = scorePoint(s, 'A'); // 7-0 tiebreak
    assert.equal(s.inTiebreak, false);
    assert.equal(s.winner, 'A');
  });

  it('game point scoring does not change during a tiebreak', () => {
    let s = to6_6(initMatch(makeConfig('longDeuce')));
    s = scorePoint(s, 'A');
    // pointsA and pointsB (regular game points) stay at 0 during tiebreak
    assert.equal(s.pointsA, 0);
    assert.equal(s.pointsB, 0);
  });
});

// ── Undo stack ────────────────────────────────────────────────────────────────
//
// The React hook (useScorer) manages the undo stack.  We replicate the same
// pure logic here — push before each point, pop on undo — so the engine can
// be tested without React.

describe('undo stack', () => {
  function makeScorer(config: MatchConfig) {
    let current = initMatch(config);
    const history: MatchState[] = [];

    return {
      get state() { return current; },
      get canUndo() { return history.length > 0; },
      addPoint(side: Side) {
        history.push(current);
        current = scorePoint(current, side);
      },
      undo() {
        if (history.length) current = history.pop()!;
      },
    };
  }

  it('canUndo is false on a fresh match', () => {
    const scorer = makeScorer(makeConfig('longDeuce'));
    assert.equal(scorer.canUndo, false);
  });

  it('canUndo becomes true after the first point', () => {
    const scorer = makeScorer(makeConfig('longDeuce'));
    scorer.addPoint('A');
    assert.equal(scorer.canUndo, true);
  });

  it('undo reverts to the previous state', () => {
    const scorer = makeScorer(makeConfig('longDeuce'));
    scorer.addPoint('A'); // 1-0
    const snap = scorer.state; // save snapshot
    scorer.addPoint('B'); // 1-1
    scorer.undo();
    assert.equal(scorer.state.pointsA, snap.pointsA);
    assert.equal(scorer.state.pointsB, snap.pointsB);
  });

  it('undo does nothing when history is empty', () => {
    const scorer = makeScorer(makeConfig('longDeuce'));
    const initial = scorer.state;
    scorer.undo(); // no-op
    assert.equal(scorer.state.pointsA, initial.pointsA);
    assert.equal(scorer.state.pointsB, initial.pointsB);
    assert.equal(scorer.canUndo, false);
  });

  it('undo can be called multiple times in sequence', () => {
    const scorer = makeScorer(makeConfig('longDeuce'));
    scorer.addPoint('A'); // 1-0
    scorer.addPoint('B'); // 1-1
    scorer.addPoint('A'); // 2-1

    scorer.undo();
    assert.equal(scorer.state.pointsA, 1);
    assert.equal(scorer.state.pointsB, 1);

    scorer.undo();
    assert.equal(scorer.state.pointsA, 1);
    assert.equal(scorer.state.pointsB, 0);

    scorer.undo();
    assert.equal(scorer.state.pointsA, 0);
    assert.equal(scorer.state.pointsB, 0);
    assert.equal(scorer.canUndo, false);
  });

  it('undo after a game win restores the pre-win state', () => {
    const scorer = makeScorer(makeConfig('goldenPoint'));
    // Win a game 4-0 for A
    scorer.addPoint('A');
    scorer.addPoint('A');
    scorer.addPoint('A');
    scorer.addPoint('A');
    assert.equal(scorer.state.gamesA, 1);

    scorer.undo(); // revert the game-winning point
    assert.equal(scorer.state.gamesA, 0);
    assert.equal(scorer.state.pointsA, 3); // back to 40
  });

  it('undo after entering deuce reverts deuce state', () => {
    const scorer = makeScorer(makeConfig('longDeuce'));
    for (let i = 0; i < 3; i++) {
      scorer.addPoint('A');
      scorer.addPoint('B');
    }
    assert.equal(scorer.state.deuce, true);

    scorer.undo(); // revert the deuce-triggering point
    assert.equal(scorer.state.deuce, false);
  });

  it('undo after silver point activation reverts silverPointActive', () => {
    const scorer = makeScorer(makeConfig('silverPoint'));
    for (let i = 0; i < 3; i++) {
      scorer.addPoint('A');
      scorer.addPoint('B');
    }
    scorer.addPoint('A'); // ADV A
    scorer.addPoint('B'); // silver point activated
    assert.equal(scorer.state.silverPointActive, true);

    scorer.undo();
    assert.equal(scorer.state.silverPointActive, false);
    assert.equal(scorer.state.deuceAdvantage, 'A'); // back to ADV A
  });

  it('undo preserves match log from prior state', () => {
    const scorer = makeScorer(makeConfig('longDeuce'));
    const logBefore = [...scorer.state.matchLog];
    scorer.addPoint('A');
    scorer.undo();
    assert.deepEqual(scorer.state.matchLog, logBefore);
  });
});
