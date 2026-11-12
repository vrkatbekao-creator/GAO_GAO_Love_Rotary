import { GameManager } from '../js/game_manager.js';
import { CONFIG, EVENTS, NARRATIVE } from '../js/game_data.js';

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  }
}

console.log('--- Running GameManager JS Unit Tests ---');

// Test 1: Event database validation
assert(EVENTS.length === 36, `Expected 36 events, got ${EVENTS.length}`);
const fixed = EVENTS.filter(e => e.fixed_turn).map(e => [e.fixed_turn, e.id]);
assert(JSON.stringify(fixed) === JSON.stringify([[3, 'EV09'], [6, 'EV18'], [9, 'EV27'], [12, 'EV36']]), 'Fixed events mismatch');
console.log('✓ Event database & fixed turns validated');

// Test 2: Turn 1 constraint
const g1 = new GameManager(1);
let threw = false;
try {
  g1.play({ type: 'hearing' });
} catch (e) {
  threw = true;
  assert(e.message.includes('Turn 1'), 'Expected Turn 1 error message');
}
assert(threw, 'Expected play() to throw on turn 1 non-wheel action');
console.log('✓ Turn 1 constraint validated');

// Test 3: Old town multi-wheel & ACH03
const g2 = new GameManager(2);
g2.play({ type: 'wheel', zone: '港灣區' });
g2.play({ type: 'wheel', zone: '舊城區' });
g2.play({ type: 'wheel', zone: '舊城區' });
assert(!g2.achievements.includes('ACH03'), 'ACH03 should not trigger with 2 wheels in Old Town');
g2.play({ type: 'wheel', zone: '舊城區' });
assert(g2.achievements.includes('ACH03'), 'ACH03 must trigger with 3 wheels in Old Town');
threw = false;
try {
  g2.play({ type: 'wheel', zone: '舊城區' });
} catch (e) {
  threw = true;
  assert(e.message.includes('Maximum wheels'), 'Expected 4th wheel in Old Town to exceed limit');
}
assert(threw, 'Old town must disallow >3 wheels');
console.log('✓ Old town multi-wheel & ACH03 validated');

// Test 4: Newton\'s Tears & ACH01
const g3 = new GameManager(3);
g3.play({ type: 'wheel', zone: '港灣區' });
g3.play({ type: 'shuttle', zone: '港灣區', to_zone: '山城區' });
assert(g3.achievements.includes('ACH01'), 'ACH01 must trigger for Harbor-Mountain shuttle');
console.log('✓ Newton\'s tears (ACH01) validated');

// Test 5: Rapid stamping & ACH02
const g4 = new GameManager(4);
g4.play({ type: 'wheel', zone: '港灣區' }, 'A', 500.0);
g4.play({ type: 'rest' }, 'A', 600.0);
assert(!g4.achievements.includes('ACH02'), 'ACH02 requires 3 rapid stamps');
g4.play({ type: 'rest' }, 'A', 700.0);
assert(g4.achievements.includes('ACH02'), 'ACH02 must trigger after 3 rapid stamps');
console.log('✓ Rapid stamping (ACH02) validated');

// Test 6: 12-turn completion & Hidden Ending S
const g5 = new GameManager(5);
g5.tourism = 80;
g5.complaints = 20;
g5.budget = 0;
g5.debt = 5;
g5.finished = true;
assert(g5.ending() === 'HIDDEN_S', `Expected HIDDEN_S, got ${g5.ending()}`);
console.log('✓ Hidden Ending S validated');

// Test 7: Full 12-turn game loop & snapshot (Legacy $24B start)
const g6 = new GameManager(42, 24.0);
const acts = [
  { type: 'wheel', zone: '港灣區' },
  { type: 'market', zone: '港灣區' },
  { type: 'shuttle', zone: '港灣區', to_zone: '舊城區' },
  { type: 'shuttle', zone: '舊城區', to_zone: '山城區' },
  { type: 'shuttle', zone: '舊城區', to_zone: '郊區' },
  { type: 'shuttle', zone: '港灣區', to_zone: '科技區' },
  { type: 'market', zone: '舊城區' },
  { type: 'market', zone: '山城區' },
  { type: 'hearing' },
  { type: 'hearing' },
  { type: 'event', zone: '港灣區' },
  { type: 'rest' }
];

for (const a of acts) {
  g6.play(a, 'A', 1500.0);
}
assert(g6.finished, 'Game should be finished after 12 turns');
assert(g6.used_events.length === 12, 'Must have used 12 unique events');
const snap = g6.snapshot();
assert(snap.ending === '全市愛情接駁網', `Expected 全市愛情接駁網, got ${snap.ending}`);
console.log('✓ Full 12-turn game run completed cleanly with ending:', snap.ending);

// Test 8: Zero-Base Start (+$0.5B)
const gZero = new GameManager(42, 0.5);
assert(gZero.budget === 0.5, `Expected budget 0.5, got ${gZero.budget}`);
assert(gZero.debt === 0.0, `Expected debt 0.0, got ${gZero.debt}`);
assert(gZero.net_budget === 0.5, `Expected net_budget 0.5, got ${gZero.net_budget}`);
assert(gZero.meltdown_stage === 2, `Expected stage 2, got ${gZero.meltdown_stage}`);
gZero.play({ type: 'wheel', zone: '港灣區' });
assert(gZero.debt > 0, 'Zero-base wheel build should result in debt');
console.log('✓ Zero-base initial budget (+0.5B) validated');

// Test 9: Abyss Deficit Start (-$18.0B)
const gAbyss = new GameManager(42, -18.0);
assert(gAbyss.budget === 0.0, `Expected budget 0.0, got ${gAbyss.budget}`);
assert(gAbyss.debt === 18.0, `Expected debt 18.0, got ${gAbyss.debt}`);
assert(gAbyss.net_budget === -18.0, `Expected net_budget -18.0, got ${gAbyss.net_budget}`);
assert(gAbyss.meltdown_stage === 3, `Expected stage 3, got ${gAbyss.meltdown_stage}`);
gAbyss.play({ type: 'wheel', zone: '港灣區' });
assert(gAbyss.debt >= 26.0, `Expected debt >= 26.0, got ${gAbyss.debt}`);
console.log('✓ Abyss deficit initial budget (-18.0B) validated');

console.log('ALL JS TESTS PASSED SUCCESSFULLY!');
