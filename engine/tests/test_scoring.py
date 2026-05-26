"""P1 deterministic risk engine validation tests."""

from __future__ import annotations

import json
from pathlib import Path

from gridlumen.models import MANDATORY_DISCLAIMER, ZoneFixture
from gridlumen.risk_engine import (
    build_summary,
    generate_scenario,
    load_scenarios,
    load_zone_features,
)
from gridlumen.scoring import calculate_risk_score, categorize_risk, score_zone

REQUIRED_OUTPUT_FIELDS = {
    "zone_id",
    "zone_name",
    "scenario",
    "hazard_score",
    "infrastructure_score",
    "capacity_score",
    "risk_score",
    "risk_level",
    "primary_driver",
    "recommended_action",
    "urgency",
    "prototype_data",
    "disclaimer",
}
PROHIBITED_OUTPUT_KEYS = {
    "transformer_id",
    "feeder_id",
    "asset_id",
    "utility_asset_id",
    "credential",
    "api_key",
    "secret",
    "real_coordinates",
    "actual_coordinates",
}


def test_formula_uses_frozen_weights() -> None:
    assert calculate_risk_score(95, 90, 73) == 87
    assert calculate_risk_score(50, 72, 100) == 72
    assert calculate_risk_score(95, 77, 100) == 91


def test_risk_category_boundaries() -> None:
    assert categorize_risk(49) == "Low"
    assert categorize_risk(50) == "Elevated"
    assert categorize_risk(69) == "Elevated"
    assert categorize_risk(70) == "Critical"


def test_score_zone_is_deterministic() -> None:
    zone = ZoneFixture(
        zone_id="cooksville-central",
        zone_name="Cooksville Central",
        scenario="storm",
        hazard_score=95,
        infrastructure_score=90,
        capacity_score=73,
        primary_driver="Wind + overhead + vegetation",
        recommended_action="Inspect overhead corridors",
        urgency="Immediate",
    )

    first = score_zone(zone)
    second = score_zone(zone)

    assert first == second
    assert first.risk_score == 87
    assert first.risk_level == "Critical"
    assert first.prototype_data is True
    assert first.disclaimer == MANDATORY_DISCLAIMER


def test_canonical_rankings_and_scores() -> None:
    scenarios = load_scenarios(zone_features=load_zone_features())

    expected = {
        "normal": ("meadowvale-north", 72, "Critical"),
        "storm": ("cooksville-central", 87, "Critical"),
        "heatwave_ev": ("meadowvale-north", 91, "Critical"),
    }

    for scenario_id, (zone_id, score, level) in expected.items():
        summary = build_summary(scenarios[scenario_id])
        top_zone = summary.priority_zones[0]
        assert top_zone.zone_id == zone_id
        assert top_zone.risk_score == score
        assert top_zone.risk_level == level


def test_all_canonical_fixture_scores_match_design() -> None:
    scenarios = load_scenarios(zone_features=load_zone_features())
    expected_scores = {
        "normal": {
            "meadowvale-north": 72,
            "cooksville-central": 62,
            "port-credit-east": 59,
            "streetsville-west": 54,
            "city-centre": 47,
            "erin-mills": 42,
            "malton-industrial": 40,
            "clarkson-south": 38,
        },
        "storm": {
            "cooksville-central": 87,
            "meadowvale-north": 82,
            "port-credit-east": 78,
            "streetsville-west": 65,
            "clarkson-south": 59,
            "city-centre": 55,
            "erin-mills": 51,
            "malton-industrial": 46,
        },
        "heatwave_ev": {
            "meadowvale-north": 91,
            "city-centre": 81,
            "erin-mills": 69,
            "cooksville-central": 66,
            "malton-industrial": 62,
            "streetsville-west": 56,
            "clarkson-south": 53,
            "port-credit-east": 48,
        },
    }

    for scenario_id, zone_scores in expected_scores.items():
        summary = build_summary(scenarios[scenario_id])
        actual = {zone.zone_id: zone.risk_score for zone in summary.priority_zones}
        assert actual == zone_scores


def test_generated_summary_schema_and_counts(tmp_path: Path) -> None:
    summary_path, _ = generate_scenario("storm", output_dir=tmp_path)
    summary = json.loads(summary_path.read_text(encoding="utf-8"))

    assert summary["scenario"] == "storm"
    assert summary["generated_at"] is None
    assert summary["data_mode"] == "representative"
    assert summary["critical_zones"] == 3
    assert summary["elevated_zones"] == 4
    assert summary["default_selected_zone_id"] == "cooksville-central"
    assert summary["prototype_data"] is True
    assert summary["disclaimer"] == MANDATORY_DISCLAIMER

    for zone in summary["priority_zones"]:
        assert REQUIRED_OUTPUT_FIELDS <= set(zone)
        assert zone["prototype_data"] is True
        assert zone["disclaimer"] == MANDATORY_DISCLAIMER


def test_generated_geojson_schema_and_feature_properties(tmp_path: Path) -> None:
    _, geojson_path = generate_scenario("heatwave_ev", output_dir=tmp_path)
    geojson = json.loads(geojson_path.read_text(encoding="utf-8"))

    assert geojson["type"] == "FeatureCollection"
    assert geojson["metadata"]["scenario"] == "heatwave_ev"
    assert geojson["metadata"]["prototype_data"] is True
    assert geojson["metadata"]["disclaimer"] == MANDATORY_DISCLAIMER
    assert len(geojson["features"]) == 8

    first = geojson["features"][0]
    assert first["type"] == "Feature"
    assert first["geometry"]["type"] in {"Polygon", "MultiPolygon"}
    assert first["properties"]["zone_id"] == "meadowvale-north"
    assert first["properties"]["risk_score"] == 91
    assert REQUIRED_OUTPUT_FIELDS <= set(first["properties"])


def test_generated_outputs_have_no_precise_utility_asset_identifiers(tmp_path: Path) -> None:
    paths = generate_scenario("normal", output_dir=tmp_path)

    for path in paths:
        payload = json.loads(path.read_text(encoding="utf-8"))
        serialized = json.dumps(payload).lower()
        for prohibited_key in PROHIBITED_OUTPUT_KEYS:
            assert prohibited_key not in serialized


def test_generation_is_deterministic(tmp_path: Path) -> None:
    first_dir = tmp_path / "first"
    second_dir = tmp_path / "second"

    first_paths = generate_scenario("storm", output_dir=first_dir)
    second_paths = generate_scenario("storm", output_dir=second_dir)

    for first_path, second_path in zip(first_paths, second_paths, strict=True):
        assert first_path.read_text(encoding="utf-8") == second_path.read_text(encoding="utf-8")
