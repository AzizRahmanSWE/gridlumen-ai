/**
 * Pre-computed canonical outputs matching DESIGN.md §7.4–7.5.
 * Used for tests and offline development until P1 copies files to public/data/generated/.
 * Scores are NOT computed at runtime in React — they mirror the deterministic engine output.
 */
import { MANDATORY_DISCLAIMER, RISK_FORMULA } from "../../data/types";
import type {
  RiskZoneProperties,
  ScenarioId,
  ScenarioSummary,
  ScoredZonesGeoJSON,
} from "../../data/types";

const DISCLAIMER = MANDATORY_DISCLAIMER;

type ZoneInput = Omit<
  RiskZoneProperties,
  "zone_id" | "zone_name" | "scenario" | "prototype_data" | "disclaimer"
> & { zone_id: string; zone_name: string };

const ZONE_NAMES: Record<string, string> = {
  "cooksville-central": "Cooksville Central",
  "meadowvale-north": "Meadowvale North",
  "port-credit-east": "Port Credit East",
  "streetsville-west": "Streetsville West",
  "erin-mills": "Erin Mills",
  "malton-industrial": "Malton Industrial",
  "clarkson-south": "Clarkson South",
  "city-centre": "City Centre",
};

const GEometries: Record<string, number[][][]> = {
  "cooksville-central": [
    [
      [-79.626, 43.58],
      [-79.611, 43.58],
      [-79.611, 43.594],
      [-79.626, 43.594],
      [-79.626, 43.58],
    ],
  ],
  "meadowvale-north": [
    [
      [-79.782, 43.608],
      [-79.762, 43.608],
      [-79.762, 43.628],
      [-79.782, 43.628],
      [-79.782, 43.608],
    ],
  ],
  "port-credit-east": [
    [
      [-79.592, 43.538],
      [-79.572, 43.538],
      [-79.572, 43.558],
      [-79.592, 43.558],
      [-79.592, 43.538],
    ],
  ],
  "streetsville-west": [
    [
      [-79.758, 43.568],
      [-79.738, 43.568],
      [-79.738, 43.588],
      [-79.758, 43.588],
      [-79.758, 43.568],
    ],
  ],
  "erin-mills": [
    [
      [-79.738, 43.528],
      [-79.718, 43.528],
      [-79.718, 43.548],
      [-79.738, 43.548],
      [-79.738, 43.528],
    ],
  ],
  "malton-industrial": [
    [
      [-79.648, 43.708],
      [-79.628, 43.708],
      [-79.628, 43.728],
      [-79.648, 43.728],
      [-79.648, 43.708],
    ],
  ],
  "clarkson-south": [
    [
      [-79.652, 43.498],
      [-79.632, 43.498],
      [-79.632, 43.518],
      [-79.652, 43.518],
      [-79.652, 43.498],
    ],
  ],
  "city-centre": [
    [
      [-79.658, 43.588],
      [-79.638, 43.588],
      [-79.638, 43.608],
      [-79.658, 43.608],
      [-79.658, 43.588],
    ],
  ],
};

function toZoneProps(
  scenario: ScenarioId,
  input: ZoneInput,
): RiskZoneProperties {
  return {
    ...input,
    zone_name: ZONE_NAMES[input.zone_id] ?? input.zone_name,
    scenario,
    prototype_data: true,
    disclaimer: DISCLAIMER,
  };
}

function buildGeoJSON(
  scenario: ScenarioId,
  zones: ZoneInput[],
): ScoredZonesGeoJSON {
  return {
    type: "FeatureCollection",
    features: zones.map((z) => ({
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: GEometries[z.zone_id] ?? [],
      },
      properties: toZoneProps(scenario, z),
    })),
  };
}

function buildSummary(
  scenario: ScenarioId,
  displayName: string,
  meta: {
    critical_zones: number;
    elevated_zones: number;
    peak_capacity_utilization_percent: number;
    default_selected_zone_id: string;
  },
  zones: ZoneInput[],
): ScenarioSummary {
  const priority_zones = zones.map((z) => toZoneProps(scenario, z));
  return {
    scenario,
    display_name: displayName,
    generated_at: null,
    data_mode: "representative",
    formula: RISK_FORMULA,
    ...meta,
    priority_zones,
    disclaimer: DISCLAIMER,
  };
}

