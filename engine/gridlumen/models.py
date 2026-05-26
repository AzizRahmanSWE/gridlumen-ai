"""Validated data models for the deterministic GridLumen engine."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

ScenarioId = Literal["normal", "storm", "heatwave_ev"]
RiskLevel = Literal["Low", "Elevated", "Critical"]
Urgency = Literal["Routine", "Medium", "High", "Immediate"]

ALLOWED_SCENARIOS: tuple[ScenarioId, ...] = ("normal", "storm", "heatwave_ev")
ALLOWED_RISK_LEVELS: tuple[RiskLevel, ...] = ("Low", "Elevated", "Critical")
ALLOWED_URGENCY: tuple[Urgency, ...] = ("Routine", "Medium", "High", "Immediate")
DATA_MODE: Literal["representative"] = "representative"
MANDATORY_DISCLAIMER = (
    "Representative prototype data only; not an operational outage forecast "
    "or equipment-failure prediction."
)
FORMULA = (
    "Priority Risk Score = round(0.40 × Hazard Exposure + "
    "0.30 × Infrastructure Exposure + 0.30 × Capacity Stress)"
)


@dataclass(frozen=True)
class ZoneFixture:
    """Scenario-specific input values from the frozen fixture contract."""

    zone_id: str
    zone_name: str
    scenario: ScenarioId
    hazard_score: int
    infrastructure_score: int
    capacity_score: int
    primary_driver: str
    recommended_action: str
    urgency: Urgency


@dataclass(frozen=True)
class ScenarioFixture:
    """Validated scenario fixture before scoring."""

    scenario: ScenarioId
    display_name: str
    peak_capacity_utilization_percent: int
    default_selected_zone_id: str
    zones: tuple[ZoneFixture, ...]


@dataclass(frozen=True)
class ScoredZone:
    """Computed zone output shared by summary JSON and GeoJSON."""

    zone_id: str
    zone_name: str
    scenario: ScenarioId
    hazard_score: int
    infrastructure_score: int
    capacity_score: int
    risk_score: int
    risk_level: RiskLevel
    primary_driver: str
    recommended_action: str
    urgency: Urgency
    prototype_data: Literal[True] = True
    disclaimer: str = MANDATORY_DISCLAIMER

    def to_properties(self) -> dict[str, Any]:
        return {
            "zone_id": self.zone_id,
            "zone_name": self.zone_name,
            "scenario": self.scenario,
            "hazard_score": self.hazard_score,
            "infrastructure_score": self.infrastructure_score,
            "capacity_score": self.capacity_score,
            "risk_score": self.risk_score,
            "risk_level": self.risk_level,
            "primary_driver": self.primary_driver,
            "recommended_action": self.recommended_action,
            "urgency": self.urgency,
            "prototype_data": self.prototype_data,
            "disclaimer": self.disclaimer,
        }


@dataclass(frozen=True)
class ScenarioSummary:
    """Validated scenario summary written for frontend consumption."""

    scenario: ScenarioId
    display_name: str
    generated_at: None
    data_mode: Literal["representative"]
    formula: str
    critical_zones: int
    elevated_zones: int
    peak_capacity_utilization_percent: int
    default_selected_zone_id: str
    priority_zones: tuple[ScoredZone, ...]
    disclaimer: str
    prototype_data: Literal[True] = True

    def to_dict(self) -> dict[str, Any]:
        return {
            "scenario": self.scenario,
            "display_name": self.display_name,
            "generated_at": self.generated_at,
            "data_mode": self.data_mode,
            "formula": self.formula,
            "critical_zones": self.critical_zones,
            "elevated_zones": self.elevated_zones,
            "peak_capacity_utilization_percent": self.peak_capacity_utilization_percent,
            "default_selected_zone_id": self.default_selected_zone_id,
            "priority_zones": [zone.to_properties() for zone in self.priority_zones],
            "disclaimer": self.disclaimer,
            "prototype_data": self.prototype_data,
        }


def require_allowed_scenario(value: str) -> ScenarioId:
    if value not in ALLOWED_SCENARIOS:
        allowed = ", ".join(ALLOWED_SCENARIOS)
        raise ValueError(f"unsupported scenario_id {value!r}; expected one of: {allowed}")
    return value  # type: ignore[return-value]


def validate_score(name: str, value: Any) -> int:
    if not isinstance(value, int) or isinstance(value, bool):
        raise ValueError(f"{name} must be an integer")
    if value < 0 or value > 100:
        raise ValueError(f"{name} must be between 0 and 100")
    return value


def validate_urgency(value: Any) -> Urgency:
    if value not in ALLOWED_URGENCY:
        allowed = ", ".join(ALLOWED_URGENCY)
        raise ValueError(f"urgency {value!r} must be one of: {allowed}")
    return value  # type: ignore[return-value]
