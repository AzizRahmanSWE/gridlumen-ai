# ArcGIS Map Proof — Demo Recording Checklist

Use this checklist to capture a reliable **GIS proof segment** for the five-minute pitch. The main web dashboard must remain the primary demo; ArcGIS proof is a separate, screen-recorded segment that shows map-ready engine output without risking login failures during the live walkthrough.

**Target slot in pitch:** ~3:25–3:50 (see `DESIGN.md` §19.1)

---

## Before recording

### Data and layer readiness

- [ ] `scored_zones_storm.geojson` generated from deterministic engine (not hand-edited).
- [ ] Layer published to ArcGIS Online per [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md).
- [ ] Symbology: `risk_level` → green `#17B26A` / amber `#F79009` / red `#F04438`.
- [ ] Popups configured per [POPUP_FIELDS.md](./POPUP_FIELDS.md) including mandatory `disclaimer`.
- [ ] Web map saved as **GridLumen AI — Mississauga Climate & Capacity Risk Radar**.
- [ ] Map opens without errors when signed in.

### Environment

- [ ] Stable network; ArcGIS session already signed in before recording starts.
- [ ] Browser zoom 100%; hide unrelated bookmarks/extensions if visible.
- [ ] Close unrelated tabs; full-screen or clean window crop.
- [ ] Disable notifications (OS and browser).
- [ ] Optional: second device or offline screenshot backup in `arcgis/screenshots/`.

### Narration prep

Prepare to say (adapt naturally):

> "The same deterministic analysis that powers our dashboard exports map-ready GeoJSON. Here it is as a hosted ArcGIS layer — styled by risk level, with explainable popups. These are **generalized pilot zones only**; precise utility asset locations stay in a secured deployment."

Never say: "real feeder boundaries," "actual transformer locations," or "confirmed outage prediction."

---

## Recording sequence (~25–30 seconds)

| Step | Action | What judges should see |
|---:|---|---|
| 1 | Open saved web map | Mississauga area, coloured zones, legend |
| 2 | Point to legend | Low (green), Elevated (amber), Critical (red) **with labels** |
| 3 | Click **Cooksville Central** (red) | Popup: score **87**, Critical, driver, action, **full disclaimer** |
| 4 | Pan slightly; click one **Elevated** zone (e.g. Streetsville West) | Amber polygon; score ~65; disclaimer visible |
| 5 | Optional: click **Malton Industrial** (green) | Low zone; completes colour proof |
| 6 | Zoom out to full pilot extent | All eight generalized zones visible |

Keep mouse movement slow and deliberate. Pause 2–3 seconds on Cooksville popup so disclaimer is readable.

---

## Screenshot backup (required fallback)

If live ArcGIS access fails during final video edit, use static captures stored in:

```text
arcgis/screenshots/
```

Capture at minimum:

| Filename (suggested) | Content |
|---|---|
| `01-map-overview-storm.png` | Full map with legend and title |
| `02-popup-cooksville-critical.png` | Cooksville popup with disclaimer |
| `03-popup-elevated-zone.png` | One Elevated zone popup |
| `04-popup-low-zone.png` | One Low zone (optional) |

Add a one-line caption file or README note: *Storm scenario, representative prototype data, generated from GridLumen engine output.*

---

## Quality gate (pass / fail)

| Criterion | Pass |
|---|---|
| Layer source | Generated `scored_zones_storm.geojson` |
| Risk colours | Green / amber / red match `#17B26A` / `#F79009` / `#F04438` |
| Popup content | Score, level, driver, action, disclaimer on Cooksville |
| Privacy | No asset-level layers; narration says generalized zones only |
| Truthfulness | Disclaimer visible; no operational prediction claims |
| Backup | Screenshot set saved if recording might fail |

---

## Integration with main demo

- [ ] Web dashboard demo recorded **separately** and works fully offline.
- [ ] ArcGIS segment edited in as B-roll or cutaway — not embedded in a way that blocks the app if ArcGIS is down.
- [ ] Pitch script references ArcGIS as **feasibility proof**, not as live production integration.

---

## After recording

- [ ] Save raw recording and exported clip to project media folder (outside git if large).
- [ ] Copy key screenshots into `arcgis/screenshots/`.
- [ ] Note web map URL in personal runbook only — **do not commit URLs with tokens or private org IDs** unless explicitly approved for public sharing.
- [ ] Verify pitch segment still fits five-minute total runtime.

---

## Related documents

- [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md) — upload and style steps
- [POPUP_FIELDS.md](./POPUP_FIELDS.md) — field and popup specification
- [docs/ARCGIS_PRIVACY.md](../docs/ARCGIS_PRIVACY.md) — public vs secured data boundaries
