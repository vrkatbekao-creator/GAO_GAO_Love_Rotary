"""Deterministic, offline rule engine for 高高平等 v1.0.

The game remains a scripted city-management satire. No NPCs are AI agents.
The external multi-agent workflow is a development methodology.
"""
from __future__ import annotations
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any
import json
import random

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / 'data/buildings.json').read_text(encoding='utf-8'))
EVENTS = json.loads((ROOT / 'data/events.json').read_text(encoding='utf-8'))
NARRATIVE = json.loads((ROOT / 'data/narrative_pack.json').read_text(encoding='utf-8'))
ZONES = CONFIG['zones']
ZONE_META = CONFIG.get('zone_metadata', {})
EVENTS_BY_ID = {e['id']: e for e in EVENTS}


@dataclass
class Building:
    type: str
    zone: str | None = None
    to_zone: str | None = None
    built_turn: int = 0
    ready_turn: int = 0


@dataclass
class Game:
    seed: int = 42
    turn: int = 1
    budget: float = 0.5
    debt: float = 0.0
    initial_net_budget: float | None = None
    tourism: int = 20
    admin: int = 20
    complaints: int = 20
    buildings: list[Building] = field(default_factory=list)
    used_events: list[str] = field(default_factory=list)
    history: list[dict[str, Any]] = field(default_factory=list)
    finished: bool = False
    achievements: list[str] = field(default_factory=list)
    hearing_count: int = 0
    rapid_stamp_streak: int = 0
    sponsored_wheel: bool = False

    def __post_init__(self):
        self.rng = random.Random(self.seed)
        if self.initial_net_budget is not None:
            if self.initial_net_budget >= 0:
                self.budget = round(float(self.initial_net_budget), 2)
                self.debt = 0.0
            else:
                self.budget = 0.0
                self.debt = round(abs(float(self.initial_net_budget)), 2)
        else:
            self.initial_net_budget = round(self.budget - self.debt, 2)
        self.start_debt = self.debt
        self.max_debt = max(50.0, self.start_debt + 40.0)

    @property
    def net_budget(self) -> float:
        return round(self.budget - self.debt, 2)

    def meltdown_stage(self) -> int:
        nb = self.net_budget
        if nb >= 10:
            return 1
        elif nb >= 0:
            return 2
        else:
            return 3

    def _paid(self, amount: float, *, allow_loan: bool = True, loan_ceiling: float | None = None):
        """Use cash first; automatic financing of shortfalls, never negative cash."""
        new = self.budget + amount
        if new < 0:
            if not allow_loan:
                raise ValueError('Insufficient budget')
            if loan_ceiling is not None and self.debt - new > loan_ceiling:
                raise ValueError('Construction credit limit exceeded')
            self.debt = round(self.debt - new, 2)
            self.budget = 0.0
        else:
            self.budget = round(new, 2)

    def count(self, btype: str, operational: bool = False) -> int:
        return sum(b.type == btype and (not operational or b.ready_turn <= self.turn) for b in self.buildings)

    def count_zone(self, btype: str, zone: str) -> int:
        return sum(b.type == btype and b.zone == zone for b in self.buildings)

    def covered(self) -> set[str]:
        """Zones with a ready wheel, or directly/indirectly connected by shuttle routes."""
        wheel_zones = {b.zone for b in self.buildings if b.type == 'wheel' and b.ready_turn <= self.turn and b.zone}
        adj: dict[str, set[str]] = {z: set() for z in ZONES}
        for b in self.buildings:
            if b.type == 'shuttle' and b.ready_turn <= self.turn and b.zone and b.to_zone:
                adj[b.zone].add(b.to_zone)
                adj[b.to_zone].add(b.zone)
        seen = set(wheel_zones)
        todo = list(wheel_zones)
        while todo:
            curr = todo.pop()
            for dest in adj[curr]:
                if dest not in seen:
                    seen.add(dest)
                    todo.append(dest)
        return seen

    def eligible(self, e: dict) -> bool:
        pre = e.get('precondition', {})
        min_wheels = pre.get('min_ferris_wheels', pre.get('min_operational_wheels', 0))
        min_shuttles = pre.get('min_shuttles', 0)
        min_markets = pre.get('min_markets', 0)
        return (self.count('wheel', True) >= min_wheels and
                self.count('shuttle') >= min_shuttles and
                self.count('market') >= min_markets)

    def select_event(self) -> dict:
        candidates = [
            e for e in EVENTS
            if e['chapter'] == (self.turn - 1) // 3 + 1
            and e['id'] not in self.used_events
            and self.eligible(e)
        ]
        fixed = [e for e in candidates if e.get('fixed_turn') == self.turn]
        if fixed:
            return fixed[0]
        pool = [e for e in candidates if e.get('fixed_turn') is None]
        if not pool:
            raise ValueError(f'No eligible events in turn {self.turn}')
        return self.rng.choice(pool)

    def _validate_action(self, a: dict):
        kind = a.get('type')
        if self.turn == 1 and kind != 'wheel':
            raise ValueError('Turn 1 must choose the first wheel location')
        if kind in ('wheel', 'market', 'event'):
            if a.get('zone') not in ZONES:
                raise ValueError(f"Unknown zone: {a.get('zone')}")
        if kind == 'wheel':
            zone = a['zone']
            limit = CONFIG['buildings']['wheel'].get('max_per_zone_override', {}).get(zone, CONFIG['buildings']['wheel']['max_per_zone'])
            if self.count_zone('wheel', zone) >= limit:
                raise ValueError(f'Maximum wheels ({limit}) exceeded for {zone}')
        if kind == 'market':
            zone = a['zone']
            if any(b.type == 'market' and b.zone == zone for b in self.buildings):
                raise ValueError('One market maximum per zone')
        if kind == 'shuttle':
            z = a.get('zone')
            w = a.get('to_zone')
            if z not in ZONES or w not in ZONES or z == w:
                raise ValueError('Bad shuttle endpoints')
            if any(b.type == 'shuttle' and {b.zone, b.to_zone} == {z, w} for b in self.buildings):
                raise ValueError('Duplicate shuttle link')
        if kind not in ('wheel', 'market', 'shuttle', 'event', 'hearing', 'repay', 'rest'):
            raise ValueError(f'Unknown action: {kind}')
        if kind in CONFIG['buildings']:
            shortfall = max(0.0, float(CONFIG['buildings'][kind]['cost']) - self.budget)
            if self.debt + shortfall > self.max_debt:
                raise ValueError('Construction credit limit exceeded')

    def _build(self, a: dict):
        kind = a['type']
        if kind == 'rest':
            return
        if kind == 'repay':
            amount = round(min(self.debt, self.budget, max(0.0, float(a.get('amount', 2)))), 2)
            self.budget = round(self.budget - amount, 2)
            self.debt = round(self.debt - amount, 2)
            return
        row = CONFIG['buildings'][kind]
        self._paid(-float(row['cost']), loan_ceiling=self.max_debt)
        if kind in ('wheel', 'shuttle', 'market'):
            self.buildings.append(Building(kind, a.get('zone'), a.get('to_zone'), self.turn, self.turn + row['lead_turns']))
            if kind == 'shuttle':
                pair = {a.get('zone'), a.get('to_zone')}
                if pair == {'港灣區', '山城區'} and 'ACH01' not in self.achievements:
                    self.achievements.append('ACH01')
            if kind == 'wheel' and a.get('zone') == '舊城區':
                if self.count_zone('wheel', '舊城區') >= 3 and 'ACH03' not in self.achievements:
                    self.achievements.append('ACH03')
        elif kind == 'event':
            self.tourism += row['tourism_once']
            self.complaints += row['complaints_once']
        elif kind == 'hearing':
            self.admin += row['admin_once']
            self.complaints += row['complaints_once']
            self.hearing_count += 1
            if self.hearing_count >= 5 and 'ACH04' not in self.achievements:
                self.achievements.append('ACH04')

    def _open_and_operate(self):
        for b in self.buildings:
            if b.ready_turn == self.turn:
                self.tourism += CONFIG['buildings'][b.type].get('tourism_on_open', 0)
        net = float(CONFIG['income_per_round']) - round(self.debt * 0.05, 2)  # 5% fictional interest
        for b in self.buildings:
            if b.ready_turn > self.turn:
                continue
            p = CONFIG['buildings'][b.type]
            net -= p.get('maintenance_per_round', 0)
            net += p.get('operating_gross_per_round', 0)
            if b.type == 'market' and b.zone in self.covered():
                net += p.get('gross_if_covered_per_round', 0)
        self._paid(round(net, 2))

    def _clamp(self):
        self.tourism = max(0, min(100, self.tourism))
        self.admin = max(0, min(100, self.admin))
        self.complaints = max(0, min(100, self.complaints))

    def play(self, action: dict, event_choice: str = 'A', response_ms: float = 2000.0) -> dict[str, Any]:
        if self.finished:
            raise ValueError('Game is already finished')
        self._validate_action(action)
        e = self.select_event()
        if event_choice not in ('A', 'B'):
            raise ValueError('Invalid event choice')
        card_choice = next(c for c in e['choices'] if c['id'] == event_choice)
        old_turn = self.turn
        self._build(action)

        if e['id'] == 'EV21' and event_choice == 'A':
            self.sponsored_wheel = True

        for k, v in card_choice['delta'].items():
            if k == 'budget':
                if e['id'] == 'EV35' and event_choice == 'A':
                    repay = min(2.0, self.debt)
                    self._paid(-repay)
                    self.debt = round(self.debt - repay, 2)
                else:
                    self._paid(float(v))
            else:
                setattr(self, k, getattr(self, k) + v)

        self._open_and_operate()
        self._clamp()

        if response_ms < 1000.0:
            self.rapid_stamp_streak += 1
            if self.rapid_stamp_streak >= 3 and 'ACH02' not in self.achievements:
                self.achievements.append('ACH02')
        else:
            self.rapid_stamp_streak = 0

        if self.sponsored_wheel and any(b.type == 'market' and b.zone == '科技區' for b in self.buildings) and any(b.type == 'wheel' and b.zone == '科技區' for b in self.buildings):
            if 'ACH05' not in self.achievements:
                self.achievements.append('ACH05')

        self.used_events.append(e['id'])
        vfx = e.get('vfx_callback', 'DEFAULT_EFFECT')

        rec = {
            'turn': old_turn,
            'action': action,
            'event': e['id'],
            'event_title': e['title'],
            'vfx_callback': vfx,
            'choice': event_choice,
            'budget': round(self.budget, 2),
            'debt': round(self.debt, 2),
            'net_budget': self.net_budget,
            'coverage': len(self.covered()),
            'tourism': self.tourism,
            'admin': self.admin,
            'complaints': self.complaints,
            'meltdown_stage': self.meltdown_stage(),
            'achievements': list(self.achievements)
        }
        self.history.append(rec)
        self.turn += 1
        if self.turn == 13:
            self.finished = True
            if self.net_budget == 0 and 'ACH06' not in self.achievements:
                self.achievements.append('ACH06')
        return rec

    def ending(self) -> str:
        if not self.finished:
            raise ValueError('Complete 12 turns')
        wheels = self.count('wheel')
        markets = self.count('market')
        shuttles = self.count('shuttle')
        op_income = sum(1 for b in self.buildings if b.type == 'market' and b.ready_turn <= 12 and b.zone in self.covered())
        maintenance = shuttles * 0.5

        # 1. Hidden Ending S
        if self.tourism >= 75 and self.complaints <= 35 and self.net_budget <= 0:
            return 'HIDDEN_S'
        # 2. 一城五輪
        if wheels >= 4 and maintenance > op_income:
            return '一城五輪'
        # 3. 預算追加申請中
        if self.debt > 0 and self.budget < self.debt:
            return '預算追加申請中'
        # 4. 永遠開不完的協調會
        if self.admin >= 75:
            return '永遠開不完的協調會'
        # 5. 全市愛情接駁網
        if len(self.covered()) == 5 and shuttles >= 3:
            return '全市愛情接駁網'
        # 6. 摩天輪旁的夜市
        if markets >= 3 and self.tourism >= 60:
            return '摩天輪旁的夜市'
        # 7. 招商成功，命名失敗
        if self.tourism >= 70 and self.complaints >= 55:
            return '招商成功，命名失敗'
        # 8. 低調完成任務
        if len(self.covered()) >= 4 and self.debt == 0 and self.complaints <= 40:
            return '低調完成任務'
        # 9. Default
        return '仍在協商中的愛情城市'

    def snapshot(self) -> dict[str, Any]:
        return {
            'turn': self.turn,
            'budget': round(self.budget, 2),
            'debt': round(self.debt, 2),
            'net_budget': self.net_budget,
            'initial_net_budget': self.initial_net_budget,
            'max_debt': self.max_debt,
            'tourism': self.tourism,
            'admin': self.admin,
            'complaints': self.complaints,
            'meltdown_stage': self.meltdown_stage(),
            'coverage': sorted(self.covered()),
            'buildings': [asdict(b) for b in self.buildings],
            'achievements': list(self.achievements),
            'ending': self.ending() if self.finished else None
        }


if __name__ == '__main__':
    g = Game(seed=42)
    actions = [
        {'type': 'wheel', 'zone': '港灣區'},
        {'type': 'market', 'zone': '港灣區'},
        {'type': 'shuttle', 'zone': '港灣區', 'to_zone': '舊城區'},
        {'type': 'shuttle', 'zone': '舊城區', 'to_zone': '山城區'},
        {'type': 'shuttle', 'zone': '舊城區', 'to_zone': '郊區'},
        {'type': 'shuttle', 'zone': '港灣區', 'to_zone': '科技區'},
        {'type': 'market', 'zone': '舊城區'},
        {'type': 'market', 'zone': '山城區'},
        {'type': 'hearing'},
        {'type': 'hearing'},
        {'type': 'event', 'zone': '港灣區'},
        {'type': 'rest'}
    ]
    for act in actions:
        res = g.play(act, 'A', response_ms=500.0)
        print(f"Turn {res['turn']}: {res['event']} -> Net: {res['net_budget']}, Stage: {res['meltdown_stage']}")
    print('ENDING:', g.ending())
    print('ACHIEVEMENTS:', g.achievements)
