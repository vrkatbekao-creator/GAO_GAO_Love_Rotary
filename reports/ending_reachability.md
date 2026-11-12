# Browser Game Ending Reachability — 12-Turn Constructive Evidence

**Date:** 13/11/2026  
**Engine:** `web/js/game_manager.js` (JavaScript, Mulberry32 seeded events)  
**Start:** +0.5 億 net budget for every case, not the obsolete +24 億 Python test scenario.

## Finding

**All nine canonical ending branches have an explicit, legal, reproducible 12-turn playthrough in the browser engine.** This is *existence evidence* for specific seeds and strategies, not proof that every ending is equally likely, easily discoverable, or obtainable from every negative-base scenario.

| Ending key | JS seed | Legally executable strategy |
|---|---:|---|
| `預算追加申請中` | 1 | Wheel in Harbor, several costly roaming events, then rest |
| `HIDDEN_S` | 1 | Harbor wheel plus four markets, tourism-oriented choices |
| `一城五輪` | 1 | Four wheels in separate zones, then one shuttle line |
| `全市愛情接駁網` | 6 | Harbor wheel; save and repay; four late-game shuttle links |
| `仍在協商中的愛情城市` | 4 | Harbor wheel, then rest with favorable event choices |
| `摩天輪旁的夜市` | 11 | Harbor wheel plus four early markets, then rest |
| `招商成功，命名失敗` | 2421 | Harbor wheel and one market; accumulate both tourism and complaints |
| `低調完成任務` | 14 | Harbor wheel; rest; repay debt; add three shuttle links late |
| `永遠開不完的協調會` | 3374 | Two wheels and a market early; choose high-administration event outcomes |

### Reproduction

Run from the `web/` directory:

```bash
node tests/test_p2_ending_playthroughs.js
# or run this and all other JS suites:
npm test
```

The regression file includes all **108 turn actions**, exact **108 event IDs**, and **108 A/B decisions** (9 cases × 12 turns). It asserts the chosen action is valid, the displayed event matches the resolved event, each history entry advances exactly one turn, and the final outcome is the expected ending.

The regression code was evaluated against the live GitHub JavaScript engine source in an isolated V8 runtime. The full Node `npm test` suite has **not** been executed by the connected GitHub environment, and these simulations do **not** replace browser interaction testing.

### Example final audited states

- **Night market (seed 11):** 4 markets, tourism 73, complaints 20, net budget **+2.57 億**; ending `摩天輪旁的夜市`.
- **Renaming failure (seed 2421):** tourism 72, complaints 57, net budget **+18.37 億**; ending `招商成功，命名失敗`.
- **Quiet completion (seed 14):** 4 covered zones, **zero debt**, complaints 0; ending `低調完成任務`.
- **Endless coordination (seed 3374):** administration **76**, net budget **+4.63 億**; ending `永遠開不完的協調會`.

## Interpretation of the previous balance report

The historical `reports/balance_report.json` contains six scripted Python policies × 200 seeds. Its observation of only **five** ending keys is a *sampling and strategy-coverage limitation*. It cannot establish that the other four are impossible. The constructive JavaScript traces above specifically resolve that reachability question for the default zero-base game.

## Remaining work

- Run the complete Node suite and perform browser smoke checks before publishing the P2 branch.
- Measure ending frequencies with *representative* valid player strategies (especially in the −6/−12/−18 億 starts); the nine targeted proofs must **not** be misrepresented as empirical outcome frequencies.
- Reassess priority order (especially `預算追加申請中` masking later achievements) only with playtesting evidence.
- The standalone Python simulator uses a different RNG, so identical numeric seeds need not reproduce JavaScript card order.
