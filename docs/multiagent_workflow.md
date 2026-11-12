# Multi-agent orchestration: how to build v0.4, not NPC behavior

## Goal and non-goal

The development agents act as a software production team with isolated scopes, file-level ownership, deterministic handoff contracts and test gates. **Do not rewrite the game as a multi-agent society simulator.** The player's game remains a 12-turn event/card/building system. No external agent framework is required to run `src/engine.py`.

## Workflow DAG

```
                        Product brief / user decisions
                                      |
                               Orchestrator
                                      |
                  +-------------------+-------------------+
                  |                   |                   |
            A1 Game Rules       A2 Economy           A3 Narrative
                  |                   |                   |
                  +---- contract/schema freeze ----------+
                                      |
                               A4 Engineering
                                      |
                             A5 UI/UX integration
                                      |
                              A6 QA / Red Team
                                      |
                         Orchestrator acceptance
```

A1/A2/A3 may **propose changes in parallel**, but none may change the shared format after the contract freeze without an explicit versioned change request. A6 is intentionally independent from A4 and is required to reproduce every purported fix.

## Ownership and allowed edits

| Agent | Owns | Reads | Must not touch without review |
|---|---|---|---|
| A1 | `docs/game_rules.md` | all data and outcomes | live engine implementation |
| A2 | `data/buildings.json`, `reports/balance_report.json` | gameplay rules, tests | narrative text |
| A3 | `data/events.json` | rule schema and editorial requirements | economy rules, engine |
| A4 | `src/engine.py` | `docs/game_rules.md`, `data/*` | approved data, QA verdicts |
| A5 | `docs/ui_spec.md` | final rules and engine API | authoritative game math |
| A6 | `tests/*`, `reports/qa_report.md` | all artifacts | production engine without bug ticket |
| Orchestrator | `README.md`, release notes | all artifacts | unilateral gameplay scope changes |

## Handoff contracts

### Contract C1 — Rules → Engine

Input: canonical rule document and `data/buildings.json`.
Output: Game state with `turn`, `budget`, `debt`, `tourism`, `admin`, `complaints`, `buildings`, `used_events`, `history`; methods `play(action, choice)`, `covered()`, `ending()`.
Acceptance: first wheel in turn 1; ready turn 3; 12 turns; no second player action per round.

### Contract C2 — Events → Engine

Each event JSON object has `{id, chapter, fixed_turn|null, title, fictional, precondition, choices:[{id,label,delta:{budget,tourism,admin,complaints}}]}`. No unapproved spontaneous resource changes.
Acceptance: exactly 36 unique IDs; chapter-specific eligibility; fixed EV09/EV18/EV27/EV36 on 3/6/9/12; triggers checked against game state.

### Contract C3 — Engine → UI

Game state and event choices are serializable JSON. UI issues actions, never directly mutates state. The visible UI labels all gameplay values as fictional.
Acceptance: five-zone map selection, action previews, chapter/turn indicator, event A/B decision, balance deltas, ending report; 10-inch tablet usable layout.

### Contract C4 — QA → Orchestrator

Testing report must enumerate tested strategies, seeds, functional results, uncovered failures and a release recommendation. A test that is not run must be marked **not tested**.

## Four stages

1. **Definition:** A1 freezes 12-turn rules; A2 and A3 inspect numeric and event contracts. Gate: no unresolved schema disagreements.
2. **Implementation:** A4 consumes frozen data and implements deterministic core. Gate: all unit tests pass and game is replayable from seed.
3. **Experience:** A5 implements browser-facing UI and tutorial after core freeze. Gate: user can finish 12 turns and see a traceable ending.
4. **Adversarial review:** A6 independently runs at least six strategies, boundary tests, mobile/tablet checks and data audits. Gate: no severe softlocks or impossible mandatory actions; known issues documented.

## Change request protocol

Every proposed modification uses a short record: `CR-id`, rationale, affected contracts, old vs new value, test impact, sign-off. Example: changing the 3-round wheel construction delay affects the fixed EV09 event, budget model, and tutorial; A1/A2/A3/A4/A6 must review before merge.

## Definition of done for v0.4

- Design spec and data schemas consistent
- All 36 cards serialized and content-checked
- 12-turn core with seeded RNG and event eligibility
- At least 1,000 scripted simulation runs, with sample size reported
- Functional test suite green
- Observed bottlenecks documented, no claims of solved balance without evidence
- UI requirements prepared for next implementation phase

## How to run with an external multi-agent tool

Load `agents/orchestrator.md` as coordinating instruction; assign specialist agent prompts separately. Agents receive only their permitted files and current contract revision. Require patch-based outputs, explicit test commands, and A6 independent review before merging. This kit does not impersonate real independent agent executions.
