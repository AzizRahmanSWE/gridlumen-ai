"""GeoJSON export helpers for scored generalized zones."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

from gridlumen.models import MANDATORY_DISCLAIMER, ScenarioId, ScoredZone


def build_scored_geojson(
    *,
    scenario: ScenarioId,
    display_name: str,
    zone_features: dict[str, dict[str, Any]],
    scored_zones: tuple[ScoredZone, ...],
) -> dict[str, Any]:
    """Attach scored properties to generalized zone geometries."""

    features: list[dict[str, Any]] = []
    for scored_zone in scored_zones:
        source_feature = zone_features.get(scored_zone.zone_id)
        if source_feature is None:
            raise ValueError(f"missing geometry for zone_id {scored_zone.zone_id!r}")

        geometry = deepcopy(source_feature.get("geometry"))
        if not isinstance(geometry, dict) or geometry.get("type") not in {"Polygon", "MultiPolygon"}:
            raise ValueError(f"zone {scored_zone.zone_id!r} must use Polygon or MultiPolygon geometry")

        features.append(
            {
                "type": "Feature",
                "geometry": geometry,
                "properties": scored_zone.to_properties(),
            }
        )

    return {
        "type": "FeatureCollection",
        "metadata": {
            "scenario": scenario,
            "display_name": display_name,
            "prototype_data": True,
            "disclaimer": MANDATORY_DISCLAIMER,
            "geometry_note": "Generalized public screening geography (ward-derived), not utility asset topology.",
            "geometry_source": "City of Mississauga — Ward Boundaries",
            "geometry_source_url": "https://data.mississauga.ca/datasets/ward-boundaries/about",
            "geometry_retrieved_on": "2026-05-26",
            "geometry_attribution": "Contains information licensed under the City of Mississauga Open Data Terms of Use.",
            "join_note": "Risk scores are representative prototype values joined to public screening geography.",
        },
        "features": features,
    }
