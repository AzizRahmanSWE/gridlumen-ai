import { MANDATORY_DISCLAIMER } from "../../data/types";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[1240px] px-6 py-10">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              GridLumen AI — Climate &amp; Capacity Risk Radar
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Theme 2 — Infrastructure Vulnerability prototype for resilience
              planning workflows.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              Disclosure
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {MANDATORY_DISCLAIMER}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)]">
          <span>Mississauga public screening geometry (ward-derived) • Privacy-aware prototype</span>
          <span>Built for a stable offline demo walk-through</span>
        </div>
      </div>
    </footer>
  );
}

