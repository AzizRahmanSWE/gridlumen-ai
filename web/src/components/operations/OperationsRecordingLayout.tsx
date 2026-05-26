import type { RiskZoneProperties, ScenarioId, ScoredZonesGeoJSON } from "../../data/types";
import { DataStatusChips } from "./DataStatusChips";
import { InterventionQueue } from "./InterventionQueue";
import { RiskLegend } from "./RiskLegend";
import { RiskMap } from "./RiskMap";
import { ZoneDetailPanel } from "./ZoneDetailPanel";

export type OperationsRecordingLayoutProps = {
  geojson: ScoredZonesGeoJSON | null;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  loading?: boolean;
  selectedZone: RiskZoneProperties | undefined;
  scenario: ScenarioId;
  baselineDelta: number | null;
  rankedQueue: RiskZoneProperties[];
};

export function OperationsRecordingLayout({
  geojson,
  selectedZoneId,
  onSelectZone,
  loading = false,
  selectedZone,
  scenario,
  baselineDelta,
  rankedQueue,
}: OperationsRecordingLayoutProps) {
  return (
    <div
      className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,380px)]"
    >
      <section
        aria-label="Risk map and intervention queue"
        id="risk-map"
        className="flex min-w-0 flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-card)]"
      >
        <DataStatusChips />
        <RiskMap
          geojson={geojson}
          selectedZoneId={selectedZoneId}
          onSelectZone={onSelectZone}
          loading={loading}
          compact
        />
        <RiskLegend compact />
        <div id="interventions">
          <InterventionQueue
            zones={rankedQueue}
            selectedZoneId={selectedZoneId}
            onSelectZone={onSelectZone}
            compact
          />
        </div>
      </section>

      <div className="xl:sticky xl:top-4">
        <ZoneDetailPanel
          zone={selectedZone}
          scenario={scenario}
          baselineDelta={baselineDelta}
        />
      </div>
    </div>
  );
}
