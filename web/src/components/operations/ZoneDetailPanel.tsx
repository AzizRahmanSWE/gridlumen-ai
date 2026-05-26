import type { RiskZoneProperties, ScenarioId } from "../../data/types";
import { MANDATORY_DISCLAIMER } from "../../data/types";
import { explainZone } from "../../lib/explainZone";
import { riskLevelClass } from "../../lib/riskStyles";

export type ZoneDetailPanelProps = {
  zone: RiskZoneProperties | undefined;
  scenario: ScenarioId;
  baselineDelta: number | null;
};

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-[#667085]">{label}</span>
        <span className="font-medium text-[#101828]">{value}</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[#E4E7EC]"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value} out of 100`}
      >
        <div
          className="h-full rounded-full bg-[#1570EF] transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function ZoneDetailPanel({
  zone,
  scenario,
  baselineDelta,
}: ZoneDetailPanelProps) {
  if (!zone) {
    return (
      <aside
        className="rounded-2xl border border-[#E4E7EC] bg-white p-5 text-sm text-[#667085]"
        aria-label="Selected zone details"
      >
        Select a zone on the map or intervention queue to view details.
      </aside>
    );
  }

  const deltaLabel =
    baselineDelta === null
      ? null
      : baselineDelta >= 0
        ? `+${baselineDelta} vs normal`
        : `${baselineDelta} vs normal`;

  return (
    <aside
      className="flex flex-col gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm"
      aria-label={`Details for ${zone.zone_name}`}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
          Selected zone
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[#101828]">
          {zone.zone_name}
        </h2>
        <p className="text-xs text-[#667085]">Generalized Grid Risk Area</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskLevelClass(zone.risk_level)}`}
        >
          {zone.risk_level}
        </span>
        <span className="text-2xl font-bold text-[#101828]">
          {zone.risk_score}
          <span className="text-sm font-normal text-[#667085]">/100</span>
        </span>
        {deltaLabel && (
          <span className="text-sm font-medium text-[#1570EF]">{deltaLabel}</span>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#101828]">Risk drivers</h3>
        <ScoreBar label="Hazard exposure" value={zone.hazard_score} />
        <ScoreBar label="Infrastructure exposure" value={zone.infrastructure_score} />
        <ScoreBar label="Capacity stress" value={zone.capacity_score} />
      </div>

      <p className="text-sm leading-relaxed text-[#667085]">
        {explainZone(zone, scenario)}
      </p>

      <div className="rounded-xl bg-[#F5F8FC] p-3">
        <h3 className="text-sm font-semibold text-[#101828]">
          Recommended action
        </h3>
        <p className="mt-1 text-sm text-[#101828]">{zone.recommended_action}</p>
        <p className="mt-2 text-xs font-medium text-[#1570EF]">
          Urgency: {zone.urgency}
        </p>
      </div>

      <p
        className="rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-900"
        role="note"
      >
        {MANDATORY_DISCLAIMER}
      </p>
    </aside>
  );
}
