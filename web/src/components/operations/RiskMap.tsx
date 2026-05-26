import { useMemo } from "react";
import type { ScoredZonesGeoJSON } from "../../data/types";
import { computeBounds, projectPolygonWithBounds } from "../../lib/geoProjection";
import { RISK_COLORS } from "../../lib/riskStyles";

const VIEWBOX = { minX: 0, minY: 0, width: 520, height: 360 };

export type RiskMapProps = {
  geojson: ScoredZonesGeoJSON | null;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  loading?: boolean;
};

export function RiskMap({
  geojson,
  selectedZoneId,
  onSelectZone,
  loading = false,
}: RiskMapProps) {
  const bounds = useMemo(() => {
    if (!geojson?.features.length) return null;
    return computeBounds(geojson.features.map((f) => f.geometry));
  }, [geojson]);

  if (loading) {
    return (
      <div
        className="flex h-[360px] items-center justify-center rounded-2xl bg-[#0B2545] text-sm text-cyan-200/70"
        aria-busy="true"
        aria-label="Loading risk map"
      >
        Loading generalized risk map…
      </div>
    );
  }

  if (!geojson || !bounds) {
    return (
      <div
        className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-[#E4E7EC]/30 bg-[#0B2545] text-sm text-slate-400"
        role="alert"
      >
        Risk map data unavailable
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-2xl bg-[#071A33] shadow-inner">
      <svg
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Generalized Mississauga pilot risk zones map. Polygons represent screening areas only, not precise feeder or transformer locations."
      >
        <title>Mississauga generalized risk zones</title>
        <rect
          x={0}
          y={0}
          width={VIEWBOX.width}
          height={VIEWBOX.height}
          fill="#0B2545"
        />
        <text
          x={VIEWBOX.width / 2}
          y={28}
          textAnchor="middle"
          fill="#22D3EE"
          fontSize={13}
          fontWeight={600}
        >
          Mississauga — Generalized Grid Risk Areas
        </text>
        <text
          x={VIEWBOX.width / 2}
          y={46}
          textAnchor="middle"
          fill="#667085"
          fontSize={10}
        >
          Illustrative pilot zones · not utility asset boundaries
        </text>
        {geojson.features.map((feature) => {
          const { zone_id, zone_name, risk_level } = feature.properties;
          const isSelected = zone_id === selectedZoneId;
          const points = projectPolygonWithBounds(
            feature.geometry,
            bounds,
            VIEWBOX,
          );
          const fill = RISK_COLORS[risk_level];

          return (
            <g key={zone_id}>
              <polygon
                points={points}
                fill={fill}
                fillOpacity={isSelected ? 0.85 : 0.55}
                stroke={isSelected ? "#22D3EE" : "#ffffff"}
                strokeWidth={isSelected ? 3 : 1}
                strokeOpacity={isSelected ? 1 : 0.35}
                className="cursor-pointer transition-[fill-opacity,stroke] duration-200 focus:outline-none"
                tabIndex={0}
                role="button"
                aria-label={`${zone_name}, ${risk_level} risk. Select zone.`}
                aria-pressed={isSelected}
                onClick={() => onSelectZone(zone_id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectZone(zone_id);
                  }
                }}
              />
              <text
                x={(() => {
                  const pts = points.split(" ");
                  const xs = pts.map((p: string) =>
                    parseFloat(p.split(",")[0] ?? "0"),
                  );
                  return xs.reduce((a: number, b: number) => a + b, 0) / (xs.length || 1);
                })()}
                y={(() => {
                  const pts = points.split(" ");
                  const ys = pts.map((p: string) =>
                    parseFloat(p.split(",")[1] ?? "0"),
                  );
                  return ys.reduce((a: number, b: number) => a + b, 0) / (ys.length || 1);
                })()}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={9}
                fontWeight={600}
                pointerEvents="none"
                aria-hidden
              >
                {zone_name.split(" ")[0]}
              </text>
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
