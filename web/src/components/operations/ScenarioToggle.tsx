import type { ScenarioId } from "../../data/types";

const SCENARIO_OPTIONS: { id: ScenarioId; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "storm", label: "Severe Wind & Rain Storm" },
  { id: "heatwave_ev", label: "Heatwave + Evening EV Demand" },
];

export type ScenarioToggleProps = {
  activeScenario: ScenarioId;
  onScenarioChange: (id: ScenarioId) => void;
  disabled?: boolean;
};

export function ScenarioToggle({
  activeScenario,
  onScenarioChange,
  disabled = false,
}: ScenarioToggleProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Scenario selection"
    >
      {SCENARIO_OPTIONS.map(({ id, label }) => {
        const isActive = id === activeScenario;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onScenarioChange(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] disabled:opacity-50 ${
              isActive
                ? "bg-[#1570EF] text-white shadow-md"
                : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
