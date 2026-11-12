import assert from 'node:assert/strict';
import { GameManager } from '../js/game_manager.js';
import { CONFIG } from '../js/game_data.js';

// Synthetic-state tests of the *ordering and mechanics* of the nine ending branches.
// These fixtures do NOT establish that a real 12-turn playthrough can reach each ending.
function endingFixture({
  wheels = ['港灣區'], shuttles = [], markets = [],
  budget = 20, debt = 0, tourism = 50, admin = 20, complaints = 20
} = {}) {
  const gm = new GameManager(43, 0.5);
  gm.turn = CONFIG.rounds + 1;
  gm.finished = true;
  gm.budget = budget;
  gm.debt = debt;
  gm.tourism = tourism;
  gm.admin = admin;
  gm.complaints = complaints;
  gm.buildings = [
    ...wheels.map(zone => ({type:'wheel', zone, ready_turn:3})),
    ...shuttles.map(([zone,to_zone]) => ({type:'shuttle',zone,to_zone,ready_turn:4})),
    ...markets.map(zone => ({type:'market',zone,ready_turn:5}))
  ];
  return gm;
}

const cases = [
  ['HIDDEN_S', { tourism: 85, complaints: 20, budget: 0, debt: 10 }],
  ['一城五輪', {
    wheels:['港灣區','舊城區','郊區','科技區'],
    shuttles:[['港灣區','山城區']]
  }],
  ['預算追加申請中', {budget:0,debt:10}],
  ['永遠開不完的協調會', {admin:80}],
  ['全市愛情接駁網', {
    shuttles:[
      ['港灣區','舊城區'], ['舊城區','科技區'],
      ['科技區','郊區'], ['郊區','山城區']
    ]
  }],
  ['摩天輪旁的夜市', {markets:['港灣區','舊城區','科技區'],tourism:65}],
  ['招商成功，命名失敗', {tourism:80,complaints:60}],
  ['低調完成任務', {
    shuttles:[['港灣區','舊城區'],['舊城區','科技區'],['科技區','郊區']]
  }],
  ['仍在協商中的愛情城市', {}]
];
for (const [expected, fixture] of cases) {
  assert.equal(endingFixture(fixture).ending(), expected, expected);
}

// Explicitly document priority: deficit endings outrank bureaucratic coordination.
assert.equal(
  endingFixture({budget:0,debt:8,admin:90}).ending(),
  '預算追加申請中'
);

// An unfinished turn-13 construction is not operational in the terminal audit.
const lastTurn = endingFixture();
lastTurn.buildings = [
  {type:'wheel',zone:'港灣區',ready_turn:13},
  {type:'shuttle',zone:'港灣區',to_zone:'舊城區',ready_turn:12}
];
assert.equal(lastTurn.count('wheel'), 1);
assert.equal(lastTurn.count('wheel', true), 0);
assert.equal(lastTurn.covered().size, 0);
assert.equal(lastTurn.snapshot().coverage.length, 0);

console.log('P2 ending-branch fixtures passed (synthetic cases; not playthrough reachability).');
