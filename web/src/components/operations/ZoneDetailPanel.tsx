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
        <span className="font-medium text-[var(--text-muted)]">{label}</span>
        <span className="font-bold text-[var(--text-primary)]">{value}</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-[var(--border)]"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value} out of 100`}
      >
        <div
          className="h-full rounded-full bg-[var(--blue-600)] transition-all duration-300"
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
        className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-5 text-sm text-[var(--text-muted)] shadow-[var(--shadow-card)]"
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
      className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)] xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto"
      aria-label={`Details for ${zone.zone_name}`}
    >
      <div className="border-b border-[var(--border)] pb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Selected zone
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--text-primary)]">
          {zone.zone_name}
        </h2>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Public screening geography · representative risk attributes
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${riskLevelClass(zone.risk_level)}`}
        >
          {zone.risk_level}
        </span>
        <span className="text-3xl font-bold leading-none text-[var(--text-primary)]">
          {zone.risk_score}
          <span className="text-sm font-semibold text-[var(--text-muted)]">/100</span>
        </span>
        {deltaLabel && (
          <span className="rounded-full bg-[color-mix(in_srgb,var(--blue-600)_10%,white)] px-2 py-1 text-xs font-bold text-[var(--blue-600)]">
            {deltaLabel}
          </span>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Risk drivers</h3>
        <ScoreBar label="Hazard exposure" value={zone.hazard_score} />
        <ScoreBar label="Infrastructure exposure" value={zone.infrastructure_score} />
        <ScoreBar label="Capacity stress" value={zone.capacity_score} />
      </div>

      <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
        {explainZone(zone, scenario)}
      </p>

      <div className="rounded-xl border border-[color-mix(in_srgb,var(--blue-600)_18%,white)] bg-[color-mix(in_srgb,var(--blue-600)_6%,white)] p-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Recommended action
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
          {zone.recommended_action}
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--blue-600)]">
          Urgency: {zone.urgency}
        </p>
      </div>

      <p
        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-950"
        role="note"
      >
        {MANDATORY_DISCLAIMER}
      </p>
    </aside>
  );
}
