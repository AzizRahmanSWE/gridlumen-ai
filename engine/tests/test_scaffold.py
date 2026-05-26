"""F0 scaffold validation — formula tests added in P1."""

from __future__ import annotations

import json
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "data" / "demo"
DISCLAIMER = (
    "Representative prototype data only; not an operational outage forecast "
    "or equipment-failure prediction."
)


def test_scenarios_fixture_loads() -> None:
    raw = json.loads((DATA / "scenarios.json").read_text(encoding="utf-8"))
    assert raw["disclaimer"] == DISCLAIMER
    assert set(raw["scenarios"]) == {"normal", "storm", "heatwave_ev"}


def test_zones_fixture_has_eight_zones() -> None:
    raw = json.loads((DATA / "zones.geojson").read_text(encoding="utf-8"))
    assert raw["type"] == "FeatureCollection"
    assert len(raw["features"]) == 8
    ids = {f["properties"]["zone_id"] for f in raw["features"]}
    assert "cooksville-central" in ids
    assert "meadowvale-north" in ids


def test_storm_cooksville_fixture_scores() -> None:
    raw = json.loads((DATA / "scenarios.json").read_text(encoding="utf-8"))
    z = raw["scenarios"]["storm"]["zones"]["cooksville-central"]
    score = round(
        0.40 * z["hazard_score"]
        + 0.30 * z["infrastructure_score"]
        + 0.30 * z["capacity_score"]
    )
    assert score == 87
