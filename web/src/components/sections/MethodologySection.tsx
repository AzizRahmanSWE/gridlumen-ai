import { MANDATORY_DISCLAIMER, RISK_FORMULA } from "../../data/types";
import { Card } from "../layout/ui";

function Metric(props: { label: string; weight: string; description: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {props.label}
        </p>
        <p className="text-xs font-semibold text-[var(--text-muted)]">
          {props.weight}
        </p>
      </div>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{props.description}</p>
    </div>
  );
}

export function MethodologySection(props: { className?: string }) {
  return (
    <section
      id="methodology"
      className={["mx-auto max-w-[1240px] px-6", props.className ?? ""].join(
        " ",
      )}
      aria-label="Methodology"
    >
      <div className="py-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Methodology
          </h2>
          <p className="max-w-3xl text-sm text-[var(--text-muted)]">
            GridLumen is an explainable screening index designed to support
            resilience planning decisions. It deliberately avoids black-box
            claims of confirmed outages or equipment failures in the absence of
            labeled utility failure history.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card
            title="Fixed formula (deterministic)"
            subtitle="Rendered from generated scenario outputs"
          >
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {RISK_FORMULA}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Classification thresholds: Low (0–49), Elevated (50–69), Critical
                (70–100).
              </p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Metric
                label="Hazard Exposure"
                weight="40%"
                description="Scenario-driven wind/rain/heat exposure signal per generalized zone."
              />
              <Metric
                label="Infrastructure Exposure"
                weight="30%"
                description="Representative susceptibility such as overhead/vegetation or flood context."
              />
              <Metric
                label="Capacity Stress"
                weight="30%"
                description="Representative margin pressure under modeled demand-growth conditions."
              />
            </div>
          </Card>

          <Card title="Credibility and limits" subtitle="What the score is not">
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[var(--blue-600)]" />
                Not an operational grid-control system.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[var(--blue-600)]" />
                Not a confirmed outage forecast or equipment-failure prediction.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[var(--blue-600)]" />
                Not a public map of precise transformers, feeders, or sensitive
                utility assets.
              </li>
            </ul>

            <div className="mt-4 rounded-xl border border-[var(--border)] bg-white px-4 py-3">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Mandatory disclaimer
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {MANDATORY_DISCLAIMER}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

