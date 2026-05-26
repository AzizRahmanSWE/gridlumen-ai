"""Build public screening geometry from City of Mississauga ward boundaries."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
RAW_GEOJSON = ROOT / "data" / "raw" / "wards_mississauga.geojson"
MANIFEST_PATH = ROOT / "data" / "zone_geometry_manifest.json"
OUTPUT_PATH = ROOT / "data" / "demo" / "zones.geojson"

MANDATORY_DISCLAIMER = (
    "Representative prototype data only; not an operational outage forecast "
    "or equipment-failure prediction."
)
GEOMETRY_JOIN_NOTE = (
    "Risk scores and drivers are representative prototype values joined to public "
    "City of Mississauga screening geography for demonstration; polygons are not "
    "utility asset locations or operational service boundaries."
)
GEOMETRY_NOTE = (
    "Generalized public screening geography (ward-derived); not utility asset "
    "topology or service boundaries."
)


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return payload


def main() -> int:
    raw = load_json(RAW_GEOJSON)
    manifest = load_json(MANIFEST_PATH)

    features = raw.get("features")
    if not isinstance(features, list):
        raise ValueError("raw ward GeoJSON must contain feature list")

    by_ward: dict[str, dict[str, Any]] = {}
    for feature in features:
        if not isinstance(feature, dict):
            continue
        props = feature.get("properties", {})
        if not isinstance(props, dict):
            continue
        ward = props.get("WARD")
        if isinstance(ward, (str, int)):
            by_ward[str(ward)] = feature

    mappings = manifest.get("mappings")
    if not isinstance(mappings, list):
        raise ValueError("manifest must define mappings list")

    out_features: list[dict[str, Any]] = []
    for row in mappings:
        if not isinstance(row, dict):
            continue
        zone_id = row.get("zone_id")
        zone_name = row.get("zone_name")
        screening_geometry = row.get("screening_geometry", {})
        if not isinstance(zone_id, str) or not isinstance(zone_name, str):
            raise ValueError("mapping rows require zone_id and zone_name")
        ward = str(screening_geometry.get("ward"))
        source = by_ward.get(ward)
        if source is None:
            raise ValueError(f"missing ward geometry for ward {ward}")

        geometry = source.get("geometry")
        if not isinstance(geometry, dict):
            raise ValueError(f"ward {ward} geometry missing")

        out_features.append(
            {
                "type": "Feature",
                "properties": {"zone_id": zone_id, "zone_name": zone_name},
                "geometry": geometry,
            }
        )

    payload = {
        "type": "FeatureCollection",
        "metadata": {
            "description": "Generalized Mississauga public screening zones (ward-derived) for hackathon prototype only",
            "disclaimer": MANDATORY_DISCLAIMER,
            "geometry_note": GEOMETRY_NOTE,
            "join_note": GEOMETRY_JOIN_NOTE,
            "geometry_source": "City of Mississauga — Ward Boundaries",
            "geometry_source_url": "https://data.mississauga.ca/datasets/ward-boundaries/about",
            "geometry_retrieved_on": manifest.get("retrieved_on", "2026-05-26"),
            "geometry_attribution": "Contains information licensed under the City of Mississauga Open Data Terms of Use.",
        },
        "features": out_features,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
