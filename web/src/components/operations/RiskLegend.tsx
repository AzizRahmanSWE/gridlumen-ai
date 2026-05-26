import { RISK_COLORS, RISK_LABELS } from "../../lib/riskStyles";
import type { RiskLevel } from "../../data/types";

const LEVELS: RiskLevel[] = ["Low", "Elevated", "Critical"];

export function RiskLegend() {
  return (
    <div
      className="flex flex-wrap items-center gap-5 rounded-[var(--radius-card)] border border-[var(--navy-800)]/20 bg-[var(--navy-900)]/5 px-4 py-2.5 text-xs"
      role="list"
      aria-label="Risk level legend"
    >
      {LEVELS.map((level) => (
        <div key={level} className="flex items-center gap-2" role="listitem">
          <span
            className="inline-block h-3 w-3 rounded-[3px] shadow-sm"
            style={{ backgroundColor: RISK_COLORS[level] }}
            aria-hidden
          />
          <span>
            <span className="font-semibold text-[var(--text-primary)]">
              {RISK_LABELS[level]}
            </span>
            <span className="ml-1 font-mono text-[var(--text-muted)]">
              {level === "Low" && "(0–49)"}
              {level === "Elevated" && "(50–69)"}
              {level === "Critical" && "(70–100)"}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
