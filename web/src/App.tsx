import { useCallback, useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { HeroControls } from "./components/layout/HeroControls";
import { KpiCards } from "./components/layout/KpiCards";
import {
  InterventionQueue,
  RiskLegend,
  RiskMap,
  SecuredUtilityLayerModal,
  ZoneDetailPanel,
} from "./components/operations";
import { ArchitectureSection } from "./components/sections/ArchitectureSection";
import { DataDisclosureSection } from "./components/sections/DataDisclosureSection";
import { MethodologySection } from "./components/sections/MethodologySection";
import { RoadmapSection } from "./components/sections/RoadmapSection";
import { MANDATORY_DISCLAIMER } from "./data/types";
import { useScenario } from "./hooks/useScenario";
import type { AllScenariosData } from "./lib/scenarioData";

type NavAnchor = "overview" | "risk-map" | "interventions" | "methodology";

export type AppProps = {
  /** Preloaded scenario bundles for tests; production uses generated files. */
  preloaded?: AllScenariosData;
};

function PrototypeBanner() {
  return (
    <p
      className="rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-2.5 text-center text-xs leading-relaxed text-amber-950"
      role="note"
    >
      <span className="font-semibold uppercase tracking-wide">Prototype demo</span>
      {" · "}
      {MANDATORY_DISCLAIMER}
    </p>
  );
}

function KpiSkeleton() {
  return (
    <div
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Loading scenario KPIs"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)]"
        />
      ))}
    </div>
  );
}

function StaticAgentProofCard() {
  return (
    <section
      className="mx-auto max-w-[1240px] px-6 pb-8"
      aria-label="Automated analysis proof"
    >
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Automated Analysis Proof (optional)
        </h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Hermes may orchestrate the approved deterministic Python scoring run
          locally and summarize map-ready outputs. It is not the risk model and
          is not required for this dashboard to function offline.
        </p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">{MANDATORY_DISCLAIMER}</p>
      </div>
    </section>
  );
}

export default function App({ preloaded }: AppProps) {
  const [securedOpen, setSecuredOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<NavAnchor>("overview");

  const {
    scenario,
    setScenario,
    selectedZoneId,
    setSelectedZoneId,
    activeSummary,
    geojson,
    selectedZone,
    rankedQueue,
    baselineScoreDelta,
    loading,
    error,
  } = useScenario({ initialScenario: "storm", preloaded });

  const showAgentCard = import.meta.env.VITE_SHOW_AGENT_CARD === "true";

  const scrollToSection = useCallback((anchor: string) => {
    const id =
      anchor === "overview"
        ? "overview"
        : anchor === "risk-map"
          ? "risk-map"
          : anchor === "interventions"
            ? "interventions"
            : "methodology";
    setActiveAnchor(id as NavAnchor);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)]">
      <Header activeAnchor={activeAnchor} onNavigate={scrollToSection} />

      <main>
        <div
          id="overview"
          className="mx-auto max-w-[1240px] space-y-6 px-6 py-6"
        >
          <PrototypeBanner />

          <HeroControls
            scenario={scenario}
            onScenarioChange={setScenario}
            forecastHorizonLabel="Next 24 Hours"
            onOpenSecuredLayer={() => setSecuredOpen(true)}
            disabled={loading}
          />

          {error && (
            <p
              className="rounded-lg border border-red-300/50 bg-red-50 px-4 py-2 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          )}

          {activeSummary ? (
            <KpiCards summary={activeSummary} />
          ) : (
            <KpiSkeleton />
          )}

          <div
            id="risk-map"
            className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,340px)]"
          >
            <div className="space-y-3">
              <RiskMap
                geojson={geojson}
                selectedZoneId={selectedZoneId}
                onSelectZone={setSelectedZoneId}
                loading={loading}
              />
              <RiskLegend />
            </div>
            <ZoneDetailPanel
              zone={selectedZone}
              scenario={scenario}
              baselineDelta={baselineScoreDelta}
            />
          </div>

          <section id="interventions">
            <InterventionQueue
              zones={rankedQueue}
              selectedZoneId={selectedZoneId}
              onSelectZone={setSelectedZoneId}
            />
          </section>

          {activeSummary && (
            <p className="sr-only" aria-live="polite">
              Active scenario: {activeSummary.display_name}.{" "}
              {activeSummary.critical_zones} critical zones,{" "}
              {activeSummary.elevated_zones} elevated.
            </p>
          )}
        </div>

        <MethodologySection />
        <DataDisclosureSection />
        <ArchitectureSection />
        {showAgentCard && <StaticAgentProofCard />}
        <RoadmapSection />
      </main>

      <Footer />

      <SecuredUtilityLayerModal
        open={securedOpen}
        onClose={() => setSecuredOpen(false)}
      />
    </div>
  );
}
