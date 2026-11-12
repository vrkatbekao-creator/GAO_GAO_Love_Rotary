# GDD v1.0 Multi-Agent Task Assignments & Contract Delta (v0.4 → v1.0)

This file digests **Blueprint V1 (`docs/gdd_v1.md`)** against the **v0.4 Multi-Agent Kit** and assigns concrete deliverables, schema updates, and milestone gates to each agent role (`Orchestrator`, `A1`–`A6`).

---

## 1. Key Delta Analysis (v0.4 Prototype vs. Blueprint V1 / GDD v1.0)

| Dimension | v0.4 Baseline | Blueprint V1 (GDD v1.0) Requirement | Contract Change ID |
|---|---|---|---|
| **Runtime & Stack** | Offline Python CLI prototype (`src/engine.py`) | Browser-based 2D Desk + 3D Low-Poly Diorama (`Vanilla JS`, `HTML5/CSS3`, `Three.js`, `Web Audio API`) with `GameManager` state machine | `CR-01` |
| **5 Zones & 3D Elevations** | Flat list: `港灣區`, `舊城區`, `山城區`, `科技區`, `郊區` | 3D Diorama height map: `港灣區` (`0.5`), `舊城區` (`1.0`), `郊區發展區` (`1.5`), `科技區` (`2.0`), `山城區` (`4.0`) | `CR-02` |
| **Zone Wheel Cap** | `max_per_zone: 1` for wheels | Achievement #3 (`日照權是什麼`) requires placing **3 Ferris wheels in `舊城區`** (with heavy 3D mesh clipping) | `CR-03` |
| **Budget & Deficit Presentation** | `budget >= 0` + `debt` with 5% interest and 12-unit construction loan cap | Net Budget (`budget - debt`, displayed as signed LED value allowing negative/deficit) triggers physical breakdown VFX, court seizure strips, and Finance Director meltdown stages | `CR-04` |
| **Event Triggers & VFX Callbacks** | `precondition` (`min_operational_wheels`, `min_shuttles`, `min_markets`) | Support alias `min_ferris_wheels`, `vfx_callback` (e.g., `HIGHLIGHT_ALL_WHEELS`), corporate naming flag (`EV21` choice A → `sponsored_wheel`), and news ticker / mayor quotes | `CR-05` |
| **Endings & Achievements** | 8 endings (`一城五輪`, etc.), 2 unobserved in sim | Add **Hidden Ending S《愛情無價，市府破產》** (high satisfaction + net budget ≤ 0), 2-page dossier UI (Propaganda Polaroid vs. Thermal Receipt), and **6 Steam Achievements** | `CR-06` |

---

## 2. Specialist Agent Task Assignments

### 🧭 Orchestrator (`agents/orchestrator.md`)
- **Role:** Coordinate the 4-Stage / 4-Week MVP pipeline, enforce contract freezes (`C1`–`C4`), and prevent scope creep into autonomous NPC LLMs (Pixel Citizens are deterministic state-driven particle/sprite agents, not LLM agents).
- **Tasks:**
  1. Freeze `CR-01` through `CR-06` across `docs/game_rules.md`, `data/buildings.json`, and `data/events.json`.
  2. Sequence execution across the 4 MVP milestones (`Week 1` → `Week 4`).
  3. Gate release on `A6` verification of both Python parity tests and browser/UI/achievement checks.

---

