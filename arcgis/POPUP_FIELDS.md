# ArcGIS Layer Fields, Styling, and Popup Configuration

Reference for configuring the GridLumen **storm scenario** hosted feature layer. All values come from generated GeoJSON produced by the deterministic Python engine — do not edit scores or classifications in ArcGIS.

**Source file:** `web/public/data/generated/scored_zones_storm.geojson`

---

## Feature-layer attribute schema

Each polygon feature carries these properties (ArcGIS field names should match GeoJSON keys):

| Field | Type | Example (Cooksville Central, storm) | Popup | Styling | Notes |
|---|---|---|---|---|---|
| `zone_id` | string | `cooksville-central` | Hide | — | Stable feature key; not user-facing |
| `zone_name` | string | `Cooksville Central` | **Show (title)** | — | Human-readable zone label |
| `scenario` | string | `storm` | Show (optional) | — | Always `storm` for this layer |
| `hazard_score` | integer | `95` | Hide default | — | Component score 0–100 |
| `infrastructure_score` | integer | `90` | Hide default | — | Component score 0–100 |
| `capacity_score` | integer | `73` | Hide default | — | Component score 0–100 |
| `risk_score` | integer | `87` | **Show** | — | Priority Risk Score 0–100 |
| `risk_level` | string | `Critical` | **Show** | **Unique values** | `Low` \| `Elevated` \| `Critical` |
| `primary_driver` | string | `Wind + overhead + vegetation` | **Show** | — | Plain-language driver |
| `recommended_action` | string | `Prioritize overhead corridor inspection` | **Show** | — | Planner action text |
| `urgency` | string | `Immediate` | Show (optional) | — | `Routine` \| `Medium` \| `High` \| `Immediate` |
| `prototype_data` | boolean | `true` | Hide or badge | — | Audit flag; must be true |
| `disclaimer` | string | *(mandatory text)* | **Show (required)** | — | See [Mandatory disclaimer](#mandatory-disclaimer) |

### Fields that must never appear

Do not add or expect these in public layers:

- `transformer_id`, `feeder_id`, `substation_id`, `asset_gid`
- Utility credentials, customer counts tied to assets, or exact equipment coordinates labelled as operational assets
- Any field implying confirmed failure, outage, or overload prediction

---

## Risk level classification (engine-computed)

The engine assigns `risk_level` from `risk_score`:

| Score range | `risk_level` | Planner meaning |
|---:|---|---|
| 0–49 | `Low` | Normal monitoring |
| 50–69 | `Elevated` | Schedule assessment or monitor closely |
| 70–100 | `Critical` | Prioritize mitigation review |

Formula (fixed in MVP):

```text
risk_score = round(0.40 × hazard_score + 0.30 × infrastructure_score + 0.30 × capacity_score)
```

---

## Red / amber / green styling mapping

Apply **unique value symbology** on field **`risk_level`**. Use the same hex colours as the GridLumen web dashboard (`DESIGN.md` design tokens).

| Risk level | Dashboard token | Fill (hex) | Suggested outline (hex) | Display label | Pitch language |
|---|---|---|---|---|---|
| **Low** | `--risk-low` | `#17B26A` | `#12804D` | Low | Green — routine monitoring |
| **Elevated** | `--risk-elevated` | `#F79009` | `#B54708` | Elevated | Amber — review / monitor |
| **Critical** | `--risk-critical` | `#F04438` | `#B42318` | Critical | Red — prioritize mitigation |

### Symbology settings

| Setting | Recommended value |
|---|---|
| Method | Unique values |
| Field | `risk_level` |
| Fill opacity | 70–85% |
| Outline width | 1–2 px |
| Outline colour | Darker shade of fill or `#FFFFFF` on dark basemap |
| Legend | Enabled with text labels for all three classes |

### Accessibility

- Legend and popups must show **text labels** (`Low`, `Elevated`, `Critical`), not colour alone.
- Popup title should include zone name and risk level string.

---

## Popup configuration

### Minimum proof popup (required fields)

Display these attributes for every zone click:

1. **Zone:** `zone_name`
2. **Priority Risk Score:** `risk_score`
3. **Risk Level:** `risk_level`
4. **Primary driver:** `primary_driver`
5. **Recommended action:** `recommended_action`
6. **Disclaimer:** `disclaimer` (full text, always visible)

### Suggested popup layout (Map Viewer)

**Title:** `{zone_name}`

**Content blocks (top to bottom):**

```text
Generalized Grid Risk Area
Priority Risk Score: {risk_score} / 100
Risk Level: {risk_level}

Primary driver
{primary_driver}

Recommended action
{recommended_action}

---
{disclaimer}
```

**Optional footer (static text, not a field):**

> Precise transformer, feeder, and secured utility asset locations are not included in this public prototype map.

### Visibility rules

| Field / element | Visibility | Rationale |
|---|---|---|
| `zone_name` | Visible | Identifies generalized zone |
| `risk_score`, `risk_level` | Visible | Core explainability |
| `primary_driver`, `recommended_action` | Visible | Planner decision support |
| `disclaimer` | **Always visible** | Mandatory product truth |
| `zone_id`, `scenario` | Hidden or collapsed | Internal / redundant on single-scenario layer |
| `hazard_score`, `infrastructure_score`, `capacity_score` | Hidden by default | Optional expand for methodology Q&A |
| `urgency` | Optional visible | Supports intervention narrative |
| `prototype_data` | Hidden | Internal audit only |
| Asset-level fields | **Must not exist** | Privacy guard |

### Mandatory disclaimer

Exact string in every generated feature:

```text
Representative prototype data only; not an operational outage forecast or equipment-failure prediction.
```

The popup must show this verbatim from the `disclaimer` attribute — do not shorten or paraphrase in the hosted layer configuration.

---

## Storm scenario — expected zones for validation

After styling, confirm these rankings visually (top three critical in storm):

| Zone | risk_score | risk_level |
|---|---:|---|
| Cooksville Central | 87 | Critical |
| Meadowvale North | 82 | Critical |
| Port Credit East | 78 | Critical |
| Streetsville West | 65 | Elevated |
| Clarkson South | 59 | Elevated |
| City Centre | 55 | Elevated |
| Erin Mills | 51 | Elevated |
| Malton Industrial | 46 | Low |

Click **Cooksville Central** first in demo recordings — it is the default selected zone in the web dashboard storm scenario.

---

## Layer item metadata (recommended)

| Property | Value |
|---|---|
| Layer title | `GridLumen — Mississauga Risk Zones (Storm Scenario)` |
| Geometry type | Polygon |
| Coordinate system | WGS 84 (EPSG:4326) from GeoJSON |
| Web map title | `GridLumen AI — Mississauga Climate & Capacity Risk Radar` |

---

## Privacy boundary (summary)

- **Public layer:** generalized neighbourhood-scale risk polygons and explainability attributes only.
- **Not published:** precise asset locations, secured utility layers, or operational grid data.

Full policy: [docs/ARCGIS_PRIVACY.md](../docs/ARCGIS_PRIVACY.md).
