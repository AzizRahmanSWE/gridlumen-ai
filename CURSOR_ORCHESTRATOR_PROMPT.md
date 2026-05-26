# Cursor Orchestrator Prompt — GridLumen AI

Paste the prompt below into a new Cursor Agent session from the repository root after placing `DESIGN.md`, `AGENTS.md`, and `CURSOR_TASKS.md` in the root.

---

Read `@DESIGN.md`, `@AGENTS.md`, and `@CURSOR_TASKS.md` fully before editing. You are the lead integrator for GridLumen AI, a solo-built hackathon prototype whose implementation can be parallelized across coding agents.

Your job is to coordinate implementation safely, not to invent features. The main demo must stay offline-capable, deterministic, credible, privacy-aware, and submission-ready.

Execution protocol:

1. Execute Task F0 (`foundation/contracts-scaffold`) yourself first. Do not start feature tasks until its contracts, fixture schema, scripts, and folder structure are committed.
2. After F0 passes, create or recommend independent branches/worktrees for parallel Tasks P1 through P6. Each branch must be cut from the F0 commit. Provide the exact standalone prompt from `CURSOR_TASKS.md` to the respective agent.
3. Enforce file ownership: agents may not edit files outside their permitted paths. When shared-file changes are needed, agents must document requested changes rather than modifying shared files.
4. After parallel results return, review and merge in this order: P1 engine; P2 dashboard shell; P3 map/interaction; P4 ArcGIS artifacts; P5 Hermes artifacts; P6 pitch/credibility docs.
5. Execute Task I1 (`integration/mvp`) after all required parallel tasks are merged. I1 owns final wiring in `web/src/App.tsx` and final validation only.
6. Execute Task Q1 (`qa/demo-hardening`) only after I1 passes.
7. Do not start any stretch integration task until Q1 passes and the user explicitly authorizes it.

During all steps, enforce the truth boundary:
- no real asset-location claims;
- no confirmed outage prediction claims;
- no ArcGIS cloud writes from runtime app;
- no Hermes credentials or unsupervised actions;
- no visible result without the mandatory representative-data disclaimer.

First output a concise proposed branch/agent plan and then implement Task F0 only.

---
