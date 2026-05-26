import { Card } from "../layout/ui";

function Step(props: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3">
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {props.title}
      </p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{props.description}</p>
    </div>
  );
}

export function ArchitectureSection(props: { className?: string }) {
  return (
    <section
      id="architecture"
      className={["mx-auto max-w-[1240px] px-6", props.className ?? ""].join(
        " ",
      )}
      aria-label="Architecture"
    >
      <div className="py-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Architecture (prototype)
          </h2>
          <p className="max-w-3xl text-sm text-[var(--text-muted)]">
            The demo dashboard is intentionally resilient: it renders from
            pre-generated JSON/GeoJSON outputs so the core walkthrough works
            offline. Optional proofs (ArcGIS and Hermes) enhance the narrative
            but never block the UI.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card
            title="Deterministic data flow"
            subtitle="Stable demo-first architecture"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Step
                title="1) Scenario fixture JSON"
                description="Canonical scenario inputs define hazard, infrastructure and capacity component values."
              />
              <Step
                title="2) Deterministic risk engine"
                description="A fixed formula produces risk scores, levels, ranked queues and GeoJSON polygons."
              />
              <Step
                title="3) Generated outputs"
                description="Map-ready GeoJSON plus a ranked JSON summary (with the mandatory disclaimer)."
              />
              <Step
                title="4) React dashboard"
                description="Renders generated files; does not invent or recompute risk values."
              />
            </div>
          </Card>

          <Card title="Optional proofs" subtitle="Not required at runtime">
            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  ArcGIS Online proof map (manual publish)
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Demonstrates the GeoJSON output can become a styled hosted
                  layer with popup fields and risk colours.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Hermes orchestration proof (optional)
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  An agent may trigger the approved deterministic run and
                  summarize outputs, but it is not the risk model.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

