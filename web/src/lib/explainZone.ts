import type { RiskZoneProperties, ScenarioId } from "../data/types";

/** Fixed template explanations — no LLM inference, no score recalculation. */
export function explainZone(
  zone: RiskZoneProperties,
  scenario: ScenarioId,
): string {
  const driver = zone.primary_driver.toLowerCase();

  if (scenario === "storm") {
    if (driver.includes("wind") || driver.includes("vegetation")) {
      return (
        "This zone is prioritized because the severe-storm scenario combines high wind exposure " +
        "with overhead/vegetation vulnerability. Capacity pressure contributes to risk but is not " +
        "presented as a confirmed overload or failure."
      );
    }
    if (driver.includes("flood") || driver.includes("rain") || driver.includes("water")) {
      return (
        "This zone is prioritized because heavy rain in the storm scenario increases exposure in " +
        "flood-sensitive areas. Infrastructure context is representative; this is not a confirmed outage forecast."
      );
    }
    return (
      "This zone ranks higher under the severe-storm scenario due to combined hazard and " +
      "infrastructure exposure in a generalized pilot area. Scores are representative prototype screening values."
    );
  }

  if (scenario === "heatwave_ev") {
    if (driver.includes("ev") || driver.includes("margin") || driver.includes("capacity")) {
      return (
        "This zone is prioritized because evening EV charging and heat-driven cooling demand stress " +
        "representative capacity margins. The app screens for planning review — not confirmed transformer overload."
      );
    }
    if (driver.includes("cooling") || driver.includes("density")) {
      return (
        "This zone is prioritized because dense load and cooling demand under the heatwave scenario " +
        "raise capacity-stress screening scores in this generalized area."
      );
    }
    return (
      "This zone ranks higher under the heatwave + EV demand scenario due to modeled capacity and " +
      "hazard pressure. Values are representative prototype inputs only."
    );
  }

  return (
    "Under normal conditions this zone still warrants attention based on representative infrastructure " +
    "and capacity context. The score reflects screening priorities, not a confirmed equipment failure."
  );
}
