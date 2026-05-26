import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useScenario } from "../hooks/useScenario";
import {
  CANONICAL_GEOJSON,
  CANONICAL_SUMMARIES,
} from "../lib/fixtures/canonicalData";
import type { AllScenariosData } from "../lib/scenarioData";

const preloaded: AllScenariosData = {
  normal: {
    summary: CANONICAL_SUMMARIES.normal,
    geojson: CANONICAL_GEOJSON.normal,
  },
  storm: {
    summary: CANONICAL_SUMMARIES.storm,
    geojson: CANONICAL_GEOJSON.storm,
  },
  heatwave_ev: {
    summary: CANONICAL_SUMMARIES.heatwave_ev,
    geojson: CANONICAL_GEOJSON.heatwave_ev,
  },
};

describe("useScenario", () => {
  it("defaults to storm with Cooksville Central selected", () => {
    const { result } = renderHook(() =>
      useScenario({ preloaded, initialScenario: "storm" }),
    );
    expect(result.current.scenario).toBe("storm");
    expect(result.current.selectedZoneId).toBe("cooksville-central");
    expect(result.current.selectedZone?.risk_score).toBe(87);
  });

  it("resets selection when scenario changes to heatwave", () => {
    const { result } = renderHook(() =>
      useScenario({ preloaded, initialScenario: "storm" }),
    );
    act(() => result.current.setScenario("heatwave_ev"));
    expect(result.current.selectedZoneId).toBe("meadowvale-north");
    expect(result.current.selectedZone?.risk_score).toBe(91);
  });

  it("updates selected zone independently", () => {
    const { result } = renderHook(() =>
      useScenario({ preloaded, initialScenario: "storm" }),
    );
    act(() => result.current.setSelectedZoneId("port-credit-east"));
    expect(result.current.selectedZone?.zone_name).toBe("Port Credit East");
  });

  it("provides KPI-compatible summary", () => {
    const { result } = renderHook(() =>
      useScenario({ preloaded, initialScenario: "storm" }),
    );
    expect(result.current.activeSummary?.critical_zones).toBe(3);
    expect(result.current.activeSummary?.peak_capacity_utilization_percent).toBe(
      76,
    );
  });
});
