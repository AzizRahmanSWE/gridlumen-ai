import { MANDATORY_DISCLAIMER } from "../../data/types";
import { Card } from "../layout/ui";

function DisclosureRow(props: {
  title: string;
  subtitle: string;
  status: "Representative" | "Public (optional)" | "Future (authorized)";
}) {
  const statusStyle: Record<typeof props.status, string> = {
    Representative:
      "bg-[color-mix(in_srgb,var(--blue-600)_10%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--blue-600)_18%,white)]",
    "Public (optional)":
      "bg-[color-mix(in_srgb,var(--cyan-400)_18%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--cyan-400)_30%,white)]",
    "Future (authorized)":
      "bg-[color-mix(in_srgb,var(--navy-900)_10%,white)] text-[var(--navy-950)] border-[color-mix(in_srgb,var(--navy-900)_18%,white)]",
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-3 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {props.title}
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{props.subtitle}</p>
      </div>
      <span
        className={[
          "inline-flex w-fit flex-none items-center rounded-full border px-2 py-1 text-xs font-semibold",
          statusStyle[props.status],
        ].join(" ")}
      >
        {props.status}
      </span>
    </div>
  );
}

export function DataDisclosureSection(props: { className?: string }) {
  return (
    <section
      id="sources"
      className={["mx-auto max-w-[1240px] px-6", props.className ?? ""].join(
        " ",
      )}
      aria-label="Data and privacy disclosure"
    >
      <div className="py-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Data &amp; privacy disclosure
          </h2>
          <p className="max-w-3xl text-sm text-[var(--text-muted)]">
            The demo is intentionally privacy-aware: the public view displays
            generalized zones rather than sensitive utility asset locations.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card
            title="What’s shown in the prototype"
            subtitle="Truthful scope of this hackathon demo"
          >
            <div className="space-y-3">
              <DisclosureRow
                title="Generalized risk zones"
                subtitle="Public City of Mississauga ward-derived screening polygons with representative prototype risk attributes joined to geography."
                status="Public (optional)"
              />
              <DisclosureRow
                title="Scenario hazard severity"
                subtitle="Modeled scenario inputs driving hazard exposure per zone."
                status="Representative"
              />
              <DisclosureRow
                title="Infrastructure context"
                subtitle="Representative susceptibility (overhead/vegetation/flood context)."
                status="Representative"
              />
              <DisclosureRow
                title="Capacity stress"
                subtitle="Representative capacity-margin pressure under scenario assumptions."
                status="Representative"
              />
            </div>
          </Card>

          <Card title="What is intentionally not shown" subtitle="Privacy boundary">
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[var(--blue-600)]" />
                No precise transformers, feeders, or asset identifiers.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[var(--blue-600)]" />
                No claim of verified utility outage prediction.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[var(--blue-600)]" />
                No operational dispatch or grid control.
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

