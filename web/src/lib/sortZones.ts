import type { RiskZoneProperties } from "../data/types";

/** Sort zones by risk score descending — consumes engine-provided values only. */
export function sortByRiskScore(
  zones: RiskZoneProperties[],
): RiskZoneProperties[] {
  return [...zones].sort((a, b) => b.risk_score - a.risk_score);
}
