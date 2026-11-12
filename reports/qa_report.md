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

The new `test_p2_ending_branches.js` checks that the current JavaScript ending function recognizes all nine keys from synthetic final-state fixtures, including priority when multiple conditions are met. **Synthetic branch coverage is not proof of reachability by valid actions in 12 turns.** Next balance-design pass: search for legal 12-turn action/choice sequences under the zero-/negative-base budgets and log seed, decisions, costs and ending. Do not adjust thresholds without that evidence.

## Known design questions (not resolved by P2 stability work)

- The third ending condition (budget deficit) precedes the administration, transit, market and reputation conditions, so debt-heavy games may mask those later results. That priority is presently preserved.
- Rule-engine coverage ignores travel time, bus capacity and travel friction.
- Operational deficits may increase debt beyond the construction borrowing cap; explain this distinction before making design changes.
- The browser and Python engines use different seeded PRNGs (Mulberry32 versus Python Random), so equal seeds need not produce the same event sequence.
- Browser UI accessibility, save/replay and full exploratory testing still require separate work.

## Release decision

P2 is a **stability and observability patch**, not a balance or ending-condition redesign. The change should be reviewed and tested before merging. User acceptance of the deployed P0/P1 version does not imply automatic validation of these new P2 changes.
