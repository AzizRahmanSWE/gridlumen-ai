import type { RiskZoneProperties, ScenarioId } from "../../data/types";
import { MANDATORY_DISCLAIMER } from "../../data/types";
import { explainZone } from "../../lib/explainZone";
import { RiskBadge } from "../layout/ui";

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
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-mono text-xs font-medium text-[var(--text-primary)]">
          {value}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[var(--border)]"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value} out of 100`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--blue-600)] to-[var(--cyan-400)] transition-all duration-300"
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
        className="gl-panel flex min-h-[280px] items-center justify-center p-5 text-sm text-[var(--text-muted)]"
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
      className="gl-panel flex flex-col gap-4 p-5"
      aria-label={`Details for ${zone.zone_name}`}
    >
      <div>
        <p className="gl-section-label">Selected zone</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          {zone.zone_name}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">Generalized Grid Risk Area</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <RiskBadge level={zone.risk_level} />
        <span className="gl-metric-value text-2xl font-bold text-[var(--text-primary)]">
          {zone.risk_score}
          <span className="text-sm font-normal text-[var(--text-muted)]">/100</span>
        </span>
        {deltaLabel && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[var(--blue-600)]">
            {deltaLabel}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Risk drivers</h3>
        <ScoreBar label="Hazard exposure" value={zone.hazard_score} />
        <ScoreBar label="Infrastructure exposure" value={zone.infrastructure_score} />
        <ScoreBar label="Capacity stress" value={zone.capacity_score} />
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        {explainZone(zone, scenario)}
      </p>

      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Recommended action
        </h3>
        <p className="mt-1 text-sm text-[var(--text-primary)]">{zone.recommended_action}</p>
        <p className="mt-2 text-xs font-semibold text-[var(--blue-600)]">
          Urgency: {zone.urgency}
        </p>
      </div>

      <p className="gl-disclaimer-strip px-3 py-2 text-xs leading-snug" role="note">
        {MANDATORY_DISCLAIMER}
      </p>
    </aside>
  );
}
