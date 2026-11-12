import assert from 'assert';
import { GameManager } from '../js/game_manager.js';
import { NARRATIVE } from '../js/game_data.js';
import { ENDINGS_I18N, ACHIEVEMENTS_I18N } from '../js/i18n_endings.js';
import { DossierEnding } from '../js/dossier_ending.js';
import { setLocale } from '../js/i18n.js';

console.log('--- Running Dossier Ending Unit Tests ---');

// Mock browser globals for Node test environment
globalThis.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); }
};

let appendedChildren = [];
globalThis.document = {
  getElementById: (id) => {
    return {
      id,
      appendChild: (el) => appendedChildren.push(el),
      addEventListener: () => {}
    };
  },
  body: {
    appendChild: (el) => appendedChildren.push(el)
  },
  createElement: (tag) => {
    return {
      tagName: tag.toUpperCase(),
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      },
      appendChild: (el) => appendedChildren.push(el),
      innerHTML: ''
    };
  }
};

// 1. Verify all 9 canonical endings exist in NARRATIVE.endings_dossier
const EXPECTED_ENDINGS = [
  'HIDDEN_S',
  '全市愛情接駁網',
  '一城五輪',
  '摩天輪旁的夜市',
  '預算追加申請中',
  '永遠開不完的協調會',
  '招商成功，命名失敗',
  '低調完成任務',
  '仍在協商中的愛情城市'
];

assert(NARRATIVE.endings_dossier, 'NARRATIVE.endings_dossier must exist');
for (const ending of EXPECTED_ENDINGS) {
  assert(NARRATIVE.endings_dossier[ending], `NARRATIVE.endings_dossier must contain ${ending}`);
  assert(NARRATIVE.endings_dossier[ending].thermal_receipt, `${ending} must have thermal_receipt`);
  assert(Array.isArray(NARRATIVE.endings_dossier[ending].thermal_receipt.items), `${ending} thermal_receipt.items must be an array`);
}
console.log('✓ All 9 canonical endings present in NARRATIVE.endings_dossier');

// 2. Verify all 9 endings are localized across all 5 languages
const LANGS = ['zh', 'en', 'ja', 'fr', 'nl'];
for (const ending of EXPECTED_ENDINGS) {
  assert(ENDINGS_I18N[ending], `ENDINGS_I18N must contain ${ending}`);
  for (const lang of LANGS) {
    const loc = ENDINGS_I18N[ending][lang];
    assert(loc, `ENDINGS_I18N[${ending}] must have [${lang}]`);
    assert(loc.title, `${ending}.${lang} must have title`);
    assert(loc.official_headline, `${ending}.${lang} must have official_headline`);
    assert(loc.story, `${ending}.${lang} must have story`);
  }
}
console.log('✓ All 9 endings localized across all 5 languages (45/45 sets)');

// 3. Verify DossierEnding renders cleanly for all combinations
const dossier = new DossierEnding('office-desk-container');
const mockSnapshot = {
  turn: 12,
  budget: 15,
  debt: 2,
  net_budget: 13,
  tourism: 65,
  admin: 25,
  complaints: 10,
  achievements: ['ACH01', 'ACH02', 'ACH03', 'ACH04', 'ACH05', 'ACH06']
};

for (const lang of LANGS) {
  setLocale(lang);
  for (const ending of EXPECTED_ENDINGS) {
    appendedChildren = [];
    dossier.showEnding(ending, mockSnapshot, null);
    assert(appendedChildren.length > 0, `showEnding must append overlay element for ${ending} in ${lang}`);
  }
}
console.log('✓ DossierEnding.showEnding() tested cleanly for all 45 ending/lang variants');

// 4. End-to-end 12 turn simulation into final settlement
const gm = new GameManager(100);
for (let t = 1; t <= 12; t++) {
  let act = (t === 1) ? { type: 'wheel', zone: '港灣區' } : { type: 'rest' };
  gm.play(act, 'A');
}
assert.strictEqual(gm.finished, true, 'Game must be finished after 12 turns');
const finalEnding = gm.ending();
assert(typeof finalEnding === 'string', 'Ending must return a valid string key');
appendedChildren = [];
dossier.showEnding(finalEnding, gm.snapshot(), null);
assert(appendedChildren.length > 0, 'DossierEnding must append modal on final settlement');
console.log(`✓ Full 12-turn game reached ending [${finalEnding}] and rendered dossier successfully`);

console.log('ALL DOSSIER ENDING UNIT TESTS PASSED!');
