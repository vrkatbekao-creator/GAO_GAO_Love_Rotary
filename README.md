# 《高高平等：人人有輪坐》 — v0.4 multi-agent development kit

**Version:** v0.4 design + deterministic engine prototype (2026-11-05)

## Important distinction

The **AI agents design and review the game**. They are **not NPCs inside the game**. The playable game remains a 12-round, 5-zone, policy-event-driven management satire.

This directory is a handoff package for an external multi-agent coding system. It supplies six specialist role specifications, an orchestrator workflow, canonical game data, a runnable rules prototype, and reproducible tests. **The roles have not been instantiated as six independently running LLMs in this session.** The provided Python tests are real and were executed; the role prompt files are ready for an external agent runner.

## File map

- `agents/orchestrator.md` — ownership, dependency graph, review/merge process
- `agents/A1_game_design.md` — gameplay specialist prompt
- `agents/A2_economy.md` — balancing specialist prompt
- `agents/A3_narrative.md` — event/story specialist prompt
- `agents/A4_engineering.md` — implementation specialist prompt
- `agents/A5_ui_ux.md` — interface specialist prompt
- `agents/A6_qa_redteam.md` — independent QA specialist prompt
- `docs/game_rules.md` — v0.4 gameplay contract
- `docs/multiagent_workflow.md` — staged orchestration, contracts and gates
- `docs/ui_spec.md` — UI/UX structure for future playable browser build
- `data/events.json` — 36 Chinese event cards, 4 fixed chapter events
- `data/buildings.json` — cost and economic model
- `src/engine.py` — playable-in-code rule engine; no browser UI yet
- `tests/test_engine.py` — functional unit tests
- `tests/balance_sim.py` — six scripted (non-LLM) test policies × 200 seeds
- `reports/balance_report.json` — measured simulation results
- `reports/qa_report.md` — validation findings and gaps

## Run locally (Python 3.10+)

```bash
python -m unittest discover -s tests -p test_engine.py -v
python tests/balance_sim.py
python src/engine.py
```

There are no external Python dependencies.

## Policy/fiction notice

The fictional zones, costs, NPC offices, event texts, budgets and consequences are gameplay inventions. Historical policy concepts discussed in the planning conversation were from different times and sources; the game does not represent the fictional combined setting as a single actual campaign platform. The test utilities do not rank or score real politicians.
