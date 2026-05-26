import { useCallback, useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { OperationsWorkspace } from "./components/operations/OperationsWorkspace";
import { ArchitectureSection } from "./components/sections/ArchitectureSection";
import { DataDisclosureSection } from "./components/sections/DataDisclosureSection";
import { MethodologySection } from "./components/sections/MethodologySection";
import type { AllScenariosData } from "./lib/scenarioData";

type AppProps = {
  preloaded?: AllScenariosData;
};

function App({ preloaded }: AppProps) {
  const [activeAnchor, setActiveAnchor] = useState<
    "overview" | "risk-map" | "interventions" | "methodology"
  >("overview");

  const scrollToSection = useCallback((anchor: string) => {
    const id =
      anchor === "interventions"
        ? "interventions"
        : anchor === "risk-map"
          ? "risk-map"
          : anchor;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveAnchor(
      anchor as "overview" | "risk-map" | "interventions" | "methodology",
    );
  }, []);

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <Header activeAnchor={activeAnchor} onNavigate={scrollToSection} />

      <main className="mx-auto max-w-[1240px] px-6 py-4">
        <div id="overview" className="scroll-mt-24">
          <OperationsWorkspace
            preloaded={preloaded}
            initialScenario="storm"
            recordingLayout
            showPrototypeBanner
          />
        </div>
      </main>

      <MethodologySection className="border-t border-[var(--border)] bg-white" />
      <ArchitectureSection className="bg-[var(--surface)]" />
      <DataDisclosureSection className="border-t border-[var(--border)] bg-white" />
      <Footer />
    </div>
  );
}

export default App;