### 🎲 A1 — Game Designer (`agents/A1_game_design.md`)
- **Owns:** `docs/game_rules.md`
- **Assigned Tasks:**
  1. **Zone Elevation & Metadata (`CR-02`):** Add canonical elevation (`0.5`, `1.0`, `1.5`, `2.0`, `4.0`) and terrain tags (`water`, `dense_grid`, `flat_grass`, `neon_array`, `steep_mountain`) to the 5 zones (`郊區` display name aliased as `郊區發展區`).
  2. **Old Town Multi-Wheel Rule (`CR-03`):** Update wheel placement rules so `舊城區` allows up to 3 wheels (or global `max_per_zone: 3` for wheels) to unlock Achievement #3 (`日照權是什麼`), specifying how extra wheels affect clipping and maintenance.
  3. **Hidden Ending S & Ending Priority (`CR-06`):** Define exact trigger thresholds for **Hidden Ending S《愛情無價，市府破產》** (e.g., `tourism >= 75`, `complaints <= 35`, and net budget `budget - debt <= 0`) and adjust thresholds for the 2 previously unobserved endings (`永遠開不完的協調會`, `招商成功，命名失敗`).
  4. **6 Achievements Specification (`CR-06`):** Formalize deterministic state predicates for all 6 achievements:
     - `ACH01` **牛頓的眼淚**: Shuttle built directly between `港灣區` (`0.5`) and `山城區` (`4.0`).
     - `ACH02` **無情的蓋章機器**: 3 consecutive event stamps within `< 1000ms` of document entry.
     - `ACH03` **日照權是什麼**: 3 wheels built in `舊城區`.
     - `ACH04` **會議時空暫停之術**: `hearing` action executed `>= 5` times in one 12-turn game.
     - `ACH05` **高科技賽博夜市**: `科技區` has a `market`, a `wheel`, and corporate naming accepted (`EV21` Choice A).
     - `ACH06` **國庫精算大師**: Final net budget (`budget - debt`) at end of Turn 12 equals `0`.

---

### 📊 A2 — Economy & Simulation Analyst (`agents/A2_economy.md`)
- **Owns:** `data/buildings.json`, `reports/balance_report.json`
- **Assigned Tasks:**
  1. **Update `data/buildings.json`:**
     - Add `zone_meta` with `elevation` and `display_name` for each of the 5 zones.
     - Update wheel `max_per_zone` (or per-zone override for `舊城區`: 3).
     - Define Finance Director meltdown thresholds (`stage_1`, `stage_2`, `stage_3`) based on net budget / debt ratio.
  2. **Re-run & Expand `tests/balance_sim.py`:**
     - Add test policies targeting the 2 unobserved endings (`admin_overload`, `high_tourism_high_complaint`), **Hidden Ending S**, and the **6 achievements**.
     - Verify whether `國庫精算大師` (`net_budget == 0`) and `Hidden Ending S` are mathematically reachable across 1,000+ seeds.

---

### 📜 A3 — Narrative & Event Designer (`agents/A3_narrative.md`)
- **Owns:** `data/events.json`, `data/generate_events.py`
- **Assigned Tasks:**
  1. **Event VFX & Precondition Schema (`CR-05`):**
     - Add `vfx_callback` field to all 36 events in `data/events.json` (e.g., `HIGHLIGHT_ALL_WHEELS`, `CAMERA_SHAKE`, `SPAWN_PETITION_RAIN`, `SPONSOR_NEON_WHEEL` on `EV21`).
     - Support `min_ferris_wheels` alongside `min_operational_wheels`.
  2. **Dialogue & Broadcast Content Pack:**
     - Embed the **5 Mayor Quotes (市長 5 大幹話語錄)**, **News Ticker Headlines (跑馬燈快訊 & 局處切割)**, **Sign-Language Interpreter States** (`calm`, `frown`, `facepalm`, `strike_x`), and **Finance Director 3-Stage Meltdown Notes (財政局長崩潰語錄)** into structured JSON data (`data/narrative_pack.json` or inside `data/events.json`).
  3. **Ending Dossier Copy:**
     - Author the Left-Page (Official Propaganda title + gold stamp text) and Right-Page (Grassroots thermal receipt line items + buck-passing memo) copy for all 8 standard endings + **Hidden Ending S《愛情無價，市府破產》**.

---

