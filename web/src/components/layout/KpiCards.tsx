import { ArrowUpRight, Gauge, MapPinned, Target } from "lucide-react";
import type { ScenarioSummary } from "../../data/types";
import { Card, RiskBadge } from "./ui";

export function KpiCards(props: {
  summary: Pick<
    ScenarioSummary,
    | "critical_zones"
    | "elevated_zones"
    | "peak_capacity_utilization_percent"
    | "priority_zones"
  >;
  highestPriorityZoneName?: string;
  criticalDeltaLabel?: string;
  className?: string;
}) {
  const zonesToReview = props.summary.critical_zones + props.summary.elevated_zones;
  const top = props.summary.priority_zones?.[0];

  return (
    <section
      className={[
        "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
        props.className ?? "",
      ].join(" ")}
      aria-label="Scenario KPIs"
    >
      <Card
        title="Critical Zones"
        subtitle={props.criticalDeltaLabel ?? "Change vs baseline shown in detail"}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {props.summary.critical_zones}
            </div>
            <div className="mt-1 inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <ArrowUpRight size={14} aria-hidden="true" />
              Highest-risk zones to prioritize
            </div>
          </div>
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--risk-critical)_25%,white)] bg-[color-mix(in_srgb,var(--risk-critical)_10%,white)] p-3">
            <Target
              size={18}
              aria-hidden="true"
              className="text-[var(--risk-critical)]"
            />
          </div>
        </div>
      </Card>

      <Card title="Zones to Review" subtitle="Elevated + Critical categories">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {zonesToReview}
            </div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">
              Across {props.summary.critical_zones} Critical and{" "}
              {props.summary.elevated_zones} Elevated zones
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <MapPinned
              size={18}
              aria-hidden="true"
              className="text-[var(--navy-900)]"
            />
          </div>
        </div>
      </Card>

      <Card title="Peak Utilization" subtitle="Modeled capacity indicator">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {Math.round(props.summary.peak_capacity_utilization_percent)}%
            </div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">
              Displayed as representative modeled utilization
            </div>
          </div>
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--blue-600)_25%,white)] bg-[color-mix(in_srgb,var(--blue-600)_10%,white)] p-3">
            <Gauge
              size={18}
              aria-hidden="true"
              className="text-[var(--blue-600)]"
            />
          </div>
        </div>
      </Card>

      <Card title="Highest Priority" subtitle="Top ranked zone in this scenario">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-[var(--text-primary)]">
              {props.highestPriorityZoneName ?? top?.zone_name ?? "—"}
            </div>
            {top?.risk_level && (
              <div className="mt-2 flex items-center gap-2">
                <RiskBadge level={top.risk_level} />
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  {top.risk_score}/100
                </span>
              </div>
            )}
            {!top?.risk_level && (
              <div className="mt-2 text-xs text-[var(--text-muted)]">
                Provide the ranked zone list via props.
              </div>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}

