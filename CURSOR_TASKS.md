# GridLumen AI — Cursor Parallel Agent Task Board

## Purpose

This document converts `DESIGN.md` into implementation tickets that can be handed to separate Cursor Agent/Cloud Agent sessions without creating conflicting changes. You remain the human owner and reviewer. Agents produce branches or patches; they do not decide project truth, change scope, or merge without review.

## How to use this file in Cursor

1. Create a Git repository with `DESIGN.md`, `AGENTS.md`, and this file in the repository root.
2. In every Cursor agent prompt, attach or reference: `@DESIGN.md @AGENTS.md @CURSOR_TASKS.md`.
3. Run **F0 Foundation** alone first and commit it. It establishes contracts that every other agent consumes.
4. Start parallel tasks **P1–P6** only after F0 is committed, each on an independent branch/worktree based on the same F0 commit.
5. Merge only after reviewing diffs and test reports. Never let multiple agents freely edit `App.tsx`, configuration, or shared contracts at the same time.
6. Run **I1 Integration** and **Q1 QA/Recording Hardening** after parallel work is merged.
7. Start stretch tasks only after a complete, recordable MVP exists.

## Core product constraints all tasks must preserve

- Product: **GridLumen AI — Climate & Capacity Risk Radar**.
- Primary scope: Theme 2, Problem Statement 2 — infrastructure vulnerability.
- Pilot: generalized Mississauga-area risk zones.
- Risk formula: `0.40 × Hazard + 0.30 × Infrastructure + 0.30 × Capacity`.
- Scenarios: `normal`, `storm`, `heatwave_ev` only for MVP.
- Default demo state: `storm`, with `Cooksville Central` selected.
- Data truth: representative demo values unless explicitly marked as validated public layers.
- Mandatory disclaimer: `Representative prototype data only; not an operational outage forecast or equipment-failure prediction.`
- Dashboard cannot require network, Ollama, Hermes, ArcGIS credentials, or live data to work.

---

# 1. Parallelization strategy

## Why there is a foundation gate

The frontend, engine, ArcGIS proof, and Hermes skill all rely on the same scenario IDs, output schema, file locations, formula, and disclaimer. Creating those contracts once before parallel agents start prevents incompatible implementations and merge conflicts.

## Waves

```text
F0 Foundation / Contracts Scaffold     (single agent; blocking)
             │
             ├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
             ▼         ▼         ▼         ▼         ▼         ▼         │
P1 Engine  P2 UI     P3 Map    P4 GIS    P5 Hermes P6 Pitch/Docs         │
             └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                      │
                                      ▼
                              I1 MVP Integration
                                      │
                                      ▼
                              Q1 Demo Hardening
                                      │
                                      ▼
                         S1/S2 Optional Stretches only
```

## Branch and merge table

| ID | Suggested branch | Parallel after F0? | Merge priority | Human review focus |
|---|---|---:|---:|---|
| F0 | `foundation/contracts-scaffold` | No | 0 | Schema, dependencies, no scope creep |
| P1 | `feat/deterministic-engine` | Yes | 1 | Fixture correctness and computed scores |
| P2 | `feat/dashboard-shell` | Yes | 2 | Visual quality, no invented data |
| P3 | `feat/map-zone-interactions` | Yes | 3 | Data-driven selection and accessibility |
| P4 | `docs/arcgis-proof` | Yes | 4 | Publish workflow and privacy claims |
| P5 | `feat/hermes-controlled-skill` | Yes | 5 | No external writes or score invention |
| P6 | `docs/pitch-and-disclosure` | Yes | 6 | Truthfulness, five-minute clarity |
| I1 | `integrate/mvp` | No | 7 | Wiring, build/tests, offline demo |
| Q1 | `qa/demo-hardening` | No | 8 | Bugs, recording readiness, no regressions |
| S1 | `stretch/public-weather-readonly` | No | Optional | Isolated enhancement only |
| S2 | `stretch/arcgis-overwrite-concept` | No | Optional/docs only | No production credentials |

---

# 2. File ownership rules

The following ownership rules are mandatory while tasks are in parallel. An agent must not modify another task's owned paths. If the agent needs a shared change, it should put a note in its completion report for the I1 integrator.

