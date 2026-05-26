import { RISK_COLORS, RISK_LABELS } from "../../lib/riskStyles";
import type { RiskLevel } from "../../data/types";

const LEVELS: RiskLevel[] = ["Low", "Elevated", "Critical"];

export function RiskLegend(props: { compact?: boolean }) {
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3",
        props.compact ? "py-1.5 text-[11px]" : "py-2 text-xs",
      ].join(" ")}
      role="list"
      aria-label="Risk level legend"
    >
      {LEVELS.map((level) => (
        <div key={level} className="flex items-center gap-1.5" role="listitem">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm border border-black/10"
            style={{ backgroundColor: RISK_COLORS[level] }}
            aria-hidden
          />
          <span className="font-semibold text-[var(--text-primary)]">
            {RISK_LABELS[level]}
          </span>
          <span className="text-[var(--text-muted)]">
            {level === "Low" && "(0–49)"}
            {level === "Elevated" && "(50–69)"}
            {level === "Critical" && "(70–100)"}
          </span>
        </div>
      ))}
    </div>
  );
}
