import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GameManager } from '../js/game_manager.js';
import { DeskUI } from '../js/desk_ui.js';
import { CONFIG } from '../js/game_data.js';

// Structural regression: list scrolls, not the entire modal. Title/cancel stay visible.
const css = readFileSync(new URL('../css/desk.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const rule = selector => {
  const safe = selector.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(safe + '\\s*\\{([^}]*)\\}'));
  assert(match, `Missing CSS selector ${selector}`);
  return match[1];
};
const modal = rule('#zone-picker-modal');
const list = rule('.zone-options-grid');
assert.match(modal, /flex-direction:\s*column/);
assert.match(modal, /max-height:/);
assert.match(modal, /overflow:\s*hidden/);
assert.match(list, /overflow-y:\s*auto/);
assert.match(list, /min-height:\s*0/);
assert.match(list, /touch-action:\s*pan-y/);
assert.match(rule('.modal-cancel-btn'), /flex:\s*0 0 auto/);
assert(css.includes('@media (max-height: 500px)'));
assert(html.includes('id="zone-options-grid"'));
assert(html.includes('tabindex="0"'));
assert(html.indexOf('id="zone-modal-title"') < html.indexOf('id="zone-options-grid"'));
assert(html.indexOf('id="zone-options-grid"') < html.indexOf('id="zone-modal-cancel"'));

const previousDocument = globalThis.document;
const heading = { textContent: '' };
globalThis.document = {
  getElementById: id => id === 'zone-modal-title' ? heading : null,
  createElement(tag) {
    const classes = new Set();
    return {
      tagName: tag.toUpperCase(),
      className: '',
      classList: { add: c => classes.add(c), contains: c => classes.has(c) },
      style: {},
      attributes: {},
      events: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      addEventListener(k, fn) { this.events[k] = fn; },
      innerHTML: ''
    };
  }
};

try {
  const gm = new GameManager(31);
  gm.turn = 2;
  const selected = [];
  const ui = {
    gm,
    zoneModal: { style: { display: 'none' } },
    zoneOptionsGrid: {
      cards: [], innerHTML: '', scrollTop: 500, focusCount: 0,
      focus() { this.focusCount++; },
      appendChild(c) { this.cards.push(c); }
    },
    closeZoneModal() { DeskUI.prototype.closeZoneModal.call(this); }
  };

  DeskUI.prototype.openZoneModal.call(ui, 'wheel', zone => selected.push(zone));
  assert.equal(ui.zoneModal.style.display, 'flex');
  assert.equal(ui.zoneOptionsGrid.scrollTop, 0, 'New zone picker starts at the first entry');
  assert.equal(ui.zoneOptionsGrid.cards.length, CONFIG.zones.length);
  assert.equal(ui.zoneOptionsGrid.focusCount, 1);
  const lastZone = ui.zoneOptionsGrid.cards.at(-1);
  assert(lastZone.events.click, 'Last zone remains selectable');
  lastZone.events.click();
  assert.deepEqual(selected, ['山城區']);
  assert.equal(ui.zoneModal.style.display, 'none');

  // Reopen with 10 shuttle routes: the old (non-scrollable) modal overflowed.
  ui.zoneOptionsGrid.cards = [];
  ui.zoneOptionsGrid.scrollTop = 950;
  DeskUI.prototype.openShuttleModal.call(ui, (from, to) => selected.push(from + ':' + to));
  assert.equal(ui.zoneModal.style.display, 'flex');
  assert.equal(ui.zoneOptionsGrid.scrollTop, 0, 'Shuttle selection resets scroll position');
  assert.equal(ui.zoneOptionsGrid.cards.length, 10);
  assert.equal(ui.zoneOptionsGrid.focusCount, 2);
  const lastPair = ui.zoneOptionsGrid.cards.at(-1);
  assert(lastPair.events.click, 'Last shuttle pair is available');
  lastPair.events.click();
  assert.equal(selected.at(-1), '科技區:山城區');
  assert.equal(ui.zoneModal.style.display, 'none');
} finally {
  if (previousDocument === undefined) delete globalThis.document;
  else globalThis.document = previousDocument;
}

console.log('Scrollable zone/shuttle picker UI contract passed (layout still needs browser QA).');
