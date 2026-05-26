"""CLI entry point for the deterministic GridLumen risk engine."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path
from typing import Any

from gridlumen.geojson_export import build_scored_geojson
from gridlumen.models import (
    ALLOWED_SCENARIOS,
    DATA_MODE,
    FORMULA,
    MANDATORY_DISCLAIMER,
    ScenarioFixture,
    ScenarioId,
    ScenarioSummary,
    ZoneFixture,
    require_allowed_scenario,
    validate_score,
    validate_urgency,
)
from gridlumen.scoring import score_zone

ENGINE_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ENGINE_ROOT.parent
DATA_DIR = ENGINE_ROOT / "data" / "demo"
OUTPUT_DIR = ENGINE_ROOT / "output"
WEB_GENERATED_DIR = REPO_ROOT / "web" / "public" / "data" / "generated"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        raw = json.load(handle)
    if not isinstance(raw, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return raw


def load_zone_features(path: Path = DATA_DIR / "zones.geojson") -> dict[str, dict[str, Any]]:
    raw = load_json(path)
    if raw.get("type") != "FeatureCollection":
        raise ValueError("zones.geojson must be a FeatureCollection")
    if raw.get("metadata", {}).get("disclaimer") != MANDATORY_DISCLAIMER:
        raise ValueError("zones.geojson must preserve the mandatory disclaimer")

    features = raw.get("features")
    if not isinstance(features, list):
        raise ValueError("zones.geojson features must be a list")

    by_zone_id: dict[str, dict[str, Any]] = {}
    for feature in features:
        if not isinstance(feature, dict) or feature.get("type") != "Feature":
            raise ValueError("each zone entry must be a GeoJSON Feature")
        properties = feature.get("properties")
        if not isinstance(properties, dict):
            raise ValueError("each zone feature must contain properties")
        zone_id = properties.get("zone_id")
        zone_name = properties.get("zone_name")
        if not isinstance(zone_id, str) or not zone_id:
            raise ValueError("each zone feature must contain zone_id")
        if not isinstance(zone_name, str) or not zone_name:
            raise ValueError(f"zone {zone_id!r} must contain zone_name")
        if zone_id in by_zone_id:
            raise ValueError(f"duplicate zone_id {zone_id!r} in zones.geojson")
        by_zone_id[zone_id] = feature

    return by_zone_id


def load_scenarios(
    path: Path = DATA_DIR / "scenarios.json",
    *,
    zone_features: dict[str, dict[str, Any]] | None = None,
) -> dict[ScenarioId, ScenarioFixture]:
    raw = load_json(path)
    if raw.get("disclaimer") != MANDATORY_DISCLAIMER:
        raise ValueError("scenarios.json must preserve the mandatory disclaimer")
    if raw.get("formula") != FORMULA:
        raise ValueError("scenarios.json must preserve the frozen formula string")

    scenarios_raw = raw.get("scenarios")
    if not isinstance(scenarios_raw, dict):
        raise ValueError("scenarios.json must contain a scenarios object")
    if set(scenarios_raw) != set(ALLOWED_SCENARIOS):
        raise ValueError("scenarios.json must contain exactly normal, storm, heatwave_ev")

    zone_names = {
        zone_id: feature["properties"]["zone_name"]
        for zone_id, feature in (zone_features or load_zone_features()).items()
    }

    scenarios: dict[ScenarioId, ScenarioFixture] = {}
    for scenario_id in ALLOWED_SCENARIOS:
        scenario_raw = scenarios_raw[scenario_id]
        if not isinstance(scenario_raw, dict):
            raise ValueError(f"scenario {scenario_id!r} must be an object")
        if scenario_raw.get("scenario_id") != scenario_id:
            raise ValueError(f"scenario_id mismatch for {scenario_id!r}")

        display_name = scenario_raw.get("display_name")
        default_selected_zone_id = scenario_raw.get("default_selected_zone_id")
        peak_capacity = scenario_raw.get("peak_capacity_utilization_percent")
        zones_raw = scenario_raw.get("zones")
        if not isinstance(display_name, str) or not display_name:
            raise ValueError(f"scenario {scenario_id!r} requires display_name")
        if not isinstance(default_selected_zone_id, str):
            raise ValueError(f"scenario {scenario_id!r} requires default_selected_zone_id")
        if not isinstance(peak_capacity, int) or isinstance(peak_capacity, bool):
            raise ValueError(f"scenario {scenario_id!r} requires integer peak capacity")
        if not isinstance(zones_raw, dict):
            raise ValueError(f"scenario {scenario_id!r} requires a zones object")
        if set(zones_raw) != set(zone_names):
            raise ValueError(f"scenario {scenario_id!r} zones must match zones.geojson")
        if default_selected_zone_id not in zones_raw:
            raise ValueError(f"scenario {scenario_id!r} default selected zone is missing")

        zones: list[ZoneFixture] = []
        for zone_id, zone_raw in zones_raw.items():
            if not isinstance(zone_raw, dict):
                raise ValueError(f"zone {zone_id!r} in {scenario_id!r} must be an object")
            zones.append(
                ZoneFixture(
                    zone_id=zone_id,
                    zone_name=zone_names[zone_id],
                    scenario=scenario_id,
                    hazard_score=validate_score("hazard_score", zone_raw.get("hazard_score")),
                    infrastructure_score=validate_score(
                        "infrastructure_score",
                        zone_raw.get("infrastructure_score"),
                    ),
                    capacity_score=validate_score("capacity_score", zone_raw.get("capacity_score")),
                    primary_driver=_required_string(zone_raw, "primary_driver"),
                    recommended_action=_required_string(zone_raw, "recommended_action"),
                    urgency=validate_urgency(zone_raw.get("urgency")),
                )
            )

        scenarios[scenario_id] = ScenarioFixture(
            scenario=scenario_id,
            display_name=display_name,
            peak_capacity_utilization_percent=peak_capacity,
            default_selected_zone_id=default_selected_zone_id,
            zones=tuple(zones),
        )

    return scenarios


def _required_string(raw: dict[str, Any], key: str) -> str:
    value = raw.get(key)
    if not isinstance(value, str) or not value:
        raise ValueError(f"{key} must be a non-empty string")
    return value


def build_summary(scenario: ScenarioFixture) -> ScenarioSummary:
    scored_zones = tuple(score_zone(zone) for zone in scenario.zones)
    priority_zones = tuple(
        sorted(scored_zones, key=lambda zone: zone.risk_score, reverse=True)
    )
    return ScenarioSummary(
        scenario=scenario.scenario,
        display_name=scenario.display_name,
        generated_at=None,
        data_mode=DATA_MODE,
        formula=FORMULA,
        critical_zones=sum(zone.risk_level == "Critical" for zone in priority_zones),
        elevated_zones=sum(zone.risk_level == "Elevated" for zone in priority_zones),
        peak_capacity_utilization_percent=scenario.peak_capacity_utilization_percent,
        default_selected_zone_id=scenario.default_selected_zone_id,
        priority_zones=priority_zones,
        disclaimer=MANDATORY_DISCLAIMER,
    )


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.write("\n")


def generate_scenario(
    scenario_id: ScenarioId,
    *,
    output_dir: Path = OUTPUT_DIR,
) -> tuple[Path, Path]:
    zone_features = load_zone_features()
    scenarios = load_scenarios(zone_features=zone_features)
    scenario = scenarios[scenario_id]
    summary = build_summary(scenario)
    geojson = build_scored_geojson(
        scenario=scenario.scenario,
        display_name=scenario.display_name,
        zone_features=zone_features,
        scored_zones=summary.priority_zones,
    )

    summary_path = output_dir / f"summary_{scenario_id}.json"
    geojson_path = output_dir / f"scored_zones_{scenario_id}.geojson"
    write_json(summary_path, summary.to_dict())
    write_json(geojson_path, geojson)
    return summary_path, geojson_path


def copy_outputs_to_web(
    paths: tuple[Path, ...],
    *,
    web_generated_dir: Path = WEB_GENERATED_DIR,
) -> tuple[Path, ...]:
    web_generated_dir.mkdir(parents=True, exist_ok=True)
    copied: list[Path] = []
    for path in paths:
        destination = web_generated_dir / path.name
        shutil.copyfile(path, destination)
        copied.append(destination)
    return tuple(copied)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="GridLumen deterministic risk engine")
    parser.add_argument("--scenario", choices=list(ALLOWED_SCENARIOS))
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--copy-to-web", action="store_true")
    args = parser.parse_args(argv)

    if not args.scenario and not args.all:
        parser.error("Specify --scenario or --all")

    scenario_ids: tuple[ScenarioId, ...]
    if args.all:
        scenario_ids = ALLOWED_SCENARIOS
    else:
        scenario_ids = (require_allowed_scenario(args.scenario),)

    generated: list[Path] = []
    for scenario_id in scenario_ids:
        summary_path, geojson_path = generate_scenario(scenario_id)
        generated.extend([summary_path, geojson_path])
        print(f"Generated {summary_path}")
        print(f"Generated {geojson_path}")

    if args.copy_to_web:
        for copied_path in copy_outputs_to_web(tuple(generated)):
            print(f"Copied {copied_path}")

    print(MANDATORY_DISCLAIMER)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
