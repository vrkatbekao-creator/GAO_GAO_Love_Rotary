# 《高高平等：人人有輪坐》 — playable browser prototype

**Version:** Public browser prototype using zero-/negative-base fiscal rules. P0/P1 fixes were merged into `master`; subsequent P2 stability and ending-audit changes undergo separate review.

**Play:** https://vrkatbekao-creator.github.io/GAO_GAO_Love_Rotary/ (published GitHub Pages game; user-confirmed working).

**QA:** See `reports/qa_report.md` for historical simulations, user-confirmed manual smoke checks, and tests that still need to be executed.

## Important distinction

The **AI agents design and review the game**. They are **not NPCs inside the game**. The playable game remains a 12-round, 5-zone, policy-event-driven management satire. The default start is **+0.5 億 net budget**, with selectable **−6 / −12 / −18 億** negative-base scenarios and custom starts within +0.5 to −18; the old +24 億 opening is legacy test data, not the current default.

This repository includes a playable browser prototype in `web/`, a standalone Python engine, canonical data, and reproducible tests. External development agents are **not** in-game NPCs. The previously documented `agents/` role prompts were removed from the current repository; the multi-agent workflow document remains as historical planning material. Prior Python QA results are recorded in `reports/`, but they are not a substitute for browser regression testing.

## File map

- `web/index.html` — playable browser entry point, 3D diorama and document-stamping interaction
- `web/js/game_manager.js` — browser rules engine, events and endings
- `web/js/desk_ui.js` — turn UI and language / budget controls
- `web/js/diorama_3d.js` — Three.js visualization and scene reset
- `web/tests/` — JavaScript unit and regression checks
- `docs/game_rules.md` — current canonical fiscal rules
- `docs/multiagent_workflow.md` — historical external development-agent design
- `data/events.json` / `data/buildings.json` — canonical gameplay data
- `src/engine.py` — standalone Python simulation engine
- `tests/` / `reports/` — Python tests and previously recorded balance simulation results

## Run locally (Python 3.10+)

```bash
python -m unittest discover -s tests -p test_engine.py -v
python tests/balance_sim.py
python src/engine.py
```

To play in a browser, run `python -m http.server 8000` in the repo root and open `http://localhost:8000/web/` (or use `start_game.bat` on Windows). For JavaScript tests run `cd web && npm test` with Node.js installed. Python has no external dependencies; the browser bundles Three.js locally. **Browser QA and cross-engine parity remain to be verified.**

## Policy/fiction notice

The fictional zones, costs, NPC offices, event texts, budgets and consequences are gameplay inventions. Historical policy concepts discussed in the planning conversation were from different times and sources; the game does not represent the fictional combined setting as a single actual campaign platform. The test utilities do not rank or score real politicians.
