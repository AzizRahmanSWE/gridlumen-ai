import type { ScenarioId, ScenarioSummary, ScoredZonesGeoJSON } from "../data/types";
import { loadScenarioSummary, loadScoredZones } from "../data/loadScenarios";
import {
  ALL_SCENARIO_IDS,
  CANONICAL_GEOJSON,
  CANONICAL_SUMMARIES,
} from "./fixtures/canonicalData";

export type ScenarioBundle = {
  summary: ScenarioSummary;
  geojson: ScoredZonesGeoJSON;
};

export type AllScenariosData = Record<ScenarioId, ScenarioBundle>;

/**
 * Load all scenario bundles from generated files.
 * Falls back to bundled canonical fixtures when P1 outputs are not yet present (dev/tests).
 */
export async function loadAllScenarios(
  useFallback = true,
): Promise<AllScenariosData> {
  const entries = await Promise.all(
    ALL_SCENARIO_IDS.map(async (id) => {
      try {
        const [summary, geojson] = await Promise.all([
          loadScenarioSummary(id),
          loadScoredZones(id),
        ]);
        return [id, { summary, geojson }] as const;
      } catch {
        if (!useFallback) throw new Error(`Failed to load scenario: ${id}`);
        return [
          id,
          {
            summary: CANONICAL_SUMMARIES[id],
            geojson: CANONICAL_GEOJSON[id],
          },
        ] as const;
      }
    }),
  );
  return Object.fromEntries(entries) as AllScenariosData;
}

export function getZoneFromSummary(
  summary: ScenarioSummary,
  zoneId: string,
) {
  return summary.priority_zones.find((z) => z.zone_id === zoneId);
}

export function baselineDelta(
  normalSummary: ScenarioSummary | undefined,
  zoneId: string,
  currentScore: number,
): number | null {
  if (!normalSummary) return null;
  const baseline = getZoneFromSummary(normalSummary, zoneId);
  if (!baseline) return null;
  return currentScore - baseline.risk_score;
}
