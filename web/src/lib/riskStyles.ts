import type { RiskLevel } from "../data/types";

export const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "#059669",
  Elevated: "#D97706",
  Critical: "#DC2626",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  Low: "Low",
  Elevated: "Elevated",
  Critical: "Critical",
};

export function riskLevelClass(level: RiskLevel): string {
  switch (level) {
    case "Critical":
      return "bg-red-50 text-red-700 border-red-200/80 ring-red-100";
    case "Elevated":
      return "bg-amber-50 text-amber-800 border-amber-200/80 ring-amber-100";
    case "Low":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-100";
  }
}