### ⚙️ A4 — Gameplay & 3D/Audio Engineer (`agents/A4_engineering.md`)
- **Owns:** `src/engine.py` (reference parity), `web/js/game_manager.js`, `web/js/diorama_3d.js`, `web/js/audio_engine.js`, `web/js/citizen_ai.js`
- **Assigned Tasks (aligned to 4-Week MVP Roadmap):**
  1. **Milestone 1 (Core State Machine — `GameManager`):**
     - Port and keep 1:1 parity between `src/engine.py` and browser ES module `web/js/game_manager.js`.
     - Implement deterministic PRNG, 12-turn loop, 5 actions (`wheel`, `shuttle`, `market`, `event`, `hearing`, plus `repay`/`rest`), achievement tracker, and Ending S evaluation.
  2. **Milestone 3 (Three.js 3D Diorama — `diorama_3d.js`):**
     - Build the 5-zone Low-Poly Diorama with exact heights (`0.5` to `4.0`).
     - Implement **God-Hand Airdrop** (wheel drag-and-drop + camera shake + red demolition grid), **Chief's Red Pen** (80° vertical mountain track + Old Town house-clipping transparent tube), **Mitosis Market** (pink neon tin stalls), and **Disposable Inflatable Cupid** (inflate on event, deflate & garbage truck cleanup at turn end).
     - Implement **Fiscal & Petition Disasters**: wheel cabin detachment/sparks, yellow court-seizure strips (`法院查封`), giant megaphone shockwaves, petition paper rain, and red `'X'` graffiti on wheels.
  3. **Milestone 4A (Pixel Citizen AI & Web Audio — `citizen_ai.js`, `audio_engine.js`):**
     - Implement the 5 deterministic citizen behaviors: 80° bus centrifugal ejection into sea (`啵` respawn), living-room bus clipping (`...`), green dizzy walk + particle vomit + blackout SOS Morse code, night-market slime merging, and public hearing mass sleep (`Zzz`).
     - Implement procedural **Web Audio API** synthesizer & mixer: cheesy Bossa Nova loop, Deficit Pitch-Drop & Glitch + phone ring + LED buzz, Petition Low-Pass Filter + protest drums/megaphone/glass shatter, and **Document Ducking** (suppress chaos audio on document slide-in, 120% rebound on wooden stamp slam).

---

### 🖥️ A5 — 2D Desk UI/UX & Dossier Designer (`agents/A5_ui_ux.md`)
- **Owns:** `docs/ui_spec.md`, `web/index.html`, `web/css/desk.css`, `web/js/desk_ui.js`
- **Assigned Tasks (Milestone 2 & Milestone 4B):**
  1. **The Bureaucrat's Desk Layout (`desk.css`, `index.html`):**
     - Retro government desk framing the central 3D diorama viewport.
     - Base LED 7-segment budget counter (flickers & sparks when net budget `< 0`).
     - Progressive sticky-note clutter (`急件`) around screen edges as `Admin Burden` rises, plus Finance Director 3-stage meltdown props (blue note → neon yellow note + falling low-poly hair → hospital diagnosis + IV drip bag).
  2. **Document Stamping & Cable TV News Overlay (`desk_ui.js`):**
     - CSS/Canvas Bokeh blur on the 3D viewport when an event card slides in.
     - Heavy wooden official seal cursor (`木頭官印`) with red ink hover preview, 0.2s screen shake on click, red `如擬` stamp mark, red-pen strikeout on rejected option, and stamp timestamp tracking for Achievement #2 (`< 1.0s` × 3).
     - Top drop-down Cable TV News banner with live marquee ticker, Mayor quotes, and reactive Sign-Language Interpreter avatar.
  3. **End-of-Game Blue Tarp & 2-Page Dossier:**
     - Blue canvas tarp drop animation after Turn 12.
     - Left Page: Official propaganda headline, gold foil stamp, and live Three.js canvas snapshot formatted as a Polaroid photo.
     - Right Page: Draggable long thermal receipt, hand-scribbled pie chart, buck-passing memo, and unlocked Steam-style achievement badges.

---

### 🛡️ A6 — Independent QA / Red-Team (`agents/A6_qa_redteam.md`)
- **Owns:** `tests/test_engine.py`, `tests/balance_sim.py`, `reports/qa_report.md`
- **Assigned Tasks:**
  1. **Contract & Parity Verification:**
     - Verify `src/engine.py` and `web/js/game_manager.js` produce identical state snapshots and endings for identical seeds and action sequences.
  2. **Ending & Achievement Reachability Audit:**
     - Verify all 9 endings (8 base + Hidden Ending S) and all 6 achievements can be triggered deterministically in automated tests.
  3. **Browser & UX Red-Team Audit:**
     - Test rapid stamping (`ACH02`), negative budget stress without softlocking, 3 wheels in `舊城區` (`ACH03`), 80° shuttle (`ACH01`), Web Audio autoplay unlock, and 10-inch tablet/desktop responsiveness.
