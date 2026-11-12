import assert from 'node:assert/strict';
import { GameManager } from '../js/game_manager.js';
import { CONFIG } from '../js/game_data.js';

// Every displayed event must be the same event used to settle the turn.
for (const seed of [1, 2, 3, 42, 9999]) {
  const gm = new GameManager(seed);
  for (let turn = 1; turn <= 12; turn++) {
    const action = turn === 1 ? { type: 'wheel', zone: '港灣區' } : { type: 'rest' };
    const shown = gm.select_event();
    assert.strictEqual(gm.peekCurrentEvent().id, shown.id);
    assert.strictEqual(gm.select_event().id, shown.id);
    const resolved = gm.play(action, 'A', 1500, shown.id);
    assert.equal(resolved.event, shown.id, `seed ${seed} turn ${turn}`);
  }
  assert.equal(gm.used_events.length, 12);
}

const rejected = new GameManager(42);
assert.throws(() => rejected.validateAction({type:'hearing'}), /Turn 1/);
assert.equal(rejected.turn, 1);
assert.equal(rejected.buildings.length, 0);
const displayed = rejected.select_event();
assert.throws(
  () => rejected.play({type:'wheel',zone:'港灣區'},'A',1000,'EV-NOT-DISPLAYED'),
  /Event mismatch/
);
assert.equal(rejected.turn, 1);
assert.equal(rejected.buildings.length, 0);
assert.equal(rejected.select_event().id, displayed.id);

// Preserve the intentionally challenging zero-base / negative-base scenarios.
for (const start of [0.5, -6, -12, -18]) {
  const gm = new GameManager(42, start);
  assert.equal(gm.net_budget, start);
  assert.equal(gm.debt, Math.max(0, -start));
  assert.equal(gm.budget, Math.max(0, start));
  gm.validateAction({type:'wheel',zone:'港灣區'});
  gm.play({type:'wheel',zone:'港灣區'});
  assert.equal(gm.buildings.length, 1);
  gm.reset(42, start);
  assert.equal(gm.turn, 1);
  assert.equal(gm.net_budget, start);
  assert.equal(gm.buildings.length, 0);
  assert.equal(gm.pendingEvent, null);
}

// Turn 12 is the settlement boundary. Unfinished turn-13 buildings do not count.
const final = new GameManager(12);
final.turn = 13;
final.finished = true;
final.buildings = [
  {type:'wheel', zone:'港灣區', ready_turn:13, built_turn:11},
  {type:'shuttle', zone:'港灣區', to_zone:'山城區', ready_turn:12, built_turn:12}
];
assert.deepEqual([...final.covered()], []);

const exact = new GameManager(42);
exact.turn = 12;
exact.budget = 0;
exact.debt = 0;
exact._open_and_operate = () => {}; // isolate final-achievement ordering from economics
const event = exact.select_event();
const rec = exact.play({type:'rest'}, 'A', 1500, event.id);
if (exact.net_budget === 0) {
  assert(exact.achievements.includes('ACH06'));
  assert(rec.achievements.includes('ACH06'));
}
console.log('P0/P1 regression suite passed.');
