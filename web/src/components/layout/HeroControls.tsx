import { Lock, Radio } from "lucide-react";
import type { ScenarioId } from "../../data/types";
import { Pill } from "./ui";

const SCENARIO_LABEL: Record<ScenarioId, string> = {
  normal: "Normal",
  storm: "Severe Wind & Rain Storm",
  heatwave_ev: "Heatwave + Evening EV Demand",
};

export function HeroControls(props: {
  scenario: ScenarioId;
  onScenarioChange?: (scenario: ScenarioId) => void;
  forecastHorizonLabel?: string;
  onOpenSecuredLayer?: () => void;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)]",
        "shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
        props.className ?? "",
      ].join(" ")}
      aria-label="Scenario controls"
    >
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Climate-ready grid planning before failure happens.
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Explainable zone prioritization for storms, heat, and demand stress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Pill variant="navy">
            <Radio size={12} aria-hidden="true" />
            Public Risk View
          </Pill>
          <button
            type="button"
            onClick={props.onOpenSecuredLayer}
            className={[
              "inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1.5",
              "text-xs font-semibold text-[var(--text-primary)]",
              "hover:bg-[color-mix(in_srgb,var(--surface)_70%,white)]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan-400)]",
            ].join(" ")}
          >
            <Lock size={14} aria-hidden="true" />
            Secured Utility Layer
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SCENARIO_LABEL) as ScenarioId[]).map((id) => {
              const selected = props.scenario === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => props.onScenarioChange?.(id)}
                  aria-pressed={selected}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan-400)]",
                    selected
                      ? "border-[var(--blue-600)] bg-[color-mix(in_srgb,var(--blue-600)_10%,white)] text-[var(--navy-950)]"
                      : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--surface)_70%,white)]",
                  ].join(" ")}
                >
                  <span>{SCENARIO_LABEL[id]}</span>
                  {selected && (
                    <span className="rounded-full bg-[var(--blue-600)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-muted)] lg:justify-end">
            <span>
              Forecast Horizon:{" "}
              <span className="font-semibold text-[var(--text-primary)]">
                {props.forecastHorizonLabel ?? "Next 24 Hours"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

