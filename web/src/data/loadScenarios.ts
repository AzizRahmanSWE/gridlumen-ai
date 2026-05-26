import type { ScenarioId, ScenarioSummary, ScoredZonesGeoJSON } from "./types";

/** Load generated outputs from `public/data/generated/` (implemented in P3 / I1). */

export async function loadScenarioSummary(
  scenario: ScenarioId,
): Promise<ScenarioSummary> {
  const res = await fetch(`/data/generated/summary_${scenario}.json`);
  if (!res.ok) {
    throw new Error(
      `Missing summary_${scenario}.json — run engine P1 and copy outputs to web/public/data/generated/`,
    );
  }
  return res.json() as Promise<ScenarioSummary>;
}

export async function loadScoredZones(
  scenario: ScenarioId,
): Promise<ScoredZonesGeoJSON> {
  const res = await fetch(`/data/generated/scored_zones_${scenario}.geojson`);
  if (!res.ok) {
    throw new Error(
      `Missing scored_zones_${scenario}.geojson — run engine P1 first`,
    );
  }
  return res.json() as Promise<ScoredZonesGeoJSON>;
}
