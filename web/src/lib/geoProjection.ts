import type { GeoJsonGeometry } from "../data/types";

export interface ViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

function polygonRings(geometry: GeoJsonGeometry): number[][][] {
  if (geometry.type === "Polygon") return geometry.coordinates;
  return geometry.coordinates.flatMap((polygon) => polygon);
}

export function computeBounds(geometries: GeoJsonGeometry[]): {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
} {
  const coords = geometries.flatMap((g) => polygonRings(g).flatMap((r) => r));
  const lons = coords.map(([lon]) => lon);
  const lats = coords.map(([, lat]) => lat);
  return {
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
}

export function projectGeometryWithBounds(
  geometry: GeoJsonGeometry,
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number },
  viewBox: ViewBox,
  padding = 16,
): string[] {
  const rings = polygonRings(geometry).filter((ring) => ring.length > 0);
  if (!rings.length) return [];

  const { minLon, maxLon, minLat, maxLat } = bounds;
  const innerW = viewBox.width - padding * 2;
  const innerH = viewBox.height - padding * 2;
  const lonSpan = maxLon - minLon || 1;
  const latSpan = maxLat - minLat || 1;

  const toX = (lon: number) =>
    viewBox.minX + padding + ((lon - minLon) / lonSpan) * innerW;
  const toY = (lat: number) =>
    viewBox.minY + padding + innerH - ((lat - minLat) / latSpan) * innerH;

  return rings.map((ring) =>
    ring.map(([lon, lat]) => `${toX(lon)},${toY(lat)}`).join(" "),
  );
}
