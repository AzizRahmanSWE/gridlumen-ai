import { useMemo } from "react";
import type { ScoredZonesGeoJSON } from "../../data/types";
import { computeBounds, projectGeometryWithBounds } from "../../lib/geoProjection";
import { RISK_COLORS } from "../../lib/riskStyles";

const VIEWBOX = { minX: 0, minY: 0, width: 520, height: 300 };
const COMPACT_HEIGHT = 248;

export type RiskMapProps = {
  geojson: ScoredZonesGeoJSON | null;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  loading?: boolean;
  compact?: boolean;
};

function mapLabelLines(name: string): string[] {
  const parts = name.split(" ");
  if (parts.length <= 2) return [name];
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

export function RiskMap({
  geojson,
  selectedZoneId,
  onSelectZone,
  loading = false,
  compact = false,
}: RiskMapProps) {
  const bounds = useMemo(() => {
    if (!geojson?.features.length) return null;
    return computeBounds(geojson.features.map((f) => f.geometry));
  }, [geojson]);

  const mapHeight = compact ? COMPACT_HEIGHT : 360;

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-[var(--navy-800)] bg-[var(--navy-950)] text-sm text-cyan-200/80"
        style={{ height: mapHeight }}
        aria-busy="true"
        aria-label="Loading risk map"
      >
        Loading risk map…
      </div>
    );
  }

  if (!geojson || !bounds) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--navy-900)] text-sm text-slate-400"
        style={{ height: mapHeight }}
        role="alert"
      >
        Risk map data unavailable
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-[var(--navy-800)] bg-[var(--navy-950)] shadow-[var(--shadow-map)]">
      <svg
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        className="h-auto w-full"
        style={{ maxHeight: mapHeight }}
        role="img"
        aria-label="Mississauga public screening geography map. Risk attributes are representative prototype values joined to public screening polygons, not utility asset boundaries."
      >
        <title>Mississauga public screening geography</title>
        <defs>
          <filter id="zoneGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#67E8F9" floodOpacity="0.85" />
          </filter>
        </defs>
        <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="#0B2545" />
        <text
          x={VIEWBOX.width / 2}
          y={22}
          textAnchor="middle"
          fill="#E0F2FE"
          fontSize={12}
          fontWeight={700}
        >
          Mississauga — Public Screening Geography
        </text>
        <text
          x={VIEWBOX.width / 2}
          y={38}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize={9}
        >
          Representative risk values joined to public city polygons
        </text>
        {geojson.features.map((feature) => {
          const { zone_id, zone_name, risk_level } = feature.properties;
          const isSelected = zone_id === selectedZoneId;
          const polygons = projectGeometryWithBounds(
            feature.geometry,
            bounds,
            VIEWBOX,
            compact ? 20 : 16,
          );
          const fill = RISK_COLORS[risk_level];
          const labelPoints = polygons
            .map((p) => p.split(" "))
            .sort((a, b) => b.length - a.length)[0] ?? [];
          const labelLines = mapLabelLines(zone_name);
          const centroid = (() => {
            const xs = labelPoints.map((p) => parseFloat(p.split(",")[0] ?? "0"));
            const ys = labelPoints.map((p) => parseFloat(p.split(",")[1] ?? "0"));
            return {
              x: xs.reduce((a, b) => a + b, 0) / (xs.length || 1),
              y: ys.reduce((a, b) => a + b, 0) / (ys.length || 1),
            };
          })();

          return (
            <g key={zone_id} filter={isSelected ? "url(#zoneGlow)" : undefined}>
              {polygons.map((points, idx) => (
                <polygon
                  key={`${zone_id}-${idx}`}
                  points={points}
                  fill={fill}
                  fillOpacity={isSelected ? 0.92 : 0.68}
                  stroke={isSelected ? "#67E8F9" : "rgba(255,255,255,0.55)"}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="cursor-pointer transition-[fill-opacity,stroke-width] duration-200 focus:outline-none"
                  tabIndex={idx === 0 ? 0 : -1}
                  role="button"
                  aria-label={
                    idx === 0
                      ? `${zone_name}, ${risk_level} risk. Select zone.`
                      : undefined
                  }
                  aria-pressed={idx === 0 ? isSelected : undefined}
                  onClick={() => onSelectZone(zone_id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectZone(zone_id);
                    }
                  }}
                />
              ))}
              {labelLines.map((line, lineIndex) => (
                <text
                  key={`${zone_id}-label-${lineIndex}`}
                  x={centroid.x}
                  y={centroid.y + (lineIndex - (labelLines.length - 1) / 2) * 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize={labelLines.length > 1 ? 7.5 : 8.5}
                  fontWeight={700}
                  pointerEvents="none"
                  aria-hidden
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65)" }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption className="sr-only">
        Click a zone polygon to view details. Colours indicate Low, Elevated, or
        Critical risk levels from generated scenario outputs.
      </figcaption>
    </figure>
  );
}
