/** Shared data contracts — do not change without human approval (see CURSOR_TASKS.md). */

export const MANDATORY_DISCLAIMER =
  "Representative prototype data only; not an operational outage forecast or equipment-failure prediction." as const;

export const RISK_FORMULA =
  "Priority Risk Score = 0.40 × Hazard Exposure + 0.30 × Infrastructure Exposure + 0.30 × Capacity Stress" as const;

export type ScenarioId = "normal" | "storm" | "heatwave_ev";

export type RiskLevel = "Low" | "Elevated" | "Critical";

export type Urgency = "Routine" | "Medium" | "High" | "Immediate";

export interface RiskZoneProperties {
  zone_id: string;
  zone_name: string;
  scenario: ScenarioId;
  hazard_score: number;
  infrastructure_score: number;
  capacity_score: number;
  risk_score: number;
  risk_level: RiskLevel;
  primary_driver: string;
  recommended_action: string;
  urgency: Urgency;
  prototype_data: true;
  disclaimer: string;
}

export interface ScenarioSummary {
  scenario: ScenarioId;
  display_name: string;
  generated_at: string | null;
  data_mode: "representative" | "public_weather_enhanced";
  formula: string;
  critical_zones: number;
  elevated_zones: number;
  peak_capacity_utilization_percent: number;
  default_selected_zone_id: string;
  priority_zones: RiskZoneProperties[];
  disclaimer: string;
}

export interface ScoredZonesGeoJSON {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: GeoJSON.Polygon;
    properties: RiskZoneProperties;
  }>;
}
