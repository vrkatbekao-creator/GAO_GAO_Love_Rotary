import assert from 'node:assert/strict';
import { GameManager } from '../js/game_manager.js';
import { DeskUI } from '../js/desk_ui.js';
import { CONFIG } from '../js/game_data.js';

// Test the actual rule engine: wheels are not merely hidden in the UI.
assert.equal(CONFIG.buildings.wheel.max_per_zone, 1);
assert.equal(CONFIG.buildings.wheel.max_per_zone_override['舊城區'], 3);
for (const zone of CONFIG.zones.filter(z => z !== '舊城區')) {
  const gm = new GameManager(41);
  gm.play({ type: 'wheel', zone });
  const beforeTurn = gm.turn;
  const beforeCount = gm.buildings.length;
  assert.throws(() => gm.validateAction({ type: 'wheel', zone }), /Maximum wheels/);
  assert.throws(() => gm.play({ type: 'wheel', zone }), /Maximum wheels/);
  assert.equal(gm.turn, beforeTurn, `${zone}: rejected build must not use a turn`);
  assert.equal(gm.buildings.length, beforeCount, `${zone}: rejected build must not create a wheel`);
}
const oldTown = new GameManager(42);
for (let i = 0; i < 3; i++) {
  oldTown.validateAction({ type: 'wheel', zone: '舊城區' });
  oldTown.play({ type: 'wheel', zone: '舊城區' });
}
assert.equal(oldTown.count_zone('wheel', '舊城區'), 3);
assert(oldTown.achievements.includes('ACH03'));
const beforeFourthTurn = oldTown.turn;
assert.throws(() => oldTown.validateAction({ type: 'wheel', zone: '舊城區' }), /Maximum wheels/);
assert.throws(() => oldTown.play({ type: 'wheel', zone: '舊城區' }), /Maximum wheels/);
assert.equal(oldTown.turn, beforeFourthTurn);
assert.equal(oldTown.count_zone('wheel', '舊城區'), 3);

// Minimal DOM harness for the real zone picker, no external test dependencies.
const originalDocument = globalThis.document;
const originalAlert = globalThis.alert;
const created = [];
globalThis.document = {
  getElementById(id) {
    if (id === 'zone-modal-title') return { textContent: '' };
    return null;
  },
  createElement(tag) {
    const classes = new Set();
    const card = {
      tagName: tag.toUpperCase(),
      className: '',
      classList: { add: x => classes.add(x), contains: x => classes.has(x) },
      style: {},
      attributes: {},
      listeners: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      addEventListener(k, f) { this.listeners[k] = f; },
      innerHTML: ''
    };
    created.push(card);
    return card;
  }
};
try {
  const gm = new GameManager(7);
  gm.turn = 5;
  gm.buildings = [
    { type: 'wheel', zone: '港灣區', ready_turn: 3 },
    { type: 'wheel', zone: '舊城區', ready_turn: 3 },
    { type: 'wheel', zone: '舊城區', ready_turn: 3 }
  ];
  const choices = [];
  const ui = {
    gm,
    zoneModal: { style: {} },
    zoneOptionsGrid: {
      innerHTML: '',
      appendChild(el) { this.cards.push(el); },
      cards: []
    },
    closeZoneModal() { this.zoneModal.style.display = 'none'; }
  };
  const showPicker = () => {
    ui.zoneOptionsGrid.cards = [];
    DeskUI.prototype.openZoneModal.call(ui, 'wheel', zone => choices.push(zone));
    assert.equal(ui.zoneOptionsGrid.cards.length, 5);
    return Object.fromEntries(CONFIG.zones.map((z, i) => [z, ui.zoneOptionsGrid.cards[i]]));
  };

  let cards = showPicker();
  assert.equal(cards['港灣區'].attributes['aria-disabled'], 'true');
  assert.match(cards['港灣區'].innerHTML, /1.*1/);
  assert.equal(cards['港灣區'].listeners.click, undefined);
  assert.equal(cards['舊城區'].attributes['aria-disabled'], undefined);
  assert.match(cards['舊城區'].innerHTML, /2.*3/);
  cards['舊城區'].listeners.click();
  assert.deepEqual(choices, ['舊城區']);

  gm.buildings.push({ type: 'wheel', zone: '舊城區', ready_turn: 4 });
  cards = showPicker();
  assert.equal(cards['舊城區'].attributes['aria-disabled'], 'true');
  assert.equal(cards['舊城區'].listeners.click, undefined);
  assert.match(cards['舊城區'].innerHTML, /3.*3/);
  assert.equal(cards['科技區'].attributes['aria-disabled'], undefined);

  // Direct calls through UI are rejected, even if someone bypasses the picker.
  let presented = 0;
  let rendered = 0;
  let warned = 0;
  globalThis.alert = () => { warned++; };
  const blockedUI = {
    gm,
    isTurnResolving: false,
    options: { onActionChosen() { rendered++; } },
    presentEventDocument() { presented++; },
    updateActionButtonsAvailability() {}
  };
  DeskUI.prototype.executeTurnAction.call(blockedUI, { type: 'wheel', zone: '舊城區' });
  assert.equal(presented, 0);
  assert.equal(rendered, 0);
  assert.equal(warned, 1);
  assert.equal(blockedUI.isTurnResolving, false);
} finally {
  globalThis.document = originalDocument;
  globalThis.alert = originalAlert;
}
console.log('Ferris-wheel limits and zone-picker regression checks passed.');