const normalZones: ZoneInput[] = [
  {
    zone_id: "meadowvale-north",
    zone_name: "Meadowvale North",
    hazard_score: 50,
    infrastructure_score: 72,
    capacity_score: 100,
    risk_score: 72,
    risk_level: "Critical",
    primary_driver: "Low margin",
    recommended_action: "Review capacity planning",
    urgency: "High",
  },
  {
    zone_id: "cooksville-central",
    zone_name: "Cooksville Central",
    hazard_score: 45,
    infrastructure_score: 82,
    capacity_score: 63,
    risk_score: 62,
    risk_level: "Elevated",
    primary_driver: "Vegetation/overhead exposure",
    recommended_action: "Monitor corridor conditions",
    urgency: "Medium",
  },
  {
    zone_id: "port-credit-east",
    zone_name: "Port Credit East",
    hazard_score: 66,
    infrastructure_score: 62,
    capacity_score: 45,
    risk_score: 59,
    risk_level: "Elevated",
    primary_driver: "Water exposure",
    recommended_action: "Monitor flood context",
    urgency: "Medium",
  },
  {
    zone_id: "streetsville-west",
    zone_name: "Streetsville West",
    hazard_score: 40,
    infrastructure_score: 75,
    capacity_score: 50,
    risk_score: 54,
    risk_level: "Elevated",
    primary_driver: "Tree canopy overlap",
    recommended_action: "Schedule vegetation review",
    urgency: "Medium",
  },
  {
    zone_id: "city-centre",
    zone_name: "City Centre",
    hazard_score: 30,
    infrastructure_score: 48,
    capacity_score: 68,
    risk_score: 47,
    risk_level: "Low",
    primary_driver: "Dense demand",
    recommended_action: "Routine monitoring",
    urgency: "Routine",
  },
  {
    zone_id: "erin-mills",
    zone_name: "Erin Mills",
    hazard_score: 35,
    infrastructure_score: 45,
    capacity_score: 48,
    risk_score: 42,
    risk_level: "Low",
    primary_driver: "Residential demand",
    recommended_action: "Routine monitoring",
    urgency: "Routine",
  },
  {
    zone_id: "malton-industrial",
    zone_name: "Malton Industrial",
    hazard_score: 30,
    infrastructure_score: 40,
    capacity_score: 53,
    risk_score: 40,
    risk_level: "Low",
    primary_driver: "Industrial demand",
    recommended_action: "Routine monitoring",
    urgency: "Routine",
  },
  {
    zone_id: "clarkson-south",
    zone_name: "Clarkson South",
    hazard_score: 41,
    infrastructure_score: 40,
    capacity_score: 32,
    risk_score: 38,
    risk_level: "Low",
    primary_driver: "Water context",
    recommended_action: "Routine monitoring",
    urgency: "Routine",
  },
];

const stormZones: ZoneInput[] = [
  {
    zone_id: "cooksville-central",
    zone_name: "Cooksville Central",
    hazard_score: 95,
    infrastructure_score: 90,
    capacity_score: 73,
    risk_score: 87,
    risk_level: "Critical",
    primary_driver: "Wind + overhead + vegetation",
    recommended_action: "Inspect overhead corridors",
    urgency: "Immediate",
  },
  {
    zone_id: "meadowvale-north",
    zone_name: "Meadowvale North",
    hazard_score: 80,
    infrastructure_score: 68,
    capacity_score: 99,
    risk_score: 82,
    risk_level: "Critical",
    primary_driver: "Storm plus constrained margin",
    recommended_action: "Stage demand monitoring",
    urgency: "Immediate",
  },
  {
    zone_id: "port-credit-east",
    zone_name: "Port Credit East",
    hazard_score: 94,
    infrastructure_score: 88,
    capacity_score: 48,
    risk_score: 78,
    risk_level: "Critical",
    primary_driver: "Rain/flood exposure",
    recommended_action: "Check flood-sensitive areas",
    urgency: "Immediate",
  },
  {
    zone_id: "streetsville-west",
    zone_name: "Streetsville West",
    hazard_score: 72,
    infrastructure_score: 76,
    capacity_score: 45,
    risk_score: 65,
    risk_level: "Elevated",
    primary_driver: "Tree canopy overlap",
    recommended_action: "Schedule vegetation review",
    urgency: "Medium",
  },
  {
    zone_id: "clarkson-south",
    zone_name: "Clarkson South",
    hazard_score: 75,
    infrastructure_score: 58,
    capacity_score: 40,
    risk_score: 59,
    risk_level: "Elevated",
    primary_driver: "Water exposure",
    recommended_action: "Monitor flood context",
    urgency: "Medium",
  },
  {
    zone_id: "city-centre",
    zone_name: "City Centre",
    hazard_score: 63,
    infrastructure_score: 45,
    capacity_score: 55,
    risk_score: 55,
    risk_level: "Elevated",
    primary_driver: "Dense demand",
    recommended_action: "Monitor evening peak",
    urgency: "Medium",
  },
  {
    zone_id: "erin-mills",
    zone_name: "Erin Mills",
    hazard_score: 60,
    infrastructure_score: 50,
    capacity_score: 40,
    risk_score: 51,
    risk_level: "Elevated",
    primary_driver: "Storm exposure",
    recommended_action: "Monitor corridor conditions",
    urgency: "Medium",
  },
  {
    zone_id: "malton-industrial",
    zone_name: "Malton Industrial",
    hazard_score: 50,
    infrastructure_score: 40,
    capacity_score: 45,
    risk_score: 46,
    risk_level: "Low",
    primary_driver: "Industrial demand",
    recommended_action: "Continue monitoring",
    urgency: "Routine",
  },
];

