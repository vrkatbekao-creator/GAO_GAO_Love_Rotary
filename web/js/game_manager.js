import { CONFIG, EVENTS, NARRATIVE } from './game_data.js';

/**
 * Deterministic PRNG (Mulberry32) for reproducible seeded gameplay
 */
function createPRNG(seed) {
  let s = Math.floor(seed) >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class GameManager {
  constructor(seed = 42, initialNetBudget = 0.5) {
    this.reset(seed, initialNetBudget);
  }

  reset(seed = 42, initialNetBudget = 0.5) {
    this.seed = seed;
    this.initialNetBudget = typeof initialNetBudget === 'number' ? initialNetBudget : (CONFIG.start?.default_net_budget ?? 0.5);
    this.rng = createPRNG(seed);
    this.turn = 1;
    if (this.initialNetBudget >= 0) {
      this.budget = Math.round(this.initialNetBudget * 100) / 100;
      this.debt = 0.0;
    } else {
      this.budget = 0.0;
      this.debt = Math.round(Math.abs(this.initialNetBudget) * 100) / 100;
    }
    this.start_debt = this.debt;
    this.max_debt = Math.max(50.0, this.start_debt + 40.0);
    this.tourism = CONFIG.start?.tourism ?? 20;
    this.admin = CONFIG.start?.admin ?? 20;
    this.complaints = CONFIG.start?.complaints ?? 20;
    this.buildings = [];
    this.used_events = [];
    this.history = [];
    this.finished = false;
    this.achievements = [];
    this.hearing_count = 0;
    this.rapid_stamp_streak = 0;
    this.sponsored_wheel = false;
    this.pendingEvent = null; // Freeze the displayed event until that turn is resolved
  }

  get net_budget() {
    return Math.round((this.budget - this.debt) * 100) / 100;
  }

  get meltdown_stage() {
    const nb = this.net_budget;
    if (nb >= 10) return 1;
    if (nb >= 0) return 2;
    return 3;
  }

  _paid(amount, allow_loan = true, loan_ceiling = null) {
    const nextBudget = Math.round((this.budget + amount) * 100) / 100;
    if (nextBudget < 0) {
      if (!allow_loan) throw new Error('Insufficient budget');
      if (loan_ceiling !== null && (this.debt - nextBudget) > loan_ceiling) {
        throw new Error('Construction credit limit exceeded');
      }
      this.debt = Math.round((this.debt - nextBudget) * 100) / 100;
      this.budget = 0.0;
    } else {
      this.budget = nextBudget;
    }
  }

  count(type, operational = false) {
    return this.buildings.filter(b => b.type === type && (!operational || b.ready_turn <= this.turn)).length;
  }

  count_zone(type, zone) {
    return this.buildings.filter(b => b.type === type && b.zone === zone).length;
  }

  covered() {
    // The end-of-game snapshot is for turn 12, not the next (unplayed) turn.
    const activeTurn = Math.min(this.turn, CONFIG.rounds);
    const wheelZones = new Set(
      this.buildings
        .filter(b => b.type === 'wheel' && b.ready_turn <= activeTurn && b.zone)
        .map(b => b.zone)
    );

    const adj = {};
    for (const z of CONFIG.zones) {
      adj[z] = new Set();
    }

    for (const b of this.buildings) {
      if (b.type === 'shuttle' && b.ready_turn <= activeTurn && b.zone && b.to_zone) {
        adj[b.zone].add(b.to_zone);
        adj[b.to_zone].add(b.zone);
      }
    }

    const seen = new Set(wheelZones);
    const todo = Array.from(wheelZones);
    while (todo.length > 0) {
      const curr = todo.pop();
      for (const dest of adj[curr]) {
        if (!seen.has(dest)) {
          seen.add(dest);
          todo.push(dest);
        }
      }
    }
    return seen;
  }

  eligible(e) {
    const pre = e.precondition || {};
    const minWheels = pre.min_ferris_wheels ?? pre.min_operational_wheels ?? 0;
    const minShuttles = pre.min_shuttles ?? 0;
    const minMarkets = pre.min_markets ?? 0;

    return (
      this.count('wheel', true) >= minWheels &&
      this.count('shuttle') >= minShuttles &&
      this.count('market') >= minMarkets
    );
  }

  peekCurrentEvent() {
    // The first peek selects and caches the event; subsequent peeks do not advance RNG.
    return this.select_event();
  }

  select_event() {
    if (this.pendingEvent?.turn === this.turn) {
      return this.pendingEvent.event;
    }

    const chapter = Math.floor((this.turn - 1) / 3) + 1;
    const candidates = EVENTS.filter(
      e => e.chapter === chapter && !this.used_events.includes(e.id) && this.eligible(e)
    );
    const fixed = candidates.find(e => e.fixed_turn === this.turn);
    let selected = fixed;
    if (!selected) {
      const pool = candidates.filter(e => e.fixed_turn == null);
      if (pool.length === 0) throw new Error(`No eligible events in turn ${this.turn}`);
      selected = pool[Math.floor(this.rng() * pool.length)];
    }
    this.pendingEvent = { turn: this.turn, event: selected };
    return selected;
  }

  validateAction(action) {
    this._validate_action(action);
    return true;
  }

  _validate_action(a) {
    const kind = a.type;
    if (this.turn === 1 && kind !== 'wheel') {
      throw new Error('Turn 1 must choose the first wheel location');
    }
    if (['wheel', 'market', 'event'].includes(kind)) {
      if (!CONFIG.zones.includes(a.zone)) {
        throw new Error(`Unknown zone: ${a.zone}`);
      }
    }
    if (kind === 'wheel') {
      const zone = a.zone;
      const limit = CONFIG.buildings.wheel.max_per_zone_override?.[zone] ?? CONFIG.buildings.wheel.max_per_zone;
      if (this.count_zone('wheel', zone) >= limit) {
        throw new Error(`Maximum wheels (${limit}) exceeded for ${zone}`);
      }
    }
    if (kind === 'market') {
      const zone = a.zone;
      if (this.buildings.some(b => b.type === 'market' && b.zone === zone)) {
        throw new Error('One market maximum per zone');
      }
    }
    if (kind === 'shuttle') {
      const z = a.zone;
      const w = a.to_zone;
      if (!CONFIG.zones.includes(z) || !CONFIG.zones.includes(w) || z === w) {
        throw new Error('Bad shuttle endpoints');
      }
      if (this.buildings.some(b => b.type === 'shuttle' && ((b.zone === z && b.to_zone === w) || (b.zone === w && b.to_zone === z)))) {
        throw new Error('Duplicate shuttle link');
      }
    }
    if (!['wheel', 'market', 'shuttle', 'event', 'hearing', 'repay', 'rest'].includes(kind)) {
      throw new Error(`Unknown action: ${kind}`);
    }
    if (CONFIG.buildings[kind]) {
      const shortfall = Math.max(0, CONFIG.buildings[kind].cost - this.budget);
      if (this.debt + shortfall > this.max_debt) {
        throw new Error('Construction credit limit exceeded');
      }
    }
  }

  _build(a) {
    const kind = a.type;
    if (kind === 'rest') return;
    if (kind === 'repay') {
      const amount = Math.round(Math.min(this.debt, this.budget, Math.max(0, parseFloat(a.amount || 2))) * 100) / 100;
      this.budget = Math.round((this.budget - amount) * 100) / 100;
      this.debt = Math.round((this.debt - amount) * 100) / 100;
      return;
    }
    const row = CONFIG.buildings[kind];
    this._paid(-row.cost, true, this.max_debt);

    if (['wheel', 'shuttle', 'market'].includes(kind)) {
      this.buildings.push({
        type: kind,
        zone: a.zone || null,
        to_zone: a.to_zone || null,
        built_turn: this.turn,
        ready_turn: this.turn + row.lead_turns
      });

      if (kind === 'shuttle') {
        const pair = [a.zone, a.to_zone].sort().join(',');
        if (pair === ['港灣區', '山城區'].sort().join(',') && !this.achievements.includes('ACH01')) {
          this.achievements.push('ACH01');
        }
      }
      if (kind === 'wheel' && a.zone === '舊城區') {
        if (this.count_zone('wheel', '舊城區') >= 3 && !this.achievements.includes('ACH03')) {
          this.achievements.push('ACH03');
        }
      }
    } else if (kind === 'event') {
      this.tourism += row.tourism_once;
      this.complaints += row.complaints_once;
    } else if (kind === 'hearing') {
      this.admin += row.admin_once;
      this.complaints += row.complaints_once;
      this.hearing_count++;
      if (this.hearing_count >= 5 && !this.achievements.includes('ACH04')) {
        this.achievements.push('ACH04');
      }
    }
  }

  _open_and_operate() {
    for (const b of this.buildings) {
      if (b.ready_turn === this.turn) {
        this.tourism += CONFIG.buildings[b.type].tourism_on_open || 0;
      }
    }
    let net = CONFIG.income_per_round - Math.round((this.debt * 0.05) * 100) / 100;
    const cov = this.covered();

    for (const b of this.buildings) {
      if (b.ready_turn > this.turn) continue;
      const p = CONFIG.buildings[b.type];
      net -= p.maintenance_per_round || 0;
      net += p.operating_gross_per_round || 0;
      if (b.type === 'market' && cov.has(b.zone)) {
        net += p.gross_if_covered_per_round || 0;
      }
    }
    this._paid(Math.round(net * 100) / 100);
  }

  _clamp() {
    this.tourism = Math.max(0, Math.min(100, this.tourism));
    this.admin = Math.max(0, Math.min(100, this.admin));
    this.complaints = Math.max(0, Math.min(100, this.complaints));
  }

  play(action, event_choice = 'A', response_ms = 2000.0, expected_event_id = null) {
    if (this.finished) throw new Error('Game is already finished');
    this._validate_action(action);
    const e = this.select_event();
    if (expected_event_id !== null && e.id !== expected_event_id) {
      throw new Error(`Event mismatch: expected ${expected_event_id}, selected ${e.id}`);
    }
    if (!['A', 'B'].includes(event_choice)) throw new Error('Invalid event choice');
    const card_choice = e.choices.find(c => c.id === event_choice);
    const old_turn = this.turn;

    this._build(action);

    if (e.id === 'EV21' && event_choice === 'A') {
      this.sponsored_wheel = true;
    }

    for (const [k, v] of Object.entries(card_choice.delta)) {
      if (k === 'budget') {
        if (e.id === 'EV35' && event_choice === 'A') {
          const repay = Math.min(2.0, this.debt);
          this._paid(-repay);
          this.debt = Math.round((this.debt - repay) * 100) / 100;
        } else {
          this._paid(v);
        }
      } else {
        this[k] += v;
      }
    }

    this._open_and_operate();
    this._clamp();

    if (response_ms < 1000.0) {
      this.rapid_stamp_streak++;
      if (this.rapid_stamp_streak >= 3 && !this.achievements.includes('ACH02')) {
        this.achievements.push('ACH02');
      }
    } else {
      this.rapid_stamp_streak = 0;
    }

    if (
      this.sponsored_wheel &&
      this.buildings.some(b => b.type === 'market' && b.zone === '科技區') &&
      this.buildings.some(b => b.type === 'wheel' && b.zone === '科技區')
    ) {
      if (!this.achievements.includes('ACH05')) {
        this.achievements.push('ACH05');
      }
    }

    this.used_events.push(e.id);
    this.pendingEvent = null;
    // Award the turn-12 exact-balance achievement before copying achievements into history.
    if (this.turn === CONFIG.rounds && this.net_budget === 0 && !this.achievements.includes('ACH06')) {
      this.achievements.push('ACH06');
    }
    const vfx = e.vfx_callback || 'DEFAULT_EFFECT';

    const rec = {
      turn: old_turn,
      action: action,
      event: e.id,
      event_title: e.title,
      vfx_callback: vfx,
      choice: event_choice,
      budget: Math.round(this.budget * 100) / 100,
      debt: Math.round(this.debt * 100) / 100,
      net_budget: this.net_budget,
      coverage: this.covered().size,
      tourism: this.tourism,
      admin: this.admin,
      complaints: this.complaints,
      meltdown_stage: this.meltdown_stage,
      achievements: [...this.achievements]
    };

    this.history.push(rec);
    this.turn++;
    if (this.turn > CONFIG.rounds) {
      this.finished = true;
    }
    return rec;
  }

  ending() {
    if (!this.finished) throw new Error('Complete 12 turns');
    const wheels = this.count('wheel');
    const markets = this.count('market');
    const shuttles = this.count('shuttle');
    const cov = this.covered();
    const op_income = this.buildings.filter(b => b.type === 'market' && b.ready_turn <= 12 && cov.has(b.zone)).length;
    const maintenance = shuttles * 0.5;

    // 1. Hidden Ending S
    if (this.tourism >= 75 && this.complaints <= 35 && this.net_budget <= 0) {
      return 'HIDDEN_S';
    }
    // 2. 一城五輪
    if (wheels >= 4 && maintenance > op_income) {
      return '一城五輪';
    }
    // 3. 預算追加申請中
    if (this.debt > 0 && this.budget < this.debt) {
      return '預算追加申請中';
    }
    // 4. 永遠開不完的協調會
    if (this.admin >= 75) {
      return '永遠開不完的協調會';
    }
    // 5. 全市愛情接駁網
    if (cov.size === 5 && shuttles >= 3) {
      return '全市愛情接駁網';
    }
    // 6. 摩天輪旁的夜市
    if (markets >= 3 && this.tourism >= 60) {
      return '摩天輪旁的夜市';
    }
    // 7. 招商成功，命名失敗
    if (this.tourism >= 70 && this.complaints >= 55) {
      return '招商成功，命名失敗';
    }
    // 8. 低調完成任務
    if (cov.size >= 4 && this.debt === 0 && this.complaints <= 40) {
      return '低調完成任務';
    }
    // 9. Default
    return '仍在協商中的愛情城市';
  }

  snapshot() {
    return {
      turn: this.turn,
      budget: Math.round(this.budget * 100) / 100,
      debt: Math.round(this.debt * 100) / 100,
      net_budget: this.net_budget,
      initial_net_budget: this.initialNetBudget,
      max_debt: this.max_debt,
      tourism: this.tourism,
      admin: this.admin,
      complaints: this.complaints,
      meltdown_stage: this.meltdown_stage,
      coverage: Array.from(this.covered()).sort(),
      buildings: [...this.buildings],
      achievements: [...this.achievements],
      ending: this.finished ? this.ending() : null
    };
  }
}
