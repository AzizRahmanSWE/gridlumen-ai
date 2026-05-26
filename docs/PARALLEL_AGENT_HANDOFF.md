# Parallel agent handoff (post–F0 sign-off)

F0 contracts are frozen on `main`. Cut each branch from the latest F0 commit. Attach `@DESIGN.md`, `@AGENTS.md`, and `@CURSOR_TASKS.md` in every session.

**Merge order:** P1 → P2 → P3 → P4 → P5 → P6 → I1 → Q1

| Task | Branch | Start when |
|------|--------|------------|
| P1 | `feat/deterministic-engine` | Now (blocks real demo data) |
| P2 | `feat/dashboard-shell` | Now (parallel) |
| P3 | `feat/map-zone-interactions` | Now (parallel; may use mock props until P1 merges) |
| P4 | `docs/arcgis-proof` | Now (parallel) |
| P5 | `feat/hermes-controlled-skill` | Now (parallel) |
| P6 | `docs/pitch-and-disclosure` | Now (parallel) |
| I1 | `integrate/mvp` | After P1–P3 merged (P4–P6 docs preferred) |
| Q1 | `qa/demo-hardening` | After I1 passes |

---

## P1 — Deterministic engine

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P1 on a new branch from the completed F0 scaffold.

Implement the deterministic Python engine under `engine/`. Read canonical input values from `engine/data/demo/scenarios.json` and generalized polygon geometry from `engine/data/demo/zones.geojson`. Compute every zone score using exactly `round(0.40 * hazard_score + 0.30 * infrastructure_score + 0.30 * capacity_score)` and classify Low 0-49, Elevated 50-69, Critical 70-100. Generate summary JSON and scored GeoJSON for `normal`, `storm`, and `heatwave_ev`, then support copying outputs to `web/public/data/generated/`.

Write pytest coverage for formula boundaries, canonical rankings and scores (Storm: Cooksville Central 87 first; Heatwave+EV: Meadowvale North 91 first; Normal: Meadowvale North 72 first), mandatory disclaimer presence, and absence of precise utility asset identifiers. Do not edit the frontend implementation or add integrations. Run tests and report exact commands/output and generated files.
```

---

## P2 — Dashboard shell

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P2 from the F0 scaffold commit.

Implement the polished, professional visual shell components for GridLumen AI. Create only presentational components in the allowed folders: Header, HeroControls, KpiCards, MethodologySection, DataDisclosureSection, ArchitectureSection and Footer, plus styles/design tokens. Components must accept typed props from existing shared types and must not independently invent scores or load data. The UI should look like a utility operations dashboard: navy/blue/cyan with accessible green/amber/red risk presentation, responsive layout, restrained visuals, and a visible prototype/data disclaimer where specified.

Do not edit App.tsx, hooks, generated outputs, the engine, ArcGIS or Hermes files. Do not implement external services. Add component tests or rendering validation where practical. Run frontend typecheck/tests/build for owned changes if available and return a completion report plus any integration instructions.
```

---

## P3 — Map and interactions

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P3 from the F0 scaffold commit.

Implement the interactive operations workspace components under the permitted paths only. Build a data-driven RiskMap that renders generalized GeoJSON polygons offline (SVG is preferred; do not require ArcGIS, Mapbox, keys, or internet). Implement ZoneDetailPanel, InterventionQueue, a locked SecuredUtilityLayerModal, and hooks/utilities required to load generated summary/GeoJSON files and synchronize scenario/selected-zone state. Use the shared types from F0 without editing them.

The UI must show statuses by label and colour, display the mandatory disclaimer for selected results, and never describe generalized polygons as real feeder or transformer assets. Do not modify App.tsx, engine code, generated data, or optional integrations. Include tests for selection/sorting/scenario loading behaviour where practical, run available frontend validation, and provide precise integration steps for the I1 agent.
```

---

## P4 — ArcGIS proof

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P4.

Create the ArcGIS proof documentation package. Write a precise manual workflow for publishing a generated `scored_zones_storm.geojson` file to ArcGIS Online, styling Low/Elevated/Critical categories, configuring popups with risk score, driver, recommended action and disclaimer, and recording a reliable proof segment. Explain the privacy boundary: only generalized risk zones are public; asset-level layers are a future secured deployment concept.

Do not add runtime ArcGIS dependencies, API keys, automatic overwrites, hosted layer IDs or claims of actual utility asset access. Only edit `arcgis/**` and `docs/ARCGIS_PRIVACY.md`. Return a report of the evidence the human must capture manually.
```

---

## P5 — Hermes package

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P5.

Create a safe Hermes demonstration package for GridLumen AI. Hermes is an optional local orchestration proof only: it may run the approved Python risk-engine CLI for one requested scenario and read the generated JSON summary; it may not edit code/data/formulas, call external APIs, connect to ArcGIS, upload files, schedule jobs, send messages, or claim actual grid control. Write `hermes/SKILL.md`, a configuration/runbook document based on a local OpenAI-compatible Ollama endpoint, and a safety explanation suitable for the pitch.

Do not modify the Python engine, frontend, fixtures, outputs or any credential/config files. Use path references defined in DESIGN.md; note any path adjustment needed after integration. Include the mandatory representative-data disclaimer in the skill response requirements. Return a screen-recording checklist for the human owner.
```

---

## P6 — Pitch and disclosure

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. Work only on task P6.

Create the credibility and pitch documentation for a solo-built GridLumen AI submission. Write a concise data disclosure explaining real vs representative vs future-authorized inputs, an attribution checklist, a locked decision log, a compelling five-minute video script, a recording checklist and judge Q&A. The core pitch is infrastructure vulnerability; severe storm and heatwave+EV are scenario extensions. Explain why deterministic scoring is appropriate without labelled outage/failure data and why Hermes, if shown, is only a controlled orchestration proof.

Do not modify application code or introduce new product features. Do not claim real Alectra assets, confirmed failure prediction, actual utility dispatch, live operational integration or guaranteed impact. Only edit allowed documentation paths and return the top five lines the presenter must never misstate.
```

---

## I1 — Integration (after P1–P3 merge)

```text
Read @DESIGN.md, @AGENTS.md, and @CURSOR_TASKS.md. The foundation and parallel feature branches have been merged. Execute task I1 only: integrate and stabilize the MVP.

Wire the generated local JSON/GeoJSON outputs into the frontend application. Compose the presentational shell and operations workspace in App.tsx. Ensure the default screen is the severe wind/rain storm scenario with Cooksville Central selected; scenario toggles and zone selection must update all dependent views immediately. Integrate methodology, disclosure, architecture and optional static agent-run card content while keeping the runtime app independent of Hermes, Ollama, ArcGIS and network services.

Resolve build/test/typecheck issues caused by branch integration, update README run commands, and preserve every safety/truth invariant. Do not add new features or change fixture values/formula. Run full engine and frontend validation and return a demo-flow report plus remaining defects.
```
