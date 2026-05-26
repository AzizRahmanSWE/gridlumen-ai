import { RISK_COLORS, RISK_LABELS } from "../../lib/riskStyles";
import type { RiskLevel } from "../../data/types";

const LEVELS: RiskLevel[] = ["Low", "Elevated", "Critical"];

export function RiskLegend() {
  return (
    <div
      className="flex flex-wrap items-center gap-4 text-xs text-[#667085]"
      role="list"
      aria-label="Risk level legend"
    >
      {LEVELS.map((level) => (
        <div key={level} className="flex items-center gap-1.5" role="listitem">
          <span
            className="inline-block h-3 w-3 rounded-sm border border-white/20"
            style={{ backgroundColor: RISK_COLORS[level] }}
            aria-hidden
          />
          <span>
            <span className="font-medium text-[#101828]">{RISK_LABELS[level]}</span>
            <span className="ml-1 text-[#667085]">
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
