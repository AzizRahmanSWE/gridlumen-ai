# Raw public geometry (offline cache)

Cached exports used only to regenerate [`../demo/zones.geojson`](../demo/zones.geojson) — not read at demo runtime.

| File | Source |
|------|--------|
| `wards_mississauga.geojson` | City of Mississauga ArcGIS Hosted Feature Layer **Ward_Boundaries** (layer id `2`), WGS84, exported via REST `query` with `f=geojson`. Portal: [Ward Boundaries](https://data.mississauga.ca/datasets/ward-boundaries/about). |

Retrieved **2026-05-26** for the Q1A spatial credibility upgrade.

## Regenerate screening zones

From the `engine/` directory, with Python 3.11+:

```bash
python3 -m venv .venv
.venv/bin/pip install -e ".[geo-build]"
.venv/bin/python scripts/build_screening_zones.py
```

Then run `python -m gridlumen.risk_engine --all --copy-to-web`.

Using a personal venv is required on environments that block global `pip install` (PEP 668).
