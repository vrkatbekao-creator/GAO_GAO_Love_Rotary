# QA evidence and release checks

**Updated: 2026-11-13**  
**Scope:** browser game (JavaScript/Three.js) + historical standalone Python simulation evidence.

## Evidence levels — do not conflate them

1. **Historical Python execution report (v0.4 prototype).** The earlier QA report recorded 7 functional Python tests passing, plus 1,200 simulated games across 6 scripted strategies and 200 seeds per strategy. Those executions have **not been repeated** for the current browser release. Their stored aggregates are in `reports/balance_report.json`.
2. **User-confirmed browser manual checks (after P0/P1 merge).** Repeated stamping, negative-start budget reset, 3D scene clearing, duplicate shuttle links, and the subsequent GitHub Pages deployment were reported working. A prior Ferris-wheel capacity failure led to the P0/P1 UI/engine synchronization corrections; capacity should be checked again against the merged release.
3. **Committed automated JavaScript tests.** `web/package.json` wires the engine, 9-ending localization/rendering, P0/P1, wheel capacity, and P2 ending/3D-lifecycle tests into `npm test`. **No successful CI or local execution of the full current suite is recorded in this repository.** Do not label these passing until run.

## Current release check commands

```bash
cd web
npm test
cd ..
python -m unittest discover -s tests -p test_engine.py -v
```

Use a local static server to verify the browser (run `python -m http.server 8000` from the repository root and open `http://localhost:8000/web/`). For GitHub Pages, use the published game link in the README.

### Browser smoke checklist

- [ ] Zero-base (+0.5) and negative-base (−6/−12/−18) restarts preserve the selected start, reset counters, and clear 3D objects
- [ ] Double-click/rapid stamping settles a single turn and displays the event actually resolved
- [ ] Old Town supports wheels 1–3 but rejects wheel 4; every other zone rejects wheel 2
- [ ] Duplicate shuttle links and credit-limit violations consume no turn and spawn no 3D object
- [ ] WebGL-disabled browser shows a localized 3D warning; the action menu and 12-turn settlement still work
- [ ] Resize with WebGL unavailable raises no exception; restarting cancels stale citizen-hearing animations
- [ ] End of round 12 displays a final dossier, not coverage from buildings becoming ready in round 13

## Ending reachability — evidence, not assumption

`reports/balance_report.json` records **five of the nine** ending keys in the historical 1,200-game strategy sample:

- `預算追加申請中` — 580
- `HIDDEN_S` — 343
- `一城五輪` — 61
- `全市愛情接駁網` — 17
- `仍在協商中的愛情城市` — 199

Four ending keys **were not observed** in that sample:

- `永遠開不完的協調會`
- `摩天輪旁的夜市`
- `招商成功，命名失敗`
- `低調完成任務`

The `test_p2_ending_branches.js` suite checks the nine ending *conditions* using synthetic states. This is distinct from the following independent **constructive reachability evidence**.

### New: all nine endings reached through legal zero-base JavaScript playthroughs (13/11/2026)

The new `web/tests/test_p2_ending_playthroughs.js` replays nine **complete and legal** 12-round games with exact event IDs and A/B decisions. It asserts validation and final outcome without mutating the engine's internal state.

| Ending | JavaScript seed |
|---|---:|
| `預算追加申請中` | 1 |
| `HIDDEN_S` | 1 |
| `一城五輪` | 1 |
| `全市愛情接駁網` | 6 |
| `仍在協商中的愛情城市` | 4 |
| `摩天輪旁的夜市` | 11 |
| `招商成功，命名失敗` | 2421 |
| `低調完成任務` | 14 |
| `永遠開不完的協調會` | 3374 |

See `reports/ending_reachability.md` for reproducible strategy descriptions and audited states.

**Execution evidence:** The actual `GameManager`, P0/P1, P2 synthetic-ending, Ferris-wheel picker, and new nine-ending playthrough tests were executed from the fetched GitHub JavaScript source in an isolated V8 runtime. The P2 Three.js lifecycle test logic was also evaluated with minimal Three.js mocks; it was **not** an actual WebGL render test. The full `npm test` and real-browser WebGL QA remain unexecuted.

**What this does and does not prove:** Every ending is attainable for *at least one seed* under the +0.5 億 default fiscal scenario. It does not prove equal probability, high discoverability, or reachability under all three negative-base starting budgets. Historical counts above remain valid as historical sampling statistics, not contradictions.

Do not rebalance thresholds solely because four endings were absent from the old six-strategy simulation suite.

## Known design questions (not resolved by P2 stability work)

- The third ending condition (budget deficit) precedes the administration, transit, market and reputation conditions, so debt-heavy games may mask those later results. That priority is presently preserved.
- Rule-engine coverage ignores travel time, bus capacity and travel friction.
- Operational deficits may increase debt beyond the construction borrowing cap; explain this distinction before making design changes.
- The browser and Python engines use different seeded PRNGs (Mulberry32 versus Python Random), so equal seeds need not produce the same event sequence.
- Browser UI accessibility, save/replay and full exploratory testing still require separate work.

## Release decision

P2 is a **stability and observability patch**, not a balance or ending-condition redesign. The change should be reviewed and tested before merging. User acceptance of the deployed P0/P1 version does not imply automatic validation of these new P2 changes.
