import { Activity } from "lucide-react";
import { MANDATORY_DISCLAIMER, RISK_FORMULA } from "./data/types";

/**
 * F0 scaffold shell — full dashboard wired in tasks P2, P3, and I1.
 * Default demo state after P1: scenario `storm`, zone `cooksville-central`.
 */
function App() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-10">
      <header className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-amber-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">GridLumen AI</h1>
          <p className="text-sm text-slate-400">
            Climate &amp; Capacity Risk Radar — foundation scaffold
          </p>
        </div>
      </header>

      <main className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-6">
        <p className="text-slate-300">
          Repository initialized (task <strong>F0</strong>). Run parallel tasks from{" "}
          <code className="rounded bg-slate-800 px-1">CURSOR_TASKS.md</code> after
          committing this scaffold.
        </p>
        <dl className="mt-4 space-y-2 text-sm text-slate-400">
          <div>
            <dt className="font-medium text-slate-300">Risk formula</dt>
            <dd>{RISK_FORMULA}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-300">Planned default demo</dt>
            <dd>Severe storm scenario · Cooksville Central selected</dd>
          </div>
        </dl>
      </main>

      <footer className="text-xs text-amber-200/90" role="note">
        {MANDATORY_DISCLAIMER}
      </footer>
    </div>
  );
}

export default App;
