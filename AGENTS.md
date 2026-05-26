# GridLumen AI — Instructions for Coding Agents

Read `DESIGN.md` before making changes. This repository implements a hackathon prototype called **GridLumen AI — Climate & Capacity Risk Radar**.

## Product invariant

GridLumen is an **explainable, privacy-aware risk-screening prototype** for utility resilience planning. It ranks generalized Mississauga-area zones under modeled scenarios. It is not an operational grid controller and it does not predict confirmed outages or equipment failures.

## Non-negotiable truth and safety rules

1. Keep Theme 2 Problem Statement 2 — infrastructure vulnerability — as the primary problem framing.
2. Preserve this formula exactly in MVP code and visible methodology copy:
   `Priority Risk Score = 0.40 × Hazard Exposure + 0.30 × Infrastructure Exposure + 0.30 × Capacity Stress`.
3. The source of truth for scenario values is `engine/data/demo/scenarios.json`; the Python engine computes outputs; the UI only renders generated outputs.
4. Every generated result and visible result view must carry this disclaimer:
   `Representative prototype data only; not an operational outage forecast or equipment-failure prediction.`
5. Use generalized zone geometry only. Never call polygons actual feeder boundaries or display precise transformer/utility asset locations.
6. Never claim real Alectra integration, actual outage prediction, automated crew dispatch, or live grid control.
7. Do not add a chatbot, authentication system, ML model, GNN, alert sender, cron job, ArcGIS write credentials, or live API dependency unless the task explicitly authorizes it after MVP completion.
8. Main dashboard must work fully offline in `demo` mode from local JSON/GeoJSON outputs.
9. Hermes is optional and bounded: it may run an approved deterministic script and summarize outputs; it must not invent scores or write to cloud systems.
10. Do not introduce secrets. Never commit `.env` files, keys, tokens, hosted-layer credentials, or local Hermes/Ollama configuration.

## Engineering rules

- Follow file ownership in `CURSOR_TASKS.md`; do not edit files owned by other parallel tasks.
- Use TypeScript strict typing in the frontend.
- Use Python type hints and deterministic pure functions in the engine.
- Keep dependencies minimal; use an SVG/GeoJSON demo map instead of a login/API dependent runtime map.
- Write or update tests for functional behaviour changed by your task.
- Do not “improve” fixture values, labels, risk thresholds, disclaimers, or product claims without explicit human approval.
- Finish each task with a short report: files changed, commands run, test output, remaining risks, and suggested merge order.

## Validation targets

When relevant, run:

```bash
# Engine
cd engine
python -m pytest
python -m gridlumen.risk_engine --all --copy-to-web

# Web
cd web
npm run typecheck
npm run test -- --run
npm run build
```

If a command is unavailable because the repository is still being scaffolded, state that explicitly rather than silently skipping validation.