| Task | May edit | Must not edit while parallel |
|---|---|---|
| F0 | Repository-wide scaffold and shared contracts only | Feature implementations beyond placeholders |
| P1 | `engine/**`, `web/public/data/generated/**` | `web/src/**`, `hermes/**`, `pitch/**`, `arcgis/**` |
| P2 | `web/src/components/layout/**`, `web/src/components/sections/**`, `web/src/styles/**`, visual assets | `web/src/App.tsx`, `web/src/hooks/**`, generated data, engine |
| P3 | `web/src/components/operations/**`, `web/src/hooks/**`, `web/src/lib/**`, component tests for owned components | `web/src/App.tsx`, engine, styles owned by P2 except additive local module styles |
| P4 | `arcgis/**`, `docs/ARCGIS_PRIVACY.md` | Runtime frontend, engine, Hermes |
| P5 | `hermes/**`, `docs/HERMES_SAFETY.md` | Runtime frontend, engine formulas/fixtures, ArcGIS |
| P6 | `pitch/**`, `docs/DATA_DISCLOSURE.md`, `docs/SOURCE_ATTRIBUTIONS.md`, `docs/DECISION_LOG.md` | Frontend implementation, engine, Hermes |
| I1 | Integration wiring; may edit `web/src/App.tsx`, imports, shared build fixes and README | New feature scope |
| Q1 | Test/bugfix/polish paths necessary to pass acceptance criteria | New product capability |

Shared contracts established by F0 must not be changed by P1–P6 without approval:

- `web/src/data/types.ts`
- `engine/data/demo/scenarios.json` schema and canonical values
- `engine/data/demo/zones.geojson` feature IDs
- output filenames and property names
- formula, thresholds, disclaimer, scenario IDs

---

# 3. Definition of MVP complete

The human builder may begin recording only when all are true:

- [ ] `storm` scenario loads by default with Cooksville selected.
- [ ] Three scenarios switch immediately and display correct KPIs, risk colours, selected-zone content, and sorted intervention queue.
- [ ] UI renders from generated local files, not hardcoded score calculations in React.
- [ ] Python engine outputs deterministic JSON/GeoJSON for all three scenarios.
- [ ] Formula and threshold tests pass.
- [ ] Mandatory disclaimer is visible on dashboard and in generated outputs.
- [ ] Demo makes no actual asset/failure prediction claims.
- [ ] A map proof is screen-recordable, either built-in SVG map or ArcGIS hosted proof.
- [ ] Hermes is either working as a bounded optional proof or removed from the pitch claim.
- [ ] Five-minute pitch script accurately describes what is implemented.

---

# 4. F0 — Foundation and contract scaffold (blocking; run first)

## Goal

Create the repository skeleton, install the minimal web/engine tooling, define shared data types/contracts, seed canonical fixture inputs and placeholders, and establish commands that all parallel agents can depend on.

## Branch

`foundation/contracts-scaffold`

## Allowed paths

All repository paths, but only for scaffold/contracts/config; do not implement feature UI or full engine functionality.

## Deliverables

- Root `README.md` with installation and planned commands.
- Root `.gitignore` and `.env.example` policy.
- React + TypeScript + Vite frontend under `web/` using npm.
- Tailwind set up or a stable equivalent CSS approach; Lucide React available.
- Python package skeleton under `engine/` with pytest available.
- Required directories from `DESIGN.md`.
- Canonical `engine/data/demo/scenarios.json` and `engine/data/demo/zones.geojson` values copied from `DESIGN.md`.
- Shared TypeScript types at `web/src/data/types.ts`.
- Placeholder generated-data directory at `web/public/data/generated/`.
- Script placeholders or documented commands for engine generation and frontend build.
- Do not add ArcGIS APIs, map service dependencies, Hermes runtime code, live APIs, authentication or deployment secrets.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Execute only task F0: Foundation and contract scaffold.

