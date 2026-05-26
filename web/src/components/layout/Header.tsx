import { FileText } from "lucide-react";
import { Pill } from "./ui";

export function Header(props: {
  activeAnchor?: "overview" | "risk-map" | "interventions" | "methodology";
  onNavigate?: (anchor: string) => void;
  className?: string;
}) {
  const nav = [
    { id: "overview", label: "Overview" },
    { id: "risk-map", label: "Risk Map" },
    { id: "interventions", label: "Interventions" },
    { id: "methodology", label: "Methodology" },
  ] as const;

  return (
    <header
      className={[
        "border-b border-white/10 bg-[var(--navy-950)] text-white",
        props.className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold tracking-tight">
                  GridLumen AI
                </span>
                <span className="hidden text-sm text-white/70 sm:inline">
                  Climate &amp; Capacity Risk Radar
                </span>
              </div>
              <Pill variant="pilot">Mississauga Pilot</Pill>
              <Pill variant="prototype">PROTOTYPE</Pill>
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-white/70">
              Explainable zone prioritization for storms, heat, and demand stress.
            </p>
          </div>

          <span
            className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/70"
            title="Export brief is not enabled in this offline prototype demo."
          >
            Export brief · future pilot
          </span>
        </div>

        <nav className="flex items-center justify-between gap-4 pb-2.5 text-sm">
          <div className="flex flex-wrap gap-1.5">
            {nav.map((item) => {
              const isActive = props.activeAnchor === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => props.onNavigate?.(item.id)}
                  className={[
                    "rounded-md px-3 py-1.5 text-xs font-semibold",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan-400)]",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/75 hover:bg-white/8 hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 text-xs text-white/70 md:flex">
            <FileText size={14} aria-hidden="true" />
            Offline demo mode from generated outputs
          </div>
        </nav>
      </div>
    </header>
  );
}
