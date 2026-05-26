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
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#101828]"
      >
        Priority intervention queue
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#F5F8FC] text-xs uppercase tracking-wide text-[#667085]">
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
                  className={`cursor-pointer border-b border-[#E4E7EC]/80 transition-colors last:border-0 ${
                    isSelected
                      ? "bg-cyan-50/80 outline outline-2 outline-[#22D3EE] -outline-offset-2"
                      : "hover:bg-[#F5F8FC]"
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
                  <td className="px-4 py-3 font-semibold text-[#101828]">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#101828]">
                    {zone.zone_name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mr-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${riskLevelClass(zone.risk_level)}`}
                    >
                      {zone.risk_level}
                    </span>
                    <span className="font-semibold">{zone.risk_score}</span>
                  </td>
                  <td className="max-w-[180px] px-4 py-3 text-[#667085]">
                    {zone.primary_driver}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-[#101828]">
                    {zone.recommended_action}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1570EF]">
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
