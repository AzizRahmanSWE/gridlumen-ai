import { Download, FileText, Shield } from "lucide-react";
import { Pill } from "./ui";

export function Header(props: {
  activeAnchor?: "overview" | "risk-map" | "interventions" | "methodology";
  onNavigate?: (anchor: string) => void;
  onExportBrief?: () => void;
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
        "border-b border-white/10 bg-gradient-to-r from-[var(--navy-950)] via-[var(--navy-900)] to-[var(--navy-950)] text-white shadow-[0_4px_24px_rgba(7,26,51,0.2)]",
        props.className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <img
                src="/gridlumen-mark.svg"
                alt=""
                width={36}
                height={36}
                className="shrink-0 rounded-lg shadow-[0_2px_8px_rgba(34,211,238,0.25)]"
              />
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold tracking-tight">
                  GridLumen AI
                </span>
                <span className="hidden text-sm font-normal text-white/65 sm:inline">
                  Climate &amp; Capacity Risk Radar
                </span>
              </div>
              <Pill variant="pilot">
                <Shield size={12} aria-hidden="true" />
                Mississauga Pilot
              </Pill>
              <Pill variant="prototype">PROTOTYPE</Pill>
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-white/70">
              Explainable zone prioritization for storms, heat, and demand
              stress.
            </p>
          </div>

          <button
            type="button"
            onClick={props.onExportBrief}
            className={[
              "inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2",
              "text-xs font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan-400)]",
            ].join(" ")}
          >
            <Download size={14} aria-hidden="true" />
            Export Brief
          </button>
        </div>

        <nav className="flex items-center justify-between gap-4 pb-3 text-sm">
          <div className="flex flex-wrap gap-2">
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

