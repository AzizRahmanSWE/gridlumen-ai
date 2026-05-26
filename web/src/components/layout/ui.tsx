import type { ReactNode } from "react";

export function Card(props: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  accent?: "default" | "critical" | "utilization" | "priority";
}) {
  const accentBorder: Record<NonNullable<typeof props.accent>, string> = {
    default: "border-[var(--border)]",
    critical:
      "border-t-2 border-t-[var(--risk-critical)] border-x-[var(--border)] border-b-[var(--border)]",
    utilization:
      "border-t-2 border-t-[var(--blue-600)] border-x-[var(--border)] border-b-[var(--border)]",
    priority:
      "border-t-2 border-t-[var(--cyan-400)] border-x-[var(--border)] border-b-[var(--border)]",
  };

  return (
    <section
      className={[
        "overflow-hidden rounded-[var(--radius-lg)] bg-[var(--card)]",
        "shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]",
        accentBorder[props.accent ?? "default"],
        props.className ?? "",
      ].join(" ")}
      aria-label={props.title}
    >
      {(props.title || props.subtitle) && (
        <header className="border-b border-[var(--border)] bg-[var(--surface-elevated)]/60 px-4 py-3">
          {props.title && (
            <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
              {props.title}
            </h3>
          )}
          {props.subtitle && (
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {props.subtitle}
            </p>
          )}
        </header>
      )}
      <div className="px-4 py-4">{props.children}</div>
    </section>
  );
}

export function Pill(props: {
  children: ReactNode;
  variant: "navy" | "prototype" | "pilot";
  className?: string;
}) {
  const styles: Record<typeof props.variant, string> = {
    navy: "bg-white/10 text-white border-white/15 backdrop-blur-sm",
    prototype:
      "bg-[color-mix(in_srgb,var(--cyan-400)_18%,var(--navy-900))] text-[var(--cyan-300)] border-[color-mix(in_srgb,var(--cyan-400)_35%,transparent)]",
    pilot:
      "bg-[color-mix(in_srgb,var(--blue-600)_15%,var(--navy-900))] text-[var(--cyan-300)] border-[color-mix(in_srgb,var(--blue-500)_25%,transparent)]",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide",
        styles[props.variant],
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </span>
  );
}

export function RiskBadge(props: { level: "Low" | "Elevated" | "Critical" }) {
  const map: Record<typeof props.level, { bg: string; fg: string; ring: string }> = {
    Low: {
      bg: "bg-emerald-50",
      fg: "text-emerald-700",
      ring: "ring-emerald-200/80",
    },
    Elevated: {
      bg: "bg-amber-50",
      fg: "text-amber-800",
      ring: "ring-amber-200/80",
    },
    Critical: {
      bg: "bg-red-50",
      fg: "text-red-700",
      ring: "ring-red-200/80",
    },
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        map[props.level].bg,
        map[props.level].fg,
        map[props.level].ring,
      ].join(" ")}
    >
      {props.level}
    </span>
  );
}
