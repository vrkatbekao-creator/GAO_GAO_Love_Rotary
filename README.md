# 《高高平等：人人有輪坐》 / GAO GAO Love Rotary

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Play the game:** https://vrkatbekao-creator.github.io/GAO_GAO_Love_Rotary/

A multilingual, satirical **12-round city-management browser game** about extravagant Ferris wheels, transit connections, administrative burden, and municipal finances. The rules and budgets are fictional; the game is not a model of actual public spending.

**繁體中文簡介：** 一款以 12 回合為單位的荒謬市政模擬遊戲。從零基或負基預算出發，在五個行政區建造摩天輪、接駁線與商圈，透過簽呈與政策事件累積觀光、財政、行政負擔及陳情壓力，最後進入九種結局之一。

## Play on desktop or mobile / 桌面與手機

The browser game runs directly from the `web/` directory with no server-side account or database. Languages: **Traditional Chinese, English, Japanese, French, Dutch**.

- **Desktop:** retro office desk, scrolling news ticker at the top, 3D diorama, sticky notes, and a collapsible construction/settings drawer on the right.
- **Mobile (portrait and landscape):** the mayor's quotes and sign-language interpreter stay at the top; the **3D city remains in the centre**; construction and settings open from compact right-side drawer handles; sticky notes move into a narrow left-side rail; the news ticker moves to the **bottom**.
- **3D touch control:** drag on the city to orbit the camera. Portrait framing moves the camera back to show more of the 3D model. The zone and shuttle selection lists open as scrollable **right-side sheets** on smaller screens.
- If WebGL is unavailable, the core 2D decision game remains accessible with a fallback notice.

The mobile layout has automated structure and rule checks; **real-device visual QA is still recommended**, especially on small-height landscape displays and iOS/Android browsers.

## Gameplay and fiscal challenge

There are five fictional zones and nine possible endings. Actions include Ferris-wheel construction, shuttle routes, markets, touring events, hearings, repayments, and rest. Event cards provide decisions with consequences. The same deterministic seed and action sequence reproduce the JavaScript engine's event flow.

**Starting net budgets (億):** `+0.5` (default), `−6`, `−12`, `−18`; a custom setting is available from +0.5 to −18. **The former +24 億 starting budget is obsolete and not the current game rule.** Negative starts are represented as initial debt rather than negative cash.

Wheel limits: one per zone, except **舊城區 (Old Town)**, which permits up to three. Duplicate shuttle connections are prohibited. The nine endings have reproducible legal 12-turn playthroughs under the +0.5 starting budget; see [ending reachability](reports/ending_reachability.md). This does not imply every ending has the same likelihood.

## Development and tests

- `web/index.html` — playable browser entry point
- `web/css/desk.css` — desktop and responsive mobile layout
- `web/js/diorama_3d.js` — locally bundled Three.js diorama, responsive camera, pointer orbit, scene reset
- `web/js/desk_ui.js` — actions, drawer, sticky-note placement and document-stamping interface
- `web/js/game_manager.js` — JavaScript rules and endings
- `web/tests/` — JavaScript rule, UI, 3D-lifecycle and ending regression suites
- `src/engine.py`, `tests/` — standalone Python rule-engine prototype and tests
- `data/`, `docs/`, `reports/` — canonical data, rules and QA evidence
- [About the project](ABOUT.md) — project description, creator, and licensing notes

To serve the game locally, from the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/web/` (or use `start_game.bat` on Windows). To run tests:

```bash
cd web
npm test
cd ..
python -m unittest discover -s tests -p test_engine.py -v
```

See [QA report](reports/qa_report.md) for which tests have been executed and which browser scenarios remain unverified. The browser and Python simulators use different PRNG algorithms, so the same numeric seed does not guarantee identical card sequences across engines.

## License / 授權

**MIT License — Copyright © 2026 VRKatBE (vrkatbekao-creator).**

The project's original code and associated documentation are made available under the [MIT License](LICENSE): use, modification and redistribution are permitted subject to preserving the copyright and license notice. `web/vendor/` contains third-party libraries, including Three.js, under their own copyright notices and MIT terms; those notices are not replaced by the game's attribution. The MIT license does not grant rights over third-party trademarks, names or likenesses.

## Fiction and creator

The fictional scenarios, budgets and administrative decisions are creative satire, not official Kaohsiung policy estimates, official campaign materials, or endorsements. Development agents (where referenced in historical documents) are **external software-development helpers**, not NPCs in the game.

Created and maintained under the GitHub account **[VRKatBE / vrkatbekao-creator](https://github.com/vrkatbekao-creator)**.
