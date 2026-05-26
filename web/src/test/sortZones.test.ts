import { describe, expect, it } from "vitest";
import { sortByRiskScore } from "../lib/sortZones";
import { CANONICAL_SUMMARIES } from "../lib/fixtures/canonicalData";

describe("sortByRiskScore", () => {
  it("ranks storm scenario with Cooksville Central first at 87", () => {
    const sorted = sortByRiskScore(CANONICAL_SUMMARIES.storm.priority_zones);
    expect(sorted[0]?.zone_id).toBe("cooksville-central");
    expect(sorted[0]?.risk_score).toBe(87);
  });

  it("ranks heatwave scenario with Meadowvale North first at 91", () => {
    const sorted = sortByRiskScore(
      CANONICAL_SUMMARIES.heatwave_ev.priority_zones,
    );
    expect(sorted[0]?.zone_id).toBe("meadowvale-north");
    expect(sorted[0]?.risk_score).toBe(91);
  });

  it("ranks normal scenario with Meadowvale North first at 72", () => {
    const sorted = sortByRiskScore(CANONICAL_SUMMARIES.normal.priority_zones);
    expect(sorted[0]?.zone_id).toBe("meadowvale-north");
    expect(sorted[0]?.risk_score).toBe(72);
  });
});