const heatwaveZones: ZoneInput[] = [
  {
    zone_id: "meadowvale-north",
    zone_name: "Meadowvale North",
    hazard_score: 95,
    infrastructure_score: 77,
    capacity_score: 100,
    risk_score: 91,
    risk_level: "Critical",
    primary_driver: "EV demand + low margin",
    recommended_action: "Review load-relief strategy",
    urgency: "Immediate",
  },
  {
    zone_id: "city-centre",
    zone_name: "City Centre",
    hazard_score: 90,
    infrastructure_score: 55,
    capacity_score: 94,
    risk_score: 81,
    risk_level: "Critical",
    primary_driver: "Cooling + density",
    recommended_action: "Monitor evening peak",
    urgency: "Immediate",
  },
  {
    zone_id: "erin-mills",
    zone_name: "Erin Mills",
    hazard_score: 72,
    infrastructure_score: 50,
    capacity_score: 85,
    risk_score: 69,
    risk_level: "Elevated",
    primary_driver: "Residential EV adoption",
    recommended_action: "Planning review",
    urgency: "High",
  },
  {
    zone_id: "cooksville-central",
    zone_name: "Cooksville Central",
    hazard_score: 68,
    infrastructure_score: 65,
    capacity_score: 65,
    risk_score: 66,
    risk_level: "Elevated",
    primary_driver: "Cooling demand",
    recommended_action: "Monitor threshold",
    urgency: "Medium",
  },
  {
    zone_id: "malton-industrial",
    zone_name: "Malton Industrial",
    hazard_score: 70,
    infrastructure_score: 50,
    capacity_score: 64,
    risk_score: 62,
    risk_level: "Elevated",
    primary_driver: "Commercial demand",
    recommended_action: "Evaluate margin",
    urgency: "Medium",
  },
  {
    zone_id: "streetsville-west",
    zone_name: "Streetsville West",
    hazard_score: 60,
    infrastructure_score: 52,
    capacity_score: 55,
    risk_score: 56,
    risk_level: "Elevated",
    primary_driver: "Residential demand",
    recommended_action: "Monitor evening peak",
    urgency: "Medium",
  },
  {
    zone_id: "clarkson-south",
    zone_name: "Clarkson South",
    hazard_score: 57,
    infrastructure_score: 44,
    capacity_score: 55,
    risk_score: 53,
    risk_level: "Elevated",
    primary_driver: "Heat demand",
    recommended_action: "Monitor threshold",
    urgency: "Medium",
  },
  {
    zone_id: "port-credit-east",
    zone_name: "Port Credit East",
    hazard_score: 60,
    infrastructure_score: 40,
    capacity_score: 40,
    risk_score: 48,
    risk_level: "Low",
    primary_driver: "Water context",
    recommended_action: "Continue routine monitoring",
    urgency: "Routine",
  },
];

export const CANONICAL_SUMMARIES: Record<ScenarioId, ScenarioSummary> = {
  normal: buildSummary("normal", "Normal Conditions", {
    critical_zones: 1,
    elevated_zones: 3,
    peak_capacity_utilization_percent: 71,
    default_selected_zone_id: "meadowvale-north",
  }, normalZones),
  storm: buildSummary("storm", "Severe Wind & Rain Storm", {
    critical_zones: 3,
    elevated_zones: 4,
    peak_capacity_utilization_percent: 76,
    default_selected_zone_id: "cooksville-central",
  }, stormZones),
  heatwave_ev: buildSummary("heatwave_ev", "Heatwave + Evening EV Demand", {
    critical_zones: 2,
    elevated_zones: 5,
    peak_capacity_utilization_percent: 94,
    default_selected_zone_id: "meadowvale-north",
  }, heatwaveZones),
};

export const CANONICAL_GEOJSON: Record<ScenarioId, ScoredZonesGeoJSON> = {
  normal: buildGeoJSON("normal", normalZones),
  storm: buildGeoJSON("storm", stormZones),
  heatwave_ev: buildGeoJSON("heatwave_ev", heatwaveZones),
};

export const ALL_SCENARIO_IDS: ScenarioId[] = [
  "normal",
  "storm",
  "heatwave_ev",
];
