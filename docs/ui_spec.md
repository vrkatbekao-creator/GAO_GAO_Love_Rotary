# A5 UI/UX handoff — v0.4 design, not yet implemented

## Device goal

Desktop first, but 10-inch tablet must remain fully usable without hover-only interactions. No dense text-only event board. One playable page with a 12-turn progress rail.

## Primary layout

```
+-----------------------------------------------------+
| LOGO  Round 07/12 | Chapter 3 | B 14 | Debt 3        |
+-------------------------+---------------------------+
| Five-zone map           | Action panel              |
| [山城]    [科技]          | wheel / shuttle / market  |
|      [港灣🎡]            | event / hearing / repay   |
| [舊城]    [郊區]          | Cost and forecast         |
+-------------------------+---------------------------+
| Resource strip: tourism | admin | complaints | cover |
+-----------------------------------------------------+
| Event card: 2 options; costs and outcomes visible    |
+-----------------------------------------------------+
| This turn's ledger: build, event, income, maintenance|
+-----------------------------------------------------+
```

## Screens

1. Start screen: fiction disclaimer, tutorial, seeded/new game option.
2. Main map: each zone clickable, visual indicator for wheel, market, shuttle, coverage; currently selected node highlighted.
3. Action drawer: show cash cost, lead time, maintenance, loan implication before confirmation.
4. Event panel: fictional newspaper title, two response options, effects preview and confirmation.
5. Between chapters: small collage-style fictional municipal memo, summary of actual game data.
6. Ending: narrative plus detailed ledger and other observable results. Allow re-run with same seed.

## UX constraints

- Avoid icons as the only means of conveying meaning; pair icon with text.
- Do not reveal a state change until the rules engine confirms it.
- If construction credit is exhausted, visibly disable new builds and explain why; keep `rest`, `hearing` (if affordable) and repayment available as appropriate.
- Keep the map a schematic fictional zone layout, not a real administrative boundary.
- Distinguish planned construction from completed operations with clear visual states.
- Keep copy short on mobile; show one decision at a time.

## Deliverable gates

This file provides UI specifications only. **No HTML implementation, touch testing or visual QA has been completed in v0.4.**
