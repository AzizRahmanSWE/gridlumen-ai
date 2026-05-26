import type { ReactNode } from "react";

export function Card(props: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)]",
        "shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
        props.className ?? "",
      ].join(" ")}
      aria-label={props.title}
    >
      {(props.title || props.subtitle) && (
        <header className="border-b border-[var(--border)] px-4 py-3">
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
    navy: "bg-[var(--navy-900)] text-white border-white/10",
    prototype:
      "bg-[color-mix(in_srgb,var(--cyan-400)_22%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--cyan-400)_38%,white)]",
    pilot:
      "bg-[color-mix(in_srgb,var(--blue-600)_10%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--blue-600)_20%,white)]",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[props.variant],
        props.className ?? "",
      ].join(" ")}
    >
      {props.children}
    </span>
  );
}

export function RiskBadge(props: { level: "Low" | "Elevated" | "Critical" }) {
  const map: Record<typeof props.level, { bg: string; fg: string }> = {
    Low: { bg: "bg-[color-mix(in_srgb,var(--risk-low)_12%,white)]", fg: "text-[var(--risk-low)]" },
    Elevated: {
      bg: "bg-[color-mix(in_srgb,var(--risk-elevated)_12%,white)]",
      fg: "text-[color-mix(in_srgb,var(--risk-elevated)_90%,#7A3E00)]",
    },
    Critical: {
      bg: "bg-[color-mix(in_srgb,var(--risk-critical)_12%,white)]",
      fg: "text-[var(--risk-critical)]",
    },
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        map[props.level].bg,
        map[props.level].fg,
      ].join(" ")}
    >
      {props.level}
    </span>
  );
}

