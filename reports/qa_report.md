# A6-style independent QA checklist / local execution report

**Status:** rule engine + six scripted test-policy runs completed locally; not an independently launched LLM agent run. UI/browser testing not yet performed.

## Executed commands

```bash
python -m unittest discover -s tests -p test_engine.py -v
python tests/balance_sim.py
```

- 7 functional tests passed after fixing one debt-repayment test setup (the original test attempted repayment without available cash).
- 1,200 simulation games across six scripted policies (200 deterministic seeds each); raw aggregates in `reports/balance_report.json`.
- Core rules validated: 12 rounds, no repeated event ID per run, fixed chapter events, first wheel on turn 1, opening/coverage, duplicate guard, reproducible seeded output, basic debt repayment.

## Observations

- Balanced and transit/market-heavy scripts regularly achieve five-zone coverage, supporting the intended possibility of one wheel plus transport.
- Wheel-heavy scripts carry materially more debt in this sample than passive play, indicating a cost tradeoff.
- Passive scripts cover only one zone and receive the unresolved/deferred ending, rather than a successful route.
- Two alternative endings (`永遠開不完的協調會`, `招商成功，命名失敗`) did not occur in this particular strategy suite. **Their true reachability is not yet established.**

## Unresolved issues for future A1/A2/A6 passes

1. Ending reachability: targeted search for the two unobserved endings and adjust thresholds only after evidence.
2. Coverage currently ignores travel time, passenger capacity and travel friction; adequate for v0.4, may be coarse for a later version.
3. General financing behavior: mandatory operating costs can exceed the 12-unit construction credit limit; requires a clear consumer-facing explanation.
4. The illustrated `event` action and random event cards share a similar name; UI should rename the action to `巡迴活動` to prevent confusion.
5. No browser UI, full visual QA, accessibility audit, save/replay serialization, or actual external multi-agent orchestration has yet been run.

## Release recommendation

**Accept as v0.4 design package + rules-engine prototype, not as v0.4 finished browser game.** Retain QA issues as next work items.
