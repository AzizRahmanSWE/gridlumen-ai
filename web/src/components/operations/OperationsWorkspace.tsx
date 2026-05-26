import { useState } from "react";
import { Lock } from "lucide-react";
import { MANDATORY_DISCLAIMER } from "../../data/types";
import { useScenario } from "../../hooks/useScenario";
import type { UseScenarioOptions } from "../../hooks/useScenario";
import { InterventionQueue } from "./InterventionQueue";
import { RiskLegend } from "./RiskLegend";
import { RiskMap } from "./RiskMap";
import { ScenarioToggle } from "./ScenarioToggle";
import { SecuredUtilityLayerModal } from "./SecuredUtilityLayerModal";
import { ZoneDetailPanel } from "./ZoneDetailPanel";

export type OperationsWorkspaceProps = UseScenarioOptions & {
  /** Show compact prototype banner above workspace */
  showPrototypeBanner?: boolean;
};

/**
 * Self-contained operations workspace for P3 validation and I1 integration.
 * Wire scenario props from HeroControls (P2) via shared useScenario at App level.
 */
export function OperationsWorkspace({
  showPrototypeBanner = true,
  ...hookOptions
}: OperationsWorkspaceProps) {
  const {
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
  } = useScenario(hookOptions);

  const [securedOpen, setSecuredOpen] = useState(false);

  return (
    <div className="space-y-6">
      {showPrototypeBanner && (
        <p
          className="rounded-lg border border-amber-300/40 bg-amber-950/40 px-4 py-2 text-center text-xs text-amber-100"
          role="note"
        >
          <span className="font-semibold uppercase tracking-wide">
            Prototype demo
          </span>
          {" · "}
          {MANDATORY_DISCLAIMER}
        </p>
      )}

      <div className="flex flex-col gap-4 rounded-2xl bg-[#0B2545] p-4 sm:p-5">
        <ScenarioToggle
          activeScenario={scenario}
          onScenarioChange={setScenario}
          disabled={loading}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-cyan-100/80">
          <span>Forecast horizon: Next 24 hours</span>
          <span>Public risk view</span>
          <button
            type="button"
            onClick={() => setSecuredOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 font-medium text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Secured layer
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300/50 bg-red-950/30 px-4 py-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,340px)]">
        <div className="space-y-3">
          <RiskMap
            geojson={geojson}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
            loading={loading}
          />
          <RiskLegend />
        </div>
        <ZoneDetailPanel
          zone={selectedZone}
          scenario={scenario}
          baselineDelta={baselineScoreDelta}
        />
      </div>

      <InterventionQueue
        zones={rankedQueue}
        selectedZoneId={selectedZoneId}
        onSelectZone={setSelectedZoneId}
      />

      {summary && (
        <p className="sr-only" aria-live="polite">
          Active scenario: {summary.display_name}. {summary.critical_zones}{" "}
          critical zones, {summary.elevated_zones} elevated.
        </p>
      )}

      <SecuredUtilityLayerModal
        open={securedOpen}
        onClose={() => setSecuredOpen(false)}
      />
    </div>
  );
}

/** KPI-compatible fields for P2 KpiCards integration */
export function kpiFromSummary(summary: NonNullable<ReturnType<typeof useScenario>["summary"]>) {
  const top = summary.priority_zones.reduce((a, b) =>
    a.risk_score >= b.risk_score ? a : b,
  );
  return {
    criticalZones: summary.critical_zones,
    elevatedZones: summary.elevated_zones,
    zonesToReview: summary.critical_zones + summary.elevated_zones,
    peakUtilization: `${summary.peak_capacity_utilization_percent}% modeled`,
    highestPriorityZone: top.zone_name,
    topAction: top.recommended_action,
  };
}
