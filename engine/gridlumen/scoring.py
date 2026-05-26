"""Deterministic scoring functions for GridLumen risk outputs."""

from __future__ import annotations

from gridlumen.models import RiskLevel, ScoredZone, ZoneFixture

WEIGHTS = {
    "hazard_score": 0.40,
    "infrastructure_score": 0.30,
    "capacity_score": 0.30,
}


def calculate_risk_score(
    hazard_score: int,
    infrastructure_score: int,
    capacity_score: int,
) -> int:
    """Compute the frozen MVP Priority Risk score."""

    # Integer arithmetic avoids floating-point artifacts around canonical .5 values.
    weighted_hundredths = (
        40 * hazard_score
        + 30 * infrastructure_score
        + 30 * capacity_score
    )
    return (weighted_hundredths + 50) // 100


def categorize_risk(score: int) -> RiskLevel:
    """Classify Low 0-49, Elevated 50-69, Critical 70-100."""

    if score < 0 or score > 100:
        raise ValueError("risk score must be between 0 and 100")
    if score >= 70:
        return "Critical"
    if score >= 50:
        return "Elevated"
    return "Low"


def score_zone(zone: ZoneFixture) -> ScoredZone:
    risk_score = calculate_risk_score(
        zone.hazard_score,
        zone.infrastructure_score,
        zone.capacity_score,
    )
    return ScoredZone(
        zone_id=zone.zone_id,
        zone_name=zone.zone_name,
        scenario=zone.scenario,
        hazard_score=zone.hazard_score,
        infrastructure_score=zone.infrastructure_score,
        capacity_score=zone.capacity_score,
        risk_score=risk_score,
        risk_level=categorize_risk(risk_score),
        primary_driver=zone.primary_driver,
        recommended_action=zone.recommended_action,
        urgency=zone.urgency,
    )
