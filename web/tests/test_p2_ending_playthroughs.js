import assert from 'node:assert/strict';
import { GameManager } from '../js/game_manager.js';

// Reproducible, VALID 12-turn playthroughs under the +0.5 億 default.
// Unlike synthetic ending fixtures, these traces use only legal actions,
// frozen event IDs, and ordinary A/B decisions. No state is manipulated.
const R = 'rest';
const W = z => 'wheel:' + z;
const M = z => 'market:' + z;
const S = z => 'shuttle:港灣區:' + z;
const P = 'repay';
const marketFour = [W('港灣區'),M('港灣區'),M('舊城區'),M('科技區'),M('郊區'),...Array(7).fill(R)];
const wheelOne = [W('港灣區'),...Array(11).fill(R)];
const repayFour = [P,P,P,P];
const threeLinks = [S('舊城區'),S('郊區'),S('科技區')];

const scenarios = [
  {
    ending:'預算追加申請中', seed:1,
    actions:[W('港灣區'),...Array(6).fill('event:港灣區'),...Array(5).fill(R)],
    eventIds:'EV06 EV01 EV09 EV14 EV17 EV18 EV23 EV20 EV27 EV32 EV34 EV36',
    choices:'B B A B B B B B B B B B'
  },
  {
    ending:'HIDDEN_S', seed:1, actions:marketFour,
    eventIds:'EV06 EV01 EV09 EV14 EV17 EV18 EV26 EV20 EV27 EV32 EV34 EV36',
    choices:'A A A A A A A A A A A B'
  },
  {
    ending:'一城五輪', seed:1,
    actions:[W('港灣區'),W('舊城區'),W('科技區'),W('郊區'),S('山城區'),...Array(7).fill(R)],
    eventIds:'EV06 EV01 EV09 EV14 EV17 EV18 EV25 EV20 EV27 EV32 EV34 EV36',
    choices:'B B A B B B B B B B B B'
  },
  {
    ending:'全市愛情接駁網', seed:6,
    actions:[W('港灣區'),R,R,R,...repayFour,...threeLinks,S('山城區')],
    eventIds:'EV05 EV01 EV09 EV15 EV11 EV18 EV21 EV19 EV27 EV28 EV35 EV36',
    choices:'B B A B B B A B B B B B'
  },
  {
    ending:'仍在協商中的愛情城市', seed:4, actions:wheelOne,
    eventIds:'EV08 EV03 EV09 EV11 EV10 EV18 EV20 EV22 EV27 EV28 EV35 EV36',
    choices:'A A A A A A A A A A B B'
  },
  {
    ending:'摩天輪旁的夜市', seed:11, actions:marketFour,
    eventIds:'EV05 EV04 EV09 EV14 EV15 EV18 EV26 EV21 EV27 EV28 EV32 EV36',
    choices:'B B A B A B B B A B A B'
  },
  {
    ending:'招商成功，命名失敗', seed:2421,
    actions:[W('港灣區'),M('港灣區'),...Array(10).fill(R)],
    eventIds:'EV03 EV05 EV09 EV13 EV17 EV18 EV21 EV26 EV27 EV33 EV29 EV36',
    choices:'A B A A B B A B B B B B'
  },
  {
    ending:'低調完成任務', seed:14,
    actions:[W('港灣區'),R,R,R,...repayFour,...threeLinks,R],
    eventIds:'EV04 EV03 EV09 EV14 EV12 EV18 EV19 EV21 EV27 EV33 EV28 EV36',
    choices:'B B B A A A B A A A B A'
  },
  {
    ending:'永遠開不完的協調會', seed:3374,
    actions:[W('港灣區'),W('舊城區'),M('港灣區'),...Array(9).fill(R)],
    eventIds:'EV04 EV03 EV09 EV16 EV17 EV18 EV24 EV26 EV27 EV35 EV30 EV36',
    choices:'B B B B B B B A A B A A'
  }
];

function parseAction(spec, g) {
  if (spec === R) return {type:'rest'};
  if (spec === P) return {type:'repay',amount:Math.min(2,g.debt,g.budget)};
  const [type,zone,to_zone] = spec.split(':');
  return type === 'shuttle' ? {type,zone,to_zone} : {type,zone};
}

const observed = new Set();
for (const scenario of scenarios) {
  const g = new GameManager(scenario.seed, 0.5);
  const events = scenario.eventIds.split(' ');
  const choices = scenario.choices.split(' ');
  assert.equal(scenario.actions.length, 12, scenario.ending + ': action count');
  assert.equal(events.length, 12, scenario.ending + ': event count');
  assert.equal(choices.length, 12, scenario.ending + ': choice count');
  for (let t = 0; t < 12; t++) {
    const action = parseAction(scenario.actions[t], g);
    assert.doesNotThrow(() => g.validateAction(action), `${scenario.ending} turn ${t+1} illegal action`);
    const selected = g.select_event();
    assert.equal(selected.id,events[t],`${scenario.ending} turn ${t+1} event changed`);
    const turn = g.play(action,choices[t],1800,selected.id);
    assert.equal(turn.turn,t+1);
    assert.equal(turn.event,selected.id);
  }
  assert.equal(g.finished,true);
  assert.equal(g.used_events.length,12);
  assert.equal(g.snapshot().ending,scenario.ending,`seed ${scenario.seed}`);
  observed.add(g.ending());
}
assert.equal(observed.size,9,'All nine endings must be reachable via legal 12-turn games');
console.log('All 9 endings reached through reproducible legal zero-base 12-turn playthroughs.');
