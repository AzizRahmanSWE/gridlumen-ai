import type { RiskZoneProperties } from "../../data/types";
import { riskLevelClass } from "../../lib/riskStyles";

export type InterventionQueueProps = {
  zones: RiskZoneProperties[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  compact?: boolean;
};

export function InterventionQueue({
  zones,
  selectedZoneId,
  onSelectZone,
  compact = false,
}: InterventionQueueProps) {
  return (
    <section aria-labelledby="intervention-queue-heading" className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2
          id="intervention-queue-heading"
          className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]"
        >
          Priority intervention queue
        </h2>
        <span className="text-[11px] font-medium text-[var(--text-muted)]">
          Ranked by risk score
        </span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]">
        <table
          className={[
            "w-full min-w-[520px] border-collapse text-left",
            compact ? "text-xs" : "text-sm",
          ].join(" ")}
        >
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
              <th scope="col" className="px-3 py-2 font-semibold">
                Rank
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Zone
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Status / Score
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Primary driver
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, index) => {
              const isSelected = zone.zone_id === selectedZoneId;
              return (
                <tr
                  key={zone.zone_id}
                  className={[
                    "cursor-pointer border-b border-[var(--border)]/80 transition-colors last:border-0",
                    isSelected
                      ? "bg-[color-mix(in_srgb,var(--cyan-400)_12%,white)] ring-2 ring-inset ring-[var(--cyan-400)]"
                      : "hover:bg-[var(--surface)]",
                  ].join(" ")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${index + 1}. ${zone.zone_name}, ${zone.risk_level} risk score ${zone.risk_score}`}
                  onClick={() => onSelectZone(zone.zone_id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectZone(zone.zone_id);
                    }
                  }}
                >
                  <td className="px-3 py-2 font-bold text-[var(--text-primary)]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 font-semibold text-[var(--text-primary)]">
                    {zone.zone_name}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`mr-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${riskLevelClass(zone.risk_level)}`}
                    >
                      {zone.risk_level}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {zone.risk_score}
                    </span>
                  </td>
                  <td className="max-w-[160px] px-3 py-2 text-[var(--text-muted)]">
                    {zone.primary_driver}
                  </td>
                  <td className="max-w-[180px] px-3 py-2 font-medium text-[var(--text-primary)]">
                    {zone.recommended_action}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
