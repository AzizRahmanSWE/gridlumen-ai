import { Lock, MapPinned, ShieldCheck } from "lucide-react";

const CHIPS = [
  {
    label: "Public geography",
    icon: MapPinned,
    tone: "public",
  },
  {
    label: "Representative risk values",
    icon: ShieldCheck,
    tone: "representative",
  },
  {
    label: "Secured asset integration only",
    icon: Lock,
    tone: "secured",
  },
] as const;

export function DataStatusChips() {
  return (
    <div
      className="flex flex-wrap gap-2"
      aria-label="Data status"
      role="list"
    >
      {CHIPS.map(({ label, icon: Icon, tone }) => (
        <span
          key={label}
          role="listitem"
          className={[
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
            tone === "public" &&
              "border-[color-mix(in_srgb,var(--cyan-400)_35%,white)] bg-[color-mix(in_srgb,var(--cyan-400)_14%,white)] text-[var(--navy-950)]",
            tone === "representative" &&
              "border-[color-mix(in_srgb,var(--blue-600)_22%,white)] bg-[color-mix(in_srgb,var(--blue-600)_8%,white)] text-[var(--navy-950)]",
            tone === "secured" &&
              "border-[var(--border)] bg-white text-[var(--text-muted)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Icon className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
          {label}
        </span>
      ))}
    </div>
  );
}
