import { Card } from "../layout/ui";

function RoadmapItem(props: {
  title: string;
  description: string;
  tag: "Near-term" | "Pilot" | "Future";
}) {
  const tagStyle: Record<typeof props.tag, string> = {
    "Near-term":
      "bg-[color-mix(in_srgb,var(--blue-600)_10%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--blue-600)_18%,white)]",
    Pilot:
      "bg-[color-mix(in_srgb,var(--cyan-400)_18%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--cyan-400)_30%,white)]",
    Future:
      "bg-[color-mix(in_srgb,var(--navy-900)_10%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--navy-900)_18%,white)]",
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {props.title}
        </p>
        <span
          className={[
            "inline-flex flex-none items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            tagStyle[props.tag],
          ].join(" ")}
        >
          {props.tag}
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{props.description}</p>
    </div>
  );
}

export function RoadmapSection(props: { className?: string }) {
  return (
    <section
      id="roadmap"
      className={["mx-auto max-w-[1240px] px-6", props.className ?? ""].join(
        " ",
      )}
      aria-label="Roadmap"
    >
      <div className="py-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Roadmap (next steps)
          </h2>
          <p className="max-w-3xl text-sm text-[var(--text-muted)]">
            These are production-path enhancements that preserve the same
            explainable workflow while improving data fidelity under authorized
            utility deployment conditions.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card title="Near-term improvements" subtitle="Within the prototype scope">
            <div className="space-y-3">
              <RoadmapItem
                tag="Near-term"
                title="Refine explainability visuals"
                description="Add compact driver visualizations and clearer selection states without changing the scoring formula."
              />
              <RoadmapItem
                tag="Near-term"
                title="Export-ready briefing"
                description="Generate a printable intervention brief summarizing prioritized zones and actions for planning review."
              />
            </div>
          </Card>

          <Card title="Pilot pathway" subtitle="Authorized utility deployment">
            <div className="space-y-3">
              <RoadmapItem
                tag="Pilot"
                title="Secured utility layer integration"
                description="Replace generalized geometry with authorized asset-level context inside a restricted environment (not public)."
              />
              <RoadmapItem
                tag="Pilot"
                title="Public weather enhancement (read-only)"
                description="Ingest public meteorological data to inform hazard exposure while keeping the overall system non-operational and explainable."
              />
              <RoadmapItem
                tag="Future"
                title="Calibration with labeled history"
                description="If outage/failure labels are available, calibrate and validate components while preserving auditable decision support."
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

