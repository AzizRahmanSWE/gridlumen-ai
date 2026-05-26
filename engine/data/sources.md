# Data sources (prototype)

Canonical demo fixtures live in `demo/scenarios.json` and `demo/zones.geojson`. Public layer integration is documented in `DESIGN.md` and `docs/SOURCE_ATTRIBUTIONS.md` (task P6).

## Q1A spatial credibility geometry source

- **Publisher:** City of Mississauga
- **Dataset:** Ward Boundaries (Municipal Electoral Boundaries)
- **Portal page:** https://data.mississauga.ca/datasets/ward-boundaries/about
- **ArcGIS query endpoint:** https://services6.arcgis.com/hM5ymMLbxIyWTjn2/ArcGIS/rest/services/Ward_Boundaries/FeatureServer/2/query
- **Retrieved:** 2026-05-26
- **Use in prototype:** public screening geography only; representative risk values are joined to ward-derived polygons for map credibility.
