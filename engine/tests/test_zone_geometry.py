from __future__ import annotations

import json
from pathlib import Path

from gridlumen.models import MANDATORY_DISCLAIMER

DATA = Path(__file__).resolve().parents[1] / "data" / "demo" / "zones.geojson"
EXPECTED_ZONE_IDS = {
    "cooksville-central",
    "meadowvale-north",
    "port-credit-east",
    "streetsville-west",
    "erin-mills",
    "malton-industrial",
    "clarkson-south",
    "city-centre",
}


def test_zone_geometry_metadata_contains_attribution() -> None:
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    metadata = payload["metadata"]
    assert metadata["disclaimer"] == MANDATORY_DISCLAIMER
    assert "ward-derived" in metadata["geometry_note"].lower()
    assert "city of mississauga" in metadata["geometry_source"].lower()
    assert metadata["geometry_retrieved_on"] == "2026-05-26"


def test_zone_geometry_ids_preserved() -> None:
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    features = payload["features"]
    assert len(features) == 8
    ids = {feature["properties"]["zone_id"] for feature in features}
    assert ids == EXPECTED_ZONE_IDS


def test_zone_geometry_is_not_axis_aligned_rectangles() -> None:
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    features = payload["features"]
    for feature in features:
        geometry = feature["geometry"]
        assert geometry["type"] in {"Polygon", "MultiPolygon"}
        if geometry["type"] == "Polygon":
            assert len(geometry["coordinates"][0]) > 5
        else:
            first_ring = geometry["coordinates"][0][0]
            assert len(first_ring) > 5


def test_zone_geometry_within_mississauga_screening_extent() -> None:
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    coords: list[tuple[float, float]] = []
    for feature in payload["features"]:
        geometry = feature["geometry"]
        if geometry["type"] == "Polygon":
            rings = geometry["coordinates"]
        else:
            rings = [ring for polygon in geometry["coordinates"] for ring in polygon]
        for ring in rings:
            coords.extend((lon, lat) for lon, lat in ring)

    lons = [lon for lon, _ in coords]
    lats = [lat for _, lat in coords]
    assert min(lons) > -80
    assert max(lons) < -79
    assert min(lats) > 43
    assert max(lats) < 44
