import type { GeoJsonPolygon } from "../data/types";

export interface ViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export function computeBounds(polygons: GeoJsonPolygon[]): {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
} {
  const coords = polygons.flatMap((p) => p.coordinates[0] ?? []);
  const lons = coords.map(([lon]) => lon);
  const lats = coords.map(([, lat]) => lat);
  return {
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
}

export function projectPolygonWithBounds(
  polygon: GeoJsonPolygon,
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number },
  viewBox: ViewBox,
  padding = 16,
): string {
  const ring = polygon.coordinates[0];
  if (!ring?.length) return "";

  const { minLon, maxLon, minLat, maxLat } = bounds;
  const innerW = viewBox.width - padding * 2;
  const innerH = viewBox.height - padding * 2;
  const lonSpan = maxLon - minLon || 1;
  const latSpan = maxLat - minLat || 1;

  const toX = (lon: number) =>
    viewBox.minX + padding + ((lon - minLon) / lonSpan) * innerW;
  const toY = (lat: number) =>
    viewBox.minY + padding + innerH - ((lat - minLat) / latSpan) * innerH;

  return ring.map(([lon, lat]) => `${toX(lon)},${toY(lat)}`).join(" ");
}
