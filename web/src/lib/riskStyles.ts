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
      return "bg-[#F04438]/15 text-[#F04438] border-[#F04438]/40";
    case "Elevated":
      return "bg-[#F79009]/15 text-[#F79009] border-[#F79009]/40";
    case "Low":
      return "bg-[#17B26A]/15 text-[#17B26A] border-[#17B26A]/40";
  }
}
