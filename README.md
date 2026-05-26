# GridLumen AI — Climate & Capacity Risk Radar

Explainable, privacy-aware risk-screening prototype for utility resilience planning under modeled scenarios. Generalized Mississauga-area pilot zones; **not** an operational outage forecast or equipment-failure prediction.

**Seneca Polytechnic Energy Hackathon 2026** · Theme 2 — Smart Grid, Resilience and Electrification · Problem Statement 2 (Infrastructure Vulnerability)

## Repository layout

| Path | Purpose |
|------|---------|
| `DESIGN.md` | Canonical product and technical specification |
| `AGENTS.md` | Rules for coding agents |
| `CURSOR_TASKS.md` | Parallel implementation task board (start with **F0**, then P1–P6) |
| `web/` | React + TypeScript + Vite dashboard (offline `demo` mode) |
| `engine/` | Deterministic Python risk engine and demo fixtures |
| `arcgis/` | ArcGIS Online proof artifacts |
| `hermes/` | Bounded Hermes agent skill (optional) |
| `docs/` | Data disclosure, security scope, attributions |
| `pitch/` | Five-minute script and recording checklist |

## Quick start

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+

### Web dashboard

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Other commands:

```bash
npm run typecheck   # tsc --noEmit
npm run test -- --run
npm run build
```

### Risk engine

```bash
cd engine
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
python -m pytest
```

After P1 is implemented:

```bash
python -m gridlumen.risk_engine --scenario storm
python -m gridlumen.risk_engine --all --copy-to-web
```

Generated files are copied to `web/public/data/generated/` for offline demo mode.

## Risk formula (MVP)

```text
Priority Risk Score = round(0.40 × Hazard + 0.30 × Infrastructure + 0.30 × Capacity)
```

Categories: Low 0–49 · Elevated 50–69 · Critical 70–100.

**Source of truth:** `engine/data/demo/scenarios.json` → Python engine → UI renders outputs only.

## Mandatory disclaimer

> Representative prototype data only; not an operational outage forecast or equipment-failure prediction.

## Implementation status

- **F0:** Foundation contracts and tooling
- **P1–P4:** Deterministic engine, generated outputs, dashboard shell, map/interactions, ArcGIS proof docs (merged to `main`)
- **I1:** Integrated MVP dashboard on branch `integrate/mvp` — run `npm run dev` in `web/` to open the full offline demo (default: storm scenario, Cooksville Central selected)

Regenerate scenario outputs after fixture changes:

```bash
cd engine
source .venv/bin/activate
python -m gridlumen.risk_engine --all --copy-to-web
```

## License

Hackathon prototype — add a license file before public distribution if required by organizers.
