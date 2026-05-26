import type { RiskLevel } from "../data/types";

export const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "#17B26A",
  Elevated: "#F79009",
  Critical: "#F04438",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  Low: "Low",
  Elevated: "Elevated",
  Critical: "Critical",
};

export function riskLevelClass(level: RiskLevel): string {
  switch (level) {
    case "Critical":
      return "border-[color-mix(in_srgb,var(--risk-critical)_45%,white)] bg-[color-mix(in_srgb,var(--risk-critical)_16%,white)] text-[color-mix(in_srgb,var(--risk-critical)_92%,#5A1010)]";
    case "Elevated":
      return "border-[color-mix(in_srgb,var(--risk-elevated)_45%,white)] bg-[color-mix(in_srgb,var(--risk-elevated)_18%,white)] text-[color-mix(in_srgb,var(--risk-elevated)_92%,#7A3E00)]";
    case "Low":
      return "border-[color-mix(in_srgb,var(--risk-low)_45%,white)] bg-[color-mix(in_srgb,var(--risk-low)_16%,white)] text-[color-mix(in_srgb,var(--risk-low)_92%,#0F5132)]";
  }
}
