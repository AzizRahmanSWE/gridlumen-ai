# P3 → P2 / I1 integration notes

Task **P3** (`feat/map-zone-interactions`) owns the interactive operations workspace. Task **P2** owns presentational shell components. Task **I1** wires `App.tsx`.

## Exports (import from `web/src/components/operations`)

| Export | Purpose |
|--------|---------|
| `OperationsWorkspace` | Self-contained map + detail + queue + scenario toggles (usable for early QA) |
| `ScenarioToggle` | Scenario buttons only — embed in P2 `HeroControls` |
| `RiskMap`, `ZoneDetailPanel`, `InterventionQueue` | Granular layout control |
| `kpiFromSummary` | Maps `ScenarioSummary` → KPI card props |
| `useScenario` | Shared state hook (`web/src/hooks/useScenario.ts`) |

## Recommended I1 wiring

```tsx
import { useScenario } from "./hooks/useScenario";
import { kpiFromSummary, RiskMap, ZoneDetailPanel, InterventionQueue, ScenarioToggle } from "./components/operations";
import { Header, HeroControls, KpiCards, /* ... */ } from "./components/layout"; // P2

function App() {
  const scenarioState = useScenario({ initialScenario: "storm" });

  return (
    <>
      <Header />
      <HeroControls
        activeScenario={scenarioState.scenario}
        onScenarioChange={scenarioState.setScenario}
        onSecuredLayerClick={() => /* open SecuredUtilityLayerModal */}
      />
      <KpiCards {...kpiFromSummary(scenarioState.activeSummary!)} />
      <RiskMap
        geojson={scenarioState.geojson}
        selectedZoneId={scenarioState.selectedZoneId}
        onSelectZone={scenarioState.setSelectedZoneId}
        loading={scenarioState.loading}
      />
      <ZoneDetailPanel
        zone={scenarioState.selectedZone}
        scenario={scenarioState.scenario}
        baselineDelta={scenarioState.baselineScoreDelta}
      />
      <InterventionQueue
        zones={scenarioState.rankedQueue}
        selectedZoneId={scenarioState.selectedZoneId}
        onSelectZone={scenarioState.setSelectedZoneId}
      />
    </>
  );
}
```

## P2 `HeroControls` props to accept

| Prop | Type | Source |
|------|------|--------|
| `activeScenario` | `ScenarioId` | `useScenario().scenario` |
| `onScenarioChange` | `(id: ScenarioId) => void` | `useScenario().setScenario` |
| `onSecuredLayerClick` | `() => void` | Opens `SecuredUtilityLayerModal` |
| `forecastHorizon` | `string` | Static: `"Next 24 hours"` |
| `disabled` | `boolean` | `useScenario().loading` |

## P2 `KpiCards` props (via `kpiFromSummary`)

| Field | Storm canonical value |
|-------|----------------------|
| `criticalZones` | 3 |
| `elevatedZones` | 4 |
| `zonesToReview` | 7 |
| `peakUtilization` | `"76% modeled"` |
| `highestPriorityZone` | `"Cooksville Central"` |
| `topAction` | From top-ranked zone `recommended_action` |

Values must come from `activeSummary` (generated JSON after P1 merge), not hardcoded in P2.

## Data loading

- Hook loads `/data/generated/summary_{scenario}.json` and `scored_zones_{scenario}.geojson`.
- Until P1 copies files, hook falls back to `web/src/lib/fixtures/canonicalData.ts` (pre-computed offline; no React score math).
- After P1 merge, run `python -m gridlumen.risk_engine --all --copy-to-web` and remove fallback only if desired (fallback is safe for offline demos).

## State rules (DESIGN.md)

1. Default: `storm` + `cooksville-central`.
2. On scenario change: reset `selectedZoneId` to `summary.default_selected_zone_id`.
3. Map click and queue row click both call `setSelectedZoneId`.
4. Do not recalculate `risk_score` in the frontend.

## Styling

P3 uses inline Tailwind utility classes aligned with DESIGN.md tokens. P2 global tokens in `web/src/styles/index.css` should be extended in I1 for a unified dashboard; P3 does not modify P2-owned style files.
