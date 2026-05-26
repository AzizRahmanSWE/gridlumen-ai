# GridLumen risk engine

Deterministic scoring from `data/demo/scenarios.json` and `data/demo/zones.geojson`.

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
python -m pytest
```

After task P1:

```bash
python -m gridlumen.risk_engine --scenario storm
python -m gridlumen.risk_engine --all --copy-to-web
```
