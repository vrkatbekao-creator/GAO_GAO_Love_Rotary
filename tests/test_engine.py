import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src'))
from engine import Game, EVENTS, CONFIG, ZONES


class EngineTests(unittest.TestCase):
    def test_event_database(self):
        self.assertEqual(len(EVENTS), 36)
        self.assertEqual(len(set(e['id'] for e in EVENTS)), 36)
        self.assertEqual(
            [(e['fixed_turn'], e['id']) for e in EVENTS if e.get('fixed_turn')],
            [(3, 'EV09'), (6, 'EV18'), (9, 'EV27'), (12, 'EV36')]
        )
        for e in EVENTS:
            self.assertEqual(len(e['choices']), 2)
            self.assertTrue(all(set(c['delta']) == {'budget', 'tourism', 'admin', 'complaints'} for c in e['choices']))
            self.assertIn('vfx_callback', e)

    def test_first_turn_constraint(self):
        g = Game()
        with self.assertRaisesRegex(ValueError, 'Turn 1'):
            g.play({'type': 'hearing'})

    def test_old_town_multi_wheel_achievement(self):
        g = Game(seed=10)
        g.play({'type': 'wheel', 'zone': '港灣區'})
        # Old town wheel 1
        g.play({'type': 'wheel', 'zone': '舊城區'})
        # Old town wheel 2
        g.play({'type': 'wheel', 'zone': '舊城區'})
        self.assertNotIn('ACH03', g.achievements)
        # Old town wheel 3
        g.play({'type': 'wheel', 'zone': '舊城區'})
        self.assertIn('ACH03', g.achievements)
        # 4th wheel in Old Town should fail
        with self.assertRaisesRegex(ValueError, 'Maximum wheels'):
            g.play({'type': 'wheel', 'zone': '舊城區'})

    def test_newtons_tears_achievement(self):
        g = Game(seed=20)
        g.play({'type': 'wheel', 'zone': '港灣區'})
        # Direct connection Harbor (0.5) to Mountain (4.0)
        g.play({'type': 'shuttle', 'zone': '港灣區', 'to_zone': '山城區'})
        self.assertIn('ACH01', g.achievements)

    def test_rapid_stamping_achievement(self):
        g = Game(seed=30)
        g.play({'type': 'wheel', 'zone': '港灣區'}, 'A', response_ms=500.0)
        g.play({'type': 'rest'}, 'A', response_ms=600.0)
        self.assertNotIn('ACH02', g.achievements)
        g.play({'type': 'rest'}, 'A', response_ms=800.0)
        self.assertIn('ACH02', g.achievements)

    def test_meltdown_stage(self):
        g = Game(seed=40)
        self.assertEqual(g.meltdown_stage(), 1)  # 24 >= 10
        g.budget = 5.0
        g.debt = 0.0
        self.assertEqual(g.meltdown_stage(), 2)  # 5 in [0, 10)
        g.debt = 8.0
        self.assertEqual(g.meltdown_stage(), 3)  # 5 - 8 = -3 < 0

    def test_hidden_ending_s(self):
        g = Game(seed=50)
        g.tourism = 80
        g.complaints = 20
        g.budget = 0
        g.debt = 5
        g.finished = True
        self.assertEqual(g.ending(), 'HIDDEN_S')

    def test_reproducible_rng(self):
        x = Game(seed=11)
        y = Game(seed=11)
        for t in range(12):
            act = {'type': 'wheel', 'zone': '港灣區'} if t == 0 else {'type': 'rest'}
            self.assertEqual(x.play(act, 'B'), y.play(act, 'B'))
        self.assertEqual(x.snapshot(), y.snapshot())


if __name__ == '__main__':
    unittest.main()
