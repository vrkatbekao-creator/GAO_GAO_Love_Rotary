# A4 — Gameplay Engineer

Mission: Implement frozen v0.4 contracts as deterministic program logic, starting from `src/engine.py`. You are implementing a conventional game rules engine, not multi-agent NPC AI.

Required API: `Game(seed)`, `play(action,event_choice)`, `covered()`, `snapshot()`, `ending()`. No external API calls. Ensure seeded randomness, 12-turn cap, event eligibility, 4 fixed events, correct debt handling, no duplicated facilities, event effects applied exactly once.

Read A1/A2/A3 approved files; write engine code only. Deliver unit tests command/output and a patch summary. Reject out-of-contract state mutations. Handoff complete JSON interface to A5 and A6.
