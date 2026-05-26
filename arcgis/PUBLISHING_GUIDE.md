# ArcGIS Online — Manual Publishing Guide

This guide describes how to publish GridLumen AI **generated GeoJSON** to ArcGIS Online as a hosted feature layer and web map. It is a **manual, human-operated workflow** for hackathon proof only. Do not add API keys, tokens, or automated write scripts to this repository.

## Purpose

Demonstrate that the deterministic Python risk engine produces **map-ready spatial output** that can become a real styled hosted layer with click-through popups — without making the main web dashboard depend on ArcGIS login or credentials.

## Prerequisites

- [ ] P1 engine has run and produced outputs (see [Generate the source file](#1-generate-the-source-file)).
- [ ] A Seneca Hackathon or personal **ArcGIS Online** account with permission to add items and create web maps.
- [ ] Browser access to [ArcGIS Online](https://www.arcgis.com/).
- [ ] Source file: `scored_zones_storm.geojson` (Severe Wind & Rain Storm scenario — the default demo scenario).

## What you are publishing (and what you are not)

| Included in public layer | Excluded by design |
|---|---|
| Eight **generalized** Mississauga-area risk zone polygons | Precise transformer, feeder, or substation locations |
| Computed risk scores and explainability fields | Utility credential fields or secured asset identifiers |
| Representative prototype disclaimer on every feature | Claims of operational outage or equipment-failure prediction |

See [docs/ARCGIS_PRIVACY.md](../docs/ARCGIS_PRIVACY.md) for the full privacy model.

---

## 1. Generate the source file

From the repository root, run the deterministic engine (after P1 is merged):

```bash
cd engine
python -m gridlumen.risk_engine --scenario storm
python -m gridlumen.risk_engine --all --copy-to-web   # optional: all scenarios + web sync
```

**Primary upload file for GIS proof:**

```text
web/public/data/generated/scored_zones_storm.geojson
```

Alternate path if you have not copied to web yet:

```text
engine/output/scored_zones_storm.geojson
```

Verify the file before upload:

- [ ] `FeatureCollection` with **8** polygon features.
- [ ] Each feature includes `zone_id`, `zone_name`, `risk_score`, `risk_level`, `primary_driver`, `recommended_action`, `disclaimer`, and `prototype_data: true`.
- [ ] No fields named `transformer_id`, `feeder_id`, or similar utility asset identifiers.
- [ ] Storm scenario top zone: **Cooksville Central**, risk score **87**, level **Critical**.

Quick inspection (optional):

```bash
# Feature count
python -c "import json; d=json.load(open('web/public/data/generated/scored_zones_storm.geojson')); print(len(d['features']))"

# Sample properties
python -c "import json; f=json.load(open('web/public/data/generated/scored_zones_storm.geojson'))['features'][0]['properties']; print(f.get('zone_name'), f.get('risk_score'), f.get('risk_level'))"
```

---

## 2. Sign in to ArcGIS Online

1. Open [https://www.arcgis.com/](https://www.arcgis.com/).
2. Sign in with your hackathon or organizational account.
3. Confirm you can open **Content** → **My content** and **Map** → **Create map**.

> **Do not** store ArcGIS usernames, passwords, or API keys in this repository.

---

## 3. Publish GeoJSON as a hosted feature layer

### Option A — Add data from local file (recommended)

1. Go to **Content** → **My content** → **New item**.
2. Choose **Your device** (or drag-and-drop).
3. Select `scored_zones_storm.geojson`.
4. When prompted:
   - **Title:** `GridLumen — Mississauga Risk Zones (Storm Scenario)`
   - **Tags:** `gridlumen`, `hackathon`, `prototype`, `storm`
   - **Summary:** `Generalized pilot risk zones from GridLumen deterministic engine — representative prototype data only.`
5. Choose to publish as a **hosted feature layer** (not tile layer only).
6. Set sharing to **Organization** or **Everyone (public)** per hackathon submission requirements.
7. Finish and wait for item processing to complete.

### Option B — Map Viewer add layer

1. Open **Map** → **Create map**.
2. **Add** → **Add layer from file** → upload `scored_zones_storm.geojson`.
3. When the layer appears, use **Save as** → **Save layer** to create a hosted feature layer item if your account supports it.

### Expected layer fields

ArcGIS should infer attribute columns from GeoJSON properties. Confirm these fields exist on the layer (see [POPUP_FIELDS.md](./POPUP_FIELDS.md) for full schema):

| Field | Type | Required for proof |
|---|---|---|
| `zone_id` | string | Yes (internal key) |
| `zone_name` | string | Yes (popup label) |
| `scenario` | string | Yes |
| `hazard_score` | number | Optional in popup |
| `infrastructure_score` | number | Optional in popup |
| `capacity_score` | number | Optional in popup |
| `risk_score` | number | Yes |
| `risk_level` | string | Yes (styling + popup) |
| `primary_driver` | string | Yes |
| `recommended_action` | string | Yes |
| `urgency` | string | Optional in popup |
| `prototype_data` | boolean/string | Yes (audit) |
| `disclaimer` | string | **Yes — mandatory** |

If a field is missing after publish, re-upload from a verified GeoJSON file; do not hand-edit scores in ArcGIS.

---

## 4. Style the layer by risk level

Style polygons using **`risk_level`** unique values. Match GridLumen dashboard colours (green / amber / red):

| `risk_level` value | Fill colour (hex) | Outline | Label |
|---|---|---|---|
| `Low` | `#17B26A` | `#12804D` or white 1px | Low |
| `Elevated` | `#F79009` | `#B54708` or white 1px | Elevated |
| `Critical` | `#F04438` | `#B42318` or white 1px | Critical |

### Steps in Map Viewer

1. Open the hosted layer in **Map Viewer**.
2. Select the layer → **Styles** (or **Symbology**).
3. Choose **Unique values** on field **`risk_level`**.
4. Assign the three colours above to `Low`, `Elevated`, and `Critical`.
5. Set fill opacity ~**70–85%** so the basemap remains visible.
6. Enable a **legend** showing all three categories with text labels (not colour alone).

Detailed styling and popup copy: [POPUP_FIELDS.md](./POPUP_FIELDS.md).

---

## 5. Configure popups

1. Layer → **Configure popups** (or **Pop-ups** in newer Map Viewer).
2. Use **Custom attribute display** or a simple field list.
3. **Show in popup (minimum proof set):**
   - `zone_name` — title or first row
   - `risk_score`
   - `risk_level`
   - `primary_driver`
   - `recommended_action`
   - `disclaimer` — always visible, not collapsed
4. **Hide or de-emphasize** (optional): raw component scores unless needed for Q&A; never expose non-existent asset fields.

Suggested popup title: `{zone_name}`  
Suggested subtitle: `Priority Risk Score: {risk_score} — {risk_level}`

Add a static description line above the disclaimer:

> Generalized Grid Risk Area — representative pilot zone, not a precise feeder or asset boundary.

Save popup configuration on the layer item.

---

## 6. Save the web map

1. **Basemap:** Light Gray Canvas, Streets, or Topographic — keep contrast with red/amber/green zones.
2. Zoom to Mississauga so all eight zones are visible at a readable scale.
3. **Save map** with title:

```text
GridLumen AI — Mississauga Climate & Capacity Risk Radar
```

4. **Summary:** Explainable infrastructure vulnerability screening prototype; storm scenario; representative data only.
5. **Tags:** `gridlumen`, `mississauga`, `infrastructure-vulnerability`, `prototype`
6. Set sharing consistent with submission requirements.

---

## 7. Proof-of-feasibility checklist (storm scenario)

Use this list when publishing the **storm** scenario as the primary GIS proof:

- [ ] Source file is `scored_zones_storm.geojson` from the deterministic engine (not hand-drawn geometry).
- [ ] Layer published as hosted feature layer with 8 zones.
- [ ] Symbology uses **`risk_level`** with green (`Low`), amber (`Elevated`), red (`Critical`).
- [ ] Legend displays text labels for all three risk levels.
- [ ] Popup on **Cooksville Central** shows score **87**, level **Critical**, driver, action, and full disclaimer.
- [ ] Popup on at least one **Elevated** zone (e.g. Streetsville West) shows amber styling and correct fields.
- [ ] Popup on at least one **Low** zone (e.g. Malton Industrial in storm scenario) shows green styling.
- [ ] Map title matches: `GridLumen AI — Mississauga Climate & Capacity Risk Radar`.
- [ ] No secured utility asset layer is published; map shows **generalized polygons only**.
- [ ] Screenshot or screen recording captured → `arcgis/screenshots/` (see [DEMO_RECORDING_CHECKLIST.md](./DEMO_RECORDING_CHECKLIST.md)).
- [ ] Pitch segment states: *representative prototype data only; not an operational outage forecast.*

---

## 8. Optional: publish other scenarios

For extended demo material only (not required for minimum proof):

| File | Scenario | Default selected zone |
|---|---|---|
| `scored_zones_normal.geojson` | Normal Conditions | Meadowvale North |
| `scored_zones_heatwave_ev.geojson` | Heatwave + Evening EV Demand | Meadowvale North |

Repeat steps 3–6 for each file if you want separate layers or a group. The **storm** map remains the canonical GIS proof for the five-minute pitch.

---

## 9. Troubleshooting

| Issue | Action |
|---|---|
| GeoJSON fails to upload | Validate JSON syntax; ensure polygons are closed rings; re-run engine. |
| `risk_level` not available for styling | Confirm property names are lowercase with underscore; re-publish layer. |
| Colours do not match dashboard | Use exact hex values in [POPUP_FIELDS.md](./POPUP_FIELDS.md). |
| Popup missing disclaimer | Edit popup config; ensure `disclaimer` field is included and not hidden. |
| Login or sharing blocks judges | Capture screenshot/recording backup; keep web dashboard as primary offline demo. |
| Tempted to automate updates | Out of scope for MVP — see DESIGN.md stretch note S2; manual publish only. |

---

## 10. References

- Product specification: [DESIGN.md](../DESIGN.md) §13 (ArcGIS Online Proof Specification)
- Field and styling detail: [POPUP_FIELDS.md](./POPUP_FIELDS.md)
- Privacy boundaries: [docs/ARCGIS_PRIVACY.md](../docs/ARCGIS_PRIVACY.md)
- Recording checklist: [DEMO_RECORDING_CHECKLIST.md](./DEMO_RECORDING_CHECKLIST.md)
- ArcGIS Online — [Publish hosted feature layers](https://doc.arcgis.com/en/arcgis-online/manage-data/publish-features.htm)

---

## Manual workflow summary

```text
Engine generates scored_zones_storm.geojson
  → Human uploads GeoJSON to ArcGIS Online (hosted feature layer)
  → Style by risk_level (green / amber / red)
  → Configure popups (score, driver, action, disclaimer)
  → Save web map with GridLumen title
  → Capture screenshot/recording for pitch backup
```

No credentials, tokens, or automated ArcGIS write scripts belong in this repository.
