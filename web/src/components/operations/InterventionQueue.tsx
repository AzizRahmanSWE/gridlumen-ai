import type { RiskZoneProperties } from "../../data/types";
import { riskLevelClass } from "../../lib/riskStyles";

export type InterventionQueueProps = {
  zones: RiskZoneProperties[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
};

export function InterventionQueue({
  zones,
  selectedZoneId,
  onSelectZone,
}: InterventionQueueProps) {
  return (
    <section aria-labelledby="intervention-queue-heading">
      <h2
        id="intervention-queue-heading"
        className="gl-section-label mb-1"
      >
        Priority intervention queue
      </h2>
      <p className="mb-3 text-base font-semibold text-[var(--text-primary)]">
        Ranked mitigation actions
      </p>
      <div className="gl-panel overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th scope="col" className="px-4 py-3 font-medium">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Zone
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status / Score
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Primary driver
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Recommended action
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Urgency
              </th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, index) => {
              const isSelected = zone.zone_id === selectedZoneId;
              return (
                <tr
                  key={zone.zone_id}
                  className={`cursor-pointer border-b border-[var(--border)] transition-colors last:border-0 ${
                    isSelected
                      ? "bg-cyan-50/90 outline outline-2 outline-[var(--cyan-400)] -outline-offset-2"
                      : "hover:bg-[var(--surface-elevated)]"
                  }`}
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
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--text-muted)]">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                    {zone.zone_name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mr-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${riskLevelClass(zone.risk_level)}`}
                    >
                      {zone.risk_level}
                    </span>
                    <span className="gl-metric-value font-semibold">{zone.risk_score}</span>
                  </td>
                  <td className="max-w-[180px] px-4 py-3 text-[var(--text-muted)]">
                    {zone.primary_driver}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-[var(--text-primary)]">
                    {zone.recommended_action}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--blue-600)]">
                    {zone.urgency}
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
