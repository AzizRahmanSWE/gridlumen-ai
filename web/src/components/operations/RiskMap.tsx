import { useMemo, useId } from "react";
import type { ScoredZonesGeoJSON } from "../../data/types";
import { computeBounds, projectPolygonWithBounds } from "../../lib/geoProjection";
import { RISK_COLORS } from "../../lib/riskStyles";

const VIEWBOX = { minX: 0, minY: 0, width: 520, height: 380 };

export type RiskMapProps = {
  geojson: ScoredZonesGeoJSON | null;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  loading?: boolean;
};

function MapGridPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
      <path
        d="M 24 0 L 0 0 0 24"
        fill="none"
        stroke="#22D3EE"
        strokeWidth="0.35"
        strokeOpacity="0.12"
      />
    </pattern>
  );
}

export function RiskMap({
  geojson,
  selectedZoneId,
  onSelectZone,
  loading = false,
}: RiskMapProps) {
  const patternId = useId().replace(/:/g, "");
  const bounds = useMemo(() => {
    if (!geojson?.features.length) return null;
    return computeBounds(geojson.features.map((f) => f.geometry));
  }, [geojson]);

  if (loading) {
    return (
      <div
        className="flex h-[380px] items-center justify-center rounded-[var(--radius-lg)] border border-[var(--navy-800)] bg-gradient-to-br from-[var(--navy-950)] to-[var(--navy-900)]"
        aria-busy="true"
        aria-label="Loading risk map"
      >
        <div className="flex flex-col items-center gap-3 text-sm text-cyan-200/80">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
          Loading risk map…
        </div>
      </div>
    );
  }

  if (!geojson || !bounds) {
    return (
      <div
        className="flex h-[380px] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--navy-900)] text-sm text-slate-400"
        role="alert"
      >
        Risk map data unavailable
      </div>
    );
  }

  return (
    <figure
      className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--navy-800)] shadow-[var(--shadow-map)]"
    >
      <svg
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Generalized Mississauga pilot risk zones map. Polygons represent screening areas only, not precise feeder or transformer locations."
      >
        <defs>
          <MapGridPattern id={patternId} />
          <linearGradient id={`mapBg-${patternId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2545" />
            <stop offset="100%" stopColor="#071A33" />
          </linearGradient>
          <radialGradient id={`vignette-${patternId}`} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#071A33" stopOpacity="0" />
          </radialGradient>
          <filter id={`glow-${patternId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          width={VIEWBOX.width}
          height={VIEWBOX.height}
          fill={`url(#mapBg-${patternId})`}
        />
        <rect
          width={VIEWBOX.width}
          height={VIEWBOX.height}
          fill={`url(#${patternId})`}
        />
        <rect
          width={VIEWBOX.width}
          height={VIEWBOX.height}
          fill={`url(#vignette-${patternId})`}
        />
        <text
          x={VIEWBOX.width / 2}
          y={32}
          textAnchor="middle"
          fill="#E0F2FE"
          fontSize={14}
          fontWeight={600}
          fontFamily="DM Sans, system-ui, sans-serif"
        >
          Mississauga — Generalized Grid Risk Areas
        </text>
        <text
          x={VIEWBOX.width / 2}
          y={50}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize={10}
          fontFamily="DM Sans, system-ui, sans-serif"
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
          const centroid = (() => {
            const pts = points.split(" ");
            const xs = pts.map((p) => parseFloat(p.split(",")[0] ?? "0"));
            const ys = pts.map((p) => parseFloat(p.split(",")[1] ?? "0"));
            return {
              x: xs.reduce((a, b) => a + b, 0) / (xs.length || 1),
              y: ys.reduce((a, b) => a + b, 0) / (ys.length || 1),
            };
          })();

          return (
            <g key={zone_id} filter={isSelected ? `url(#glow-${patternId})` : undefined}>
              <polygon
                points={points}
                fill={fill}
                fillOpacity={isSelected ? 0.92 : 0.62}
                stroke={isSelected ? "#67E8F9" : "rgba(255,255,255,0.45)"}
                strokeWidth={isSelected ? 2.5 : 1}
                className="cursor-pointer transition-[fill-opacity,stroke-width] duration-200 focus:outline-none"
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
                x={centroid.x}
                y={centroid.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={10}
                fontWeight={600}
                fontFamily="DM Sans, system-ui, sans-serif"
                pointerEvents="none"
                aria-hidden
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
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
