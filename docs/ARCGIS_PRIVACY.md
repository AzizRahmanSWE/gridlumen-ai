# ArcGIS Privacy and Data Boundaries

GridLumen AI uses ArcGIS Online as a **proof-of-feasibility** channel: generated GeoJSON from the deterministic risk engine becomes a styled hosted feature layer. This document defines what may appear on public maps and what must never be published in the hackathon prototype.

---

## Core principle

**Public viewers see generalized risk polygons and explainability text only.**  
**Precise utility asset locations and secured operational layers are not included.**

The web dashboard reinforces this with a locked "Secured Utility Layer" concept — that layer is a **future authorized deployment** narrative, not data published in this prototype.

---

## What the public ArcGIS map includes

| Element | Description | Claim permitted |
|---|---|---|
| Generalized zone polygons | Eight simplified Mississauga-area neighbourhood zones | "Generalized pilot zones for vulnerability screening" |
| Risk scores and levels | Computed Priority Risk Score and Low/Elevated/Critical class | "Explainable screening index under a modeled scenario" |
| Driver and action text | `primary_driver`, `recommended_action` from engine output | "Planning-oriented recommendations, not dispatch orders" |
| Mandatory disclaimer | On every feature and in popups | "Representative prototype data only" |
| Storm scenario layer | Primary GIS proof from `scored_zones_storm.geojson` | "Severe wind & rain storm scenario — modeled" |

---

## What the public ArcGIS map excludes

| Element | Why excluded |
|---|---|
| Transformer, feeder, substation, or pole locations | Not public; privacy and security |
| Customer premise or meter-level data | Personal / operational sensitivity |
| Utility credential or internal asset identifiers | Security |
| "Confirmed outage" or "equipment failure" predictions | Unsupported by available labeled data |
| Real Alectra or LDC operational integrations | Not implemented in prototype |
| Automated writes from repository scripts | Out of scope; manual publish only |

If a field name resembles operational asset data (`feeder_id`, `transformer_id`, etc.), it must not appear in generated GeoJSON or hosted layers. Engine tests enforce this guard.

---

## Public view vs secured utility layer (conceptual)

```text
┌─────────────────────────────────────────────────────────────────┐
│  PUBLIC (ArcGIS proof + web dashboard demo mode)                │
│  • Generalized risk polygons                                    │
│  • Risk score, level, drivers, recommended actions              │
│  • Representative prototype disclaimer                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SECURED UTILITY DEPLOYMENT (future — NOT in hackathon publish) │
│  • Authorized asset geometry and attributes                     │
│  • Feeder / transformer context for qualified planners only     │
│  • Role-based access, audit, and utility data agreements        │
└─────────────────────────────────────────────────────────────────┘
```

The hackathon submission demonstrates the **left column only**. The secured layer is described in UI copy and pitch narrative as a production pathway — not as data the prototype possesses or displays.

---

## Geometry honesty

- Zone polygons are **illustrative, generalized** shapes for demo readability.
- They must **not** be labeled or narrated as exact feeder boundaries, service territories, or verified utility topology.
- Coordinate values are demonstration geometry suitable for a Mississauga pilot narrative, not claims of surveyed asset alignment.

---

## Scenario and data truth

| Aspect | Prototype truth |
|---|---|
| Hazard, infrastructure, capacity inputs | Representative fixture values unless explicitly integrated public layers are documented elsewhere |
| Risk scores | Deterministic formula output — auditable, not ML predictions |
| ArcGIS layer | Snapshot of engine output at publish time; manual update only for MVP |
| Live operational grid state | Not connected |

Mandatory disclaimer (every feature and visible popup):

> Representative prototype data only; not an operational outage forecast or equipment-failure prediction.

---

## Sharing and credentials

- ArcGIS Online accounts and tokens are **personal/organizational secrets** — never commit them to this repository.
- Sharing level (organization vs public) follows hackathon submission rules; either is acceptable if judges can access the map during review.
- Do not embed API keys in the frontend or in documentation examples.

---

## Manual publish only (MVP)

Programmatic hosted-layer overwrite, scheduled sync, and alert workflows are **stretch / roadmap** items. The MVP proof is:

1. Engine generates GeoJSON locally.
2. Human uploads and styles the layer in ArcGIS Online.
3. Human captures screenshot or recording for the pitch.

This keeps the main dashboard reliable when ArcGIS is unavailable.

---

## Presenter language — say / do not say

| Say | Do not say |
|---|---|
| "Generalized risk zones" | "Exact feeder map" |
| "Representative prototype screening" | "Real Alectra asset data" |
| "Map-ready engine output" | "Live grid integration" |
| "Explainable priority index" | "Confirmed failure prediction" |
| "Secured asset layer in a future utility deployment" | "We published transformer locations" |

---

## Related documents

- [arcgis/PUBLISHING_GUIDE.md](../arcgis/PUBLISHING_GUIDE.md)
- [arcgis/POPUP_FIELDS.md](../arcgis/POPUP_FIELDS.md)
- [arcgis/DEMO_RECORDING_CHECKLIST.md](../arcgis/DEMO_RECORDING_CHECKLIST.md)
- [DESIGN.md](../DESIGN.md) §3.3, §13.4
