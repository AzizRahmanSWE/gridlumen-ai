import { useCallback, useEffect, useMemo, useState } from "react";
import type { ScenarioId, ScenarioSummary, ScoredZonesGeoJSON } from "../data/types";
import {
  ALL_SCENARIO_IDS,
  CANONICAL_SUMMARIES,
} from "../lib/fixtures/canonicalData";
import {
  baselineDelta,
  getZoneFromSummary,
  loadAllScenarios,
  type AllScenariosData,
} from "../lib/scenarioData";
import { sortByRiskScore } from "../lib/sortZones";

export type UseScenarioOptions = {
  /** Initial scenario — default demo is storm per DESIGN.md */
  initialScenario?: ScenarioId;
  /** Preloaded data (for tests); skips fetch when provided */
  preloaded?: AllScenariosData;
};

export type UseScenarioResult = {
  scenario: ScenarioId;
  setScenario: (id: ScenarioId) => void;
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  summary: ScenarioSummary | null;
  geojson: ScoredZonesGeoJSON | null;
  selectedZone: ReturnType<typeof getZoneFromSummary>;
  rankedQueue: ReturnType<typeof sortByRiskScore>;
  baselineScoreDelta: number | null;
  loading: boolean;
  error: string | null;
  /** KPI-compatible summary for presentational shell (P2) */
  activeSummary: ScenarioSummary | null;
};

export function useScenario(options: UseScenarioOptions = {}): UseScenarioResult {
  const initialScenario = options.initialScenario ?? "storm";
  const [scenario, setScenarioState] = useState<ScenarioId>(initialScenario);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    CANONICAL_SUMMARIES[initialScenario].default_selected_zone_id,
  );
  const [data, setData] = useState<AllScenariosData | null>(
    options.preloaded ?? null,
  );
  const [loading, setLoading] = useState(!options.preloaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options.preloaded) {
      setData(options.preloaded);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadAllScenarios(true)
      .then((loaded) => {
        if (!cancelled) {
          setData(loaded);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load scenarios");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [options.preloaded]);

  const setScenario = useCallback(
    (id: ScenarioId) => {
      setScenarioState(id);
      const defaultId = (
        data?.[id]?.summary ?? CANONICAL_SUMMARIES[id]
      ).default_selected_zone_id;
      setSelectedZoneId(defaultId);
    },
    [data],
  );

  const bundle = data?.[scenario] ?? null;
  const summary = bundle?.summary ?? null;
  const geojson = bundle?.geojson ?? null;

  const selectedZone = useMemo(() => {
    if (!summary) return undefined;
    return getZoneFromSummary(summary, selectedZoneId);
  }, [summary, selectedZoneId]);

  const rankedQueue = useMemo(() => {
    if (!summary) return [];
    return sortByRiskScore(summary.priority_zones);
  }, [summary]);

  const baselineScoreDelta = useMemo(() => {
    if (!summary || !data) return null;
    const zone = getZoneFromSummary(summary, selectedZoneId);
    if (!zone) return null;
    return baselineDelta(data.normal?.summary, selectedZoneId, zone.risk_score);
  }, [summary, data, selectedZoneId]);

  return {
    scenario,
    setScenario,
    selectedZoneId,
    setSelectedZoneId,
    summary,
    geojson,
    selectedZone,
    rankedQueue,
    baselineScoreDelta,
    loading,
    error,
    activeSummary: summary,
  };
}

export { ALL_SCENARIO_IDS };