Create a reliable monorepo-style project skeleton for GridLumen AI. Use npm + Vite + React + strict TypeScript in `web/`, with minimal dependencies for a high-quality dashboard. Set up an `engine/` Python package with pytest. Create all required folders from DESIGN.md. Copy the canonical scenario fixture inputs and generalized zone geometry exactly into `engine/data/demo/scenarios.json` and `engine/data/demo/zones.geojson`. Define the frontend TypeScript contracts in `web/src/data/types.ts` matching DESIGN.md. Establish output locations and README commands.

This is a contracts/scaffold task only: do not implement the finished dashboard, risk scoring engine, ArcGIS integration, Hermes integration, weather APIs, uploads, alerts, authentication, or scheduling. Preserve the mandatory representative-data disclaimer in fixtures/contracts. Run setup validation commands that are available, commit changes on branch `foundation/contracts-scaffold`, and return a report of files, commands, dependency decisions and any contract questions.
```

## Acceptance tests

- [ ] `web/` can install and run a starter build.
- [ ] `engine/` has a test command that runs, even if only scaffold validation exists.
- [ ] Canonical scenario IDs and zones exactly match `DESIGN.md`.
- [ ] Types include all required output fields and mandatory disclaimer.
- [ ] No cloud credentials or optional integrations added.

---

# 5. Parallel task P1 — Deterministic Python risk engine and generated datasets

## Goal

Build the single source of truth for all scores and map-ready data. It must compute outputs from canonical fixture inputs rather than duplicating numbers in UI code.

## Branch

`feat/deterministic-engine`, based on F0 commit.

## Allowed paths

- `engine/**`
- `web/public/data/generated/**` for generated output files only

## Deliverables

- Python models/validation for scenario fixture input.
- Fixed scoring implementation and risk-level classification.
- CLI commands:
  - `python -m gridlumen.risk_engine --scenario normal`
  - `python -m gridlumen.risk_engine --scenario storm`
  - `python -m gridlumen.risk_engine --scenario heatwave_ev`
  - `python -m gridlumen.risk_engine --all --copy-to-web`
- Output summary JSON and scored GeoJSON for all scenarios.
- Unit tests covering formula, boundaries, canonical top rankings, output fields, privacy guard and deterministic output.
- No GeoPandas dependency unless strictly needed; for demo polygons basic JSON handling is sufficient.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P1 on a new branch from the completed F0 scaffold.

Implement the deterministic Python engine under `engine/`. Read canonical input values from `engine/data/demo/scenarios.json` and generalized polygon geometry from `engine/data/demo/zones.geojson`. Compute every zone score using exactly `round(0.40 * hazard_score + 0.30 * infrastructure_score + 0.30 * capacity_score)` and classify Low 0-49, Elevated 50-69, Critical 70-100. Generate summary JSON and scored GeoJSON for `normal`, `storm`, and `heatwave_ev`, then support copying outputs to `web/public/data/generated/`.

Write pytest coverage for formula boundaries, canonical rankings and scores (Storm: Cooksville Central 87 first; Heatwave+EV: Meadowvale North 91 first; Normal: Meadowvale North 72 first), mandatory disclaimer presence, and absence of precise utility asset identifiers. Do not edit the frontend implementation or add integrations. Run tests and report exact commands/output and generated files.
```

## Acceptance tests

- [ ] Outputs match all canonical tables in `DESIGN.md`.
- [ ] Every output feature includes `prototype_data: true` and mandatory disclaimer.
- [ ] No exact asset identifiers exist in outputs.
- [ ] `--all --copy-to-web` succeeds.
- [ ] Tests pass.

---

# 6. Parallel task P2 — Dashboard visual shell and credibility sections

## Goal

Build polished, reusable presentational components without owning data loading or `App.tsx` orchestration.

## Branch

`feat/dashboard-shell`, based on F0 commit.

## Allowed paths

- `web/src/components/layout/**`
- `web/src/components/sections/**`
- `web/src/styles/**`
- `web/src/assets/**` if needed
- tests for these components only

## Deliverables

- `Header` with product identity, Mississauga Pilot and Prototype Demo labels.
- `HeroControls` presentational component accepting scenario/control props.
- `KpiCards` presentational component accepting active summary props.
- `MethodologySection` explaining fixed formula and three inputs.
- `DataDisclosureSection` distinguishing representative vs future-authorized/public inputs.
- `ArchitectureSection` showing dashboard → engine → optional Hermes/GIS proof narrative.
- `Footer`.
- Design tokens/style system consistent with `DESIGN.md`.
- Responsiveness for desktop/tablet/mobile.
- Do not connect to runtime data in this branch; provide component story/mock usage only where necessary.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P2 from the F0 scaffold commit.

Implement the polished, professional visual shell components for GridLumen AI. Create only presentational components in the allowed folders: Header, HeroControls, KpiCards, MethodologySection, DataDisclosureSection, ArchitectureSection and Footer, plus styles/design tokens. Components must accept typed props from existing shared types and must not independently invent scores or load data. The UI should look like a utility operations dashboard: navy/blue/cyan with accessible green/amber/red risk presentation, responsive layout, restrained visuals, and a visible prototype/data disclaimer where specified.

Do not edit App.tsx, hooks, generated outputs, the engine, ArcGIS or Hermes files. Do not implement external services. Add component tests or rendering validation where practical. Run frontend typecheck/tests/build for owned changes if available and return a completion report plus any integration instructions.
```

## Acceptance tests

- [ ] Components render with props only and use no fabricated runtime data.
- [ ] Mandatory methodology/disclosure language is visible.
- [ ] Layout appears professional at 1440px and remains usable on tablet/mobile.
- [ ] No edits outside owned paths.

---

# 7. Parallel task P3 — Operations workspace: map, selection and intervention interactions

## Goal

Build the dashboard's core interactive workspace driven by generated summary/GeoJSON outputs.

## Branch

`feat/map-zone-interactions`, based on F0 commit. It may use fixture-shaped sample props if P1 outputs have not yet merged; integration replaces those with generated files.

## Allowed paths

- `web/src/components/operations/**`
- `web/src/hooks/**`
- `web/src/lib/**`
- tests for owned components/hooks

## Deliverables

- Scenario data loading hook or utility compatible with generated output file paths.
- `RiskMap` using generalized GeoJSON in a guaranteed offline mode; prefer SVG polygon rendering rather than a service-dependent map.
- `ZoneDetailPanel` with component bars, risk badge, recommendation and visible disclaimer.
- `InterventionQueue` sorted by risk and synced with zone selection.
- `SecuredUtilityLayerModal` locked-state explanatory interaction.
- Keyboard-accessible zone selection and labelled risk statuses; do not rely on colour only.
- No changes to `App.tsx`; give integration instructions.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P3 from the F0 scaffold commit.

Implement the interactive operations workspace components under the permitted paths only. Build a data-driven RiskMap that renders generalized GeoJSON polygons offline (SVG is preferred; do not require ArcGIS, Mapbox, keys, or internet). Implement ZoneDetailPanel, InterventionQueue, a locked SecuredUtilityLayerModal, and hooks/utilities required to load generated summary/GeoJSON files and synchronize scenario/selected-zone state. Use the shared types from F0 without editing them.

The UI must show statuses by label and colour, display the mandatory disclaimer for selected results, and never describe generalized polygons as real feeder or transformer assets. Do not modify App.tsx, engine code, generated data, or optional integrations. Include tests for selection/sorting/scenario loading behaviour where practical, run available frontend validation, and provide precise integration steps for the I1 agent.
```

## Acceptance tests

- [ ] Offline map renders all generalized zones from GeoJSON.
- [ ] Selecting a zone updates details and queue highlighting.
- [ ] Scenario input changes data file selection without React score recalculation.
- [ ] Risk statuses are accessible and disclaimer is visible.
- [ ] Locked layer never displays asset data.

---

# 8. Parallel task P4 — ArcGIS proof package

## Goal

Prepare a sponsor-aligned, low-risk GIS demonstration path using the generated GeoJSON outputs without making the frontend depend on ArcGIS.

## Branch

`docs/arcgis-proof`, based on F0 commit; update it after P1 output fields are available if needed.

## Allowed paths

- `arcgis/**`
- `docs/ARCGIS_PRIVACY.md`

## Deliverables

- Step-by-step `arcgis/PUBLISHING_GUIDE.md` to upload the generated storm GeoJSON to Seneca ArcGIS Online as a hosted feature layer.
- `arcgis/POPUP_FIELDS.md` listing styling values, popup labels and visibility rules.
- `arcgis/DEMO_RECORDING_CHECKLIST.md` for capturing the map proof.
- `docs/ARCGIS_PRIVACY.md` describing public generalized polygons versus conceptual secured utility layers.
- Optional screenshot slots/folders, but no credentials or programmatic API updates.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P4.

Create the ArcGIS proof documentation package. Write a precise manual workflow for publishing a generated `scored_zones_storm.geojson` file to ArcGIS Online, styling Low/Elevated/Critical categories, configuring popups with risk score, driver, recommended action and disclaimer, and recording a reliable proof segment. Explain the privacy boundary: only generalized risk zones are public; asset-level layers are a future secured deployment concept.

Do not add runtime ArcGIS dependencies, API keys, automatic overwrites, hosted layer IDs or claims of actual utility asset access. Only edit `arcgis/**` and `docs/ARCGIS_PRIVACY.md`. Return a report of the evidence the human must capture manually.
```

## Acceptance tests

- [ ] Instructions use only generated prototype GeoJSON.
- [ ] Popup displays mandatory disclaimer.
- [ ] Documentation clearly prevents sensitive-asset claims.
- [ ] No credentials/API code are introduced.

---

# 9. Parallel task P5 — Hermes controlled-agent demonstration package

## Goal

Turn the working local Hermes/Ollama environment into a narrowly bounded, optional demonstration that runs the deterministic engine and reports output paths.

## Branch

`feat/hermes-controlled-skill`, based on F0 commit; coordinate path assumptions with P1 but do not modify engine files.

## Allowed paths

- `hermes/**`
- `docs/HERMES_SAFETY.md`

## Deliverables

- `hermes/SKILL.md` with allowed scenarios, allowed command paths, allowed output reads, prohibited actions and required disclaimer.
- `hermes/INSTALL_AND_CONFIG.md` explaining the already-working local endpoint setup generically, without copying local keys/config secrets.
- `hermes/DEMO_RUNBOOK.md` showing manual engine check first, Hermes invocation second and screen-recording workflow.
- `docs/HERMES_SAFETY.md` describing why Hermes orchestrates but does not compute/invent risk or control operations.
- No cron, notifications, browser automation, ArcGIS writes, cloud keys or runtime frontend dependency.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P5.

Create a safe Hermes demonstration package for GridLumen AI. Hermes is an optional local orchestration proof only: it may run the approved Python risk-engine CLI for one requested scenario and read the generated JSON summary; it may not edit code/data/formulas, call external APIs, connect to ArcGIS, upload files, schedule jobs, send messages, or claim actual grid control. Write `hermes/SKILL.md`, a configuration/runbook document based on a local OpenAI-compatible Ollama endpoint, and a safety explanation suitable for the pitch.

Do not modify the Python engine, frontend, fixtures, outputs or any credential/config files. Use path references defined in DESIGN.md; note any path adjustment needed after integration. Include the mandatory representative-data disclaimer in the skill response requirements. Return a screen-recording checklist for the human owner.
```

## Acceptance tests

- [ ] Skill invokes deterministic engine only.
- [ ] Skill forbids external writes/credentials/scheduling.
- [ ] Pitch language says “orchestration” and not “autonomous grid operator.”
- [ ] Runbook includes fallback: omit Hermes from demo if unreliable.

---

# 10. Parallel task P6 — Data disclosure, source attribution and pitch package

## Goal

Ensure the project sounds credible, truthful and concise while the code agents build the app.

## Branch

`docs/pitch-and-disclosure`, based on F0 commit.

## Allowed paths

- `pitch/**`
- `docs/DATA_DISCLOSURE.md`
- `docs/SOURCE_ATTRIBUTIONS.md`
- `docs/DECISION_LOG.md`

## Deliverables

- Data disclosure matrix matching the product truth table.
- Source attribution template for challenge brief, public environmental sources, ArcGIS proof and libraries.
- Decision log recording scope locks and kill criteria.
- Five-minute video script timed by segment.
- Recording checklist and judge Q&A cheat sheet.
- No unsupported sponsor, asset, live-weather, AI or operational claims.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P6.

Create the credibility and pitch documentation for a solo-built GridLumen AI submission. Write a concise data disclosure explaining real vs representative vs future-authorized inputs, an attribution checklist, a locked decision log, a compelling five-minute video script, a recording checklist and judge Q&A. The core pitch is infrastructure vulnerability; severe storm and heatwave+EV are scenario extensions. Explain why deterministic scoring is appropriate without labelled outage/failure data and why Hermes, if shown, is only a controlled orchestration proof.

Do not modify application code or introduce new product features. Do not claim real Alectra assets, confirmed failure prediction, actual utility dispatch, live operational integration or guaranteed impact. Only edit allowed documentation paths and return the top five lines the presenter must never misstate.
```

## Acceptance tests

- [ ] Script can be delivered in under five minutes at normal speaking pace.
- [ ] Disclosures match UI disclaimer and engine output truth.
- [ ] Q&A includes response to “Is this real grid data?” and “Why not ML?”
- [ ] No overclaiming language remains.

---

# 11. I1 — MVP integration agent (run only after required parallel tasks merge)

## Goal

Wire the merged components into a stable, offline-capable application, resolve imports/build errors and verify the exact demo flow. This agent is the only feature agent allowed to edit central composition files after parallel work.

## Branch

`integrate/mvp`

## Preconditions

- F0 merged.
- P1, P2 and P3 merged at minimum.
- Prefer P4–P6 merged or ready for documentation-only merge.

## Allowed paths

Any files required to integrate, test and repair the MVP; no new feature scope.

## Deliverables

- `web/src/App.tsx` composition and application state wiring.
- Scenario data loading from `web/public/data/generated/`.
- Default state: storm scenario and Cooksville selected.
- Full dashboard flow: scenario → KPI → map → detail → queue → credibility sections.
- Final README run commands.
- Resolved tests, type checks and builds.
- No live dependencies, credentials, ArcGIS runtime calls or Hermes requirement.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. The foundation and parallel feature branches have been merged. Execute task I1 only: integrate and stabilize the MVP.

Wire the generated local JSON/GeoJSON outputs into the frontend application. Compose the presentational shell and operations workspace in App.tsx. Ensure the default screen is the severe wind/rain storm scenario with Cooksville Central selected; scenario toggles and zone selection must update all dependent views immediately. Integrate methodology, disclosure, architecture and optional static agent-run card content while keeping the runtime app independent of Hermes, Ollama, ArcGIS and network services.

Resolve build/test/typecheck issues caused by branch integration, update README run commands, and preserve every safety/truth invariant. Do not add new features or change fixture values/formula. Run full engine and frontend validation and return a demo-flow report plus remaining defects.
```

## Acceptance tests

- [ ] Engine tests and generation commands pass.
- [ ] Web typecheck/test/build pass.
- [ ] Application works offline.
- [ ] All scenario/KPI/risk/queue values agree with generated outputs.
- [ ] Disclaimer is visible for result interpretation.
- [ ] No unsupported claims in application copy.

---

# 12. Q1 — Demo hardening, accessibility and recording readiness

## Goal

Test the complete demo like a judge, fix visible bugs and prepare a deterministic recording route. No new capability should be introduced.

## Branch

`qa/demo-hardening`

## Preconditions

I1 has passed all functional tests.

## Deliverables

- Keyboard/accessibility audit and targeted fixes.
- Responsive check at desktop and laptop recording resolutions.
- Verification that risk colours also use labels/icons/text.
- Error/fallback state if a generated file cannot load.
- Screenshot/recording checklist aligned with pitch script.
- Defect log showing resolved and intentionally deferred items.

## Standalone Cursor prompt

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Execute Q1 only after the integrated MVP builds and runs.

Act as a strict hackathon judge and QA engineer. Exercise the exact recording journey: load storm; click Cooksville; inspect risk drivers/actions/disclaimer; switch to heatwave+EV; click Meadowvale; inspect capacity-stress explanation; review methodology/disclosure; verify any ArcGIS/Hermes proof is presented separately and honestly. Fix only defects, accessibility problems, responsiveness issues, loading fallback issues and high-impact polish problems. Do not add features, change data, change formula, or introduce network/runtime dependencies.

Run full engine/frontend validation after changes. Return a pass/fail demo checklist, prioritized deferred issues and a recommended recording sequence.
```

---

# 13. Optional stretch tasks — only after a recordable MVP

## S1 — Read-only public weather input research/adapter

**Do not start until Q1 passes and the human explicitly approves.** This task adds a provider boundary or documentation; it cannot replace the reliable demo fixture during recording.

Allowed scope:

- `engine/gridlumen/providers/**`
- tests for provider transformation
- `docs/PUBLIC_WEATHER_EXTENSION.md`

Prompt:

```text
Read @DESIGN.md and @AGENTS.md. The full offline MVP is complete. Implement an isolated, read-only public-weather provider enhancement behind a feature flag, while preserving the demo fixture provider as default. Do not change risk formula, capacity assumptions, ArcGIS layers or pitch claims. Document transformations and label output as public-weather enhanced but not an outage forecast. Abort the implementation and write documentation only if the external data format or uptime makes the enhancement unreliable within the timebox.
```

## S2 — Hosted-layer overwrite architecture note only

Allowed scope: documentation only unless the human later explicitly approves credentials in a private environment.

Prompt:

```text
Write a production-path architecture note describing how a reviewed GeoJSON output could update a controlled hosted GIS layer in a future utility pilot. Do not implement writes, introduce keys, connect to ArcGIS services or imply that the hackathon prototype performs automated uploads.
```

---

# 14. Merge review checklist for the human owner

For every agent branch, inspect before merging:

- [ ] Did the agent stay inside its allowed paths?
- [ ] Does it preserve formula, threshold, scenario IDs and disclaimer exactly?
- [ ] Did it avoid real-asset, confirmed-failure or automated-operations claims?
- [ ] Did it add any network service, credential, secret, telemetry, paid dependency or unnecessary package?
- [ ] Did it run tests/builds and report results honestly?
- [ ] Does merging it make the recording flow more reliable, not more fragile?

Reject or request changes when an agent:

- adds a chatbot;
- adds an ML prediction model;
- hardcodes output scores in React instead of using generated output files;
- requires Hermes/Ollama/ArcGIS to load the main website;
- writes to cloud services;
- introduces unreviewed data or product claims.

---

# 15. Suggested Cursor run sequence for you

## Session 1 — Lead/foundation

Start one Cursor Agent session with `CURSOR_ORCHESTRATOR_PROMPT.md`. Let it implement F0 only. Review, run commands, and commit.

## Sessions 2–7 — Parallel implementation

After F0 is committed, start six independent agents, each receiving its standalone prompt:

1. P1 engine.
2. P2 dashboard shell.
3. P3 map and interactions.
4. P4 ArcGIS proof docs.
5. P5 Hermes proof docs/skill.
6. P6 pitch/disclosure docs.

P1–P3 are the required technical implementation agents. P4–P6 are low-conflict and can run simultaneously, but only after your required build branches have started.

## Session 8 — Integration

Merge reviewed outputs, then run I1 as one central integration agent. Do not have multiple agents change central wiring at the same time.

## Session 9 — QA and recording

Run Q1. Once it passes, record the product and lock the submission; do not destabilize it with stretch work.

---

# 16. Completion report format required from every agent

Every agent must finish with this exact structured report:

```markdown
## Task completion report

### Task ID and branch
- Task:
- Branch:

### Files changed
- Created:
- Modified:
- Deleted:

### What was implemented
- 

### Commands run and results
- Command: `...`
  - Result: PASS / FAIL / NOT RUN (reason)

### Contract/safety verification
- Formula unchanged: Yes/No
- Disclaimer preserved: Yes/No
- No secrets added: Yes/No
- No unsupported utility/failure claims: Yes/No
- Stayed within allowed paths: Yes/No

### Integration notes
- Required merge order:
- Changes requested from integrator:
- Known limitations/risks:
```

---

# 17. North-star test

Before allowing Cursor to implement or merge any feature, ask:

> Does this make the single five-minute story more credible, more visually compelling and more stable without overstating what the data proves?

If not, it is not part of the winning MVP.
