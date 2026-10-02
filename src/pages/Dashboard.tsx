import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CircleCheck,
  Clock4,
  Eye,
  FileWarning,
  HelpCircle,
  Radio,
  Timer,
  TriangleAlert,
} from "lucide-react";
import MetricCard from "../components/MetricCard";
import { InfoTip } from "../components/MetricCard";
import { recentSessions } from "../data/demo";
import { currentAgreement, durationLabel, useApp } from "../store/AppStore";

const INFO_STATE = [
  { label: "KNOWN", value: 12, icon: CircleCheck, tone: "text-ok", bg: "bg-ok-soft" },
  { label: "DELAYED", value: 4, icon: Clock4, tone: "text-flare-dark", bg: "bg-flare-soft" },
  { label: "CONFLICTING", value: 3, icon: TriangleAlert, tone: "text-danger", bg: "bg-danger-soft" },
  { label: "STALE", value: 2, icon: Timer, tone: "text-dim", bg: "bg-canvas" },
  { label: "MISSING", value: 5, icon: HelpCircle, tone: "text-tech", bg: "bg-tech-soft" },
];

const STATUS_TONE: Record<string, string> = {
  LIVE: "bg-flare-soft text-flare-dark",
  COMPLETE: "bg-ok-soft text-ok",
  ARCHIVED: "bg-canvas text-dim ring-1 ring-line",
};

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const agreement = currentAgreement(state);
  const conflicts = String(state.unresolvedConflicts).padStart(2, "0");

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      {/* active training */}
      <section className="panel overflow-hidden" aria-label="Active training session">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
          <div className="p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="eyebrow">Active session</span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-flare-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-flare-dark">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flare" aria-hidden />
                Live
              </span>
              <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                Demo data
              </span>
            </div>

            <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-navy">
              Operation: {state.session.operation}
            </h2>
            <p className="mt-0.5 text-[13.5px] text-muted">
              Scenario: {state.session.scenarioName}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-[10px] bg-canvas px-3 py-2.5">
                <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Participants</dt>
                <dd className="mono text-[17px] font-bold text-navy">{state.session.participantIds.length}</dd>
              </div>
              <div className="rounded-[10px] bg-flare-soft px-3 py-2.5">
                <dt className="text-[9.5px] font-bold uppercase tracking-wide text-flare-dark/70">Communication</dt>
                <dd className="text-[13px] font-bold text-flare-dark">{state.session.commCondition}</dd>
              </div>
              <div className="rounded-[10px] bg-tech-soft px-3 py-2.5">
                <dt className="text-[9.5px] font-bold uppercase tracking-wide text-tech/70">Shared-state convergence</dt>
                <dd className="mono text-[17px] font-bold text-tech">{agreement}%</dd>
              </div>
              <div className="rounded-[10px] bg-canvas px-3 py-2.5">
                <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Decision</dt>
                <dd className="text-[13px] font-bold text-navy">
                  {state.decision ? `OPTION ${state.decision.choice}` : "PENDING"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/training/sig-horizon-01")}
                className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
              >
                Continue session <ArrowRight size={15} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => navigate("/reconstruction")}
                className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-tech hover:text-tech"
              >
                Shared state
              </button>
            </div>
          </div>

          <div className="grid-canvas flex flex-col justify-between gap-4 border-t border-line bg-white p-5 lg:border-l lg:border-t-0">
            <div>
              <p className="eyebrow mb-2">Session health</p>
              <div className="space-y-3">
                {[
                  { l: "Information agreement", v: agreement, tone: "bg-tech" },
                  { l: "Channel integrity", v: state.session.commCondition === "NORMAL" ? 96 : 42, tone: "bg-flare" },
                  { l: "Decision readiness", v: state.decision ? 100 : 58, tone: "bg-ok" },
                ].map((b) => (
                  <div key={b.l}>
                    <div className="mb-1 flex items-center justify-between text-[11.5px]">
                      <span className="font-medium text-muted">{b.l}</span>
                      <span className="mono font-semibold text-navy">{b.v}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
                      <div className={`h-full rounded-full transition-[width] duration-700 ${b.tone}`} style={{ width: `${b.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-2.5 text-[11.5px] text-muted">
              <Radio size={14} className="shrink-0 text-tech" aria-hidden />
              Session clock <span className="mono font-semibold text-navy">{durationLabel(state.session.elapsedSec)}</span>
              · condition <span className="font-semibold text-navy">{state.session.commCondition}</span>
            </div>
          </div>
        </div>
      </section>

      {/* metrics */}
      <section aria-label="Training metrics">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="eyebrow">Training metrics</h2>
          <Link to="/analytics" className="text-[11.5px] font-semibold text-tech hover:underline">
            Open analytics →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Convergence time"
            value="42 sec"
            icon={Clock4}
            accent="tech"
            hint="Time from distributed information states until team agreement stabilised above 75%."
            delta="6s faster than the previous session"
          />
          <MetricCard
            label="State agreement"
            value={`${agreement}%`}
            icon={Activity}
            accent="ok"
            hint="Mean agreement across participants at the current moment."
            delta="Target band 75–85%"
          />
          <MetricCard
            label="Unresolved conflicts"
            value={conflicts}
            icon={TriangleAlert}
            accent="flare"
            hint="Information conflicts still open in the shared state."
            delta="Report C vs Report D"
          />
          <MetricCard
            label="Decision latency"
            value="31 sec"
            icon={Timer}
            accent="navy"
            hint="Time between shared state being declared and the decision being submitted."
            delta="Within the training threshold"
          />
        </div>
      </section>

      {/* information state */}
      <section className="panel p-5" aria-label="Information state">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="eyebrow">Information state</h2>
            <p className="text-[13px] text-muted">
              Aggregate condition of every information item in the active session
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-faint">
            <Eye size={13} aria-hidden /> 26 tracked items
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {INFO_STATE.map((s) => (
            <div key={s.label} className="rounded-[11px] border border-line bg-white p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className={`flex h-7 w-7 items-center justify-center rounded-[8px] ${s.bg} ${s.tone}`}>
                  <s.icon size={14} aria-hidden />
                </span>
                <InfoTip
                  text={`Items currently marked ${s.label.toLowerCase()} in the reconciled shared state.`}
                />
              </div>
              <p className="mono text-[24px] font-bold leading-none text-navy">
                {String(s.value).padStart(2, "0")}
              </p>
              <p className={`mt-1.5 text-[10.5px] font-bold uppercase tracking-wide ${s.tone}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* recent sessions */}
      <section className="panel overflow-hidden" aria-label="Recent sessions">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="eyebrow">Recent sessions</h2>
            <p className="text-[13px] font-semibold text-navy">Synthetic demo records</p>
          </div>
          <Link
            to="/training"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-muted transition-colors hover:border-tech hover:text-tech"
          >
            All sessions <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/60">
                {["Session", "Scenario", "Participants", "Convergence", "Decision", "Status"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-faint">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-canvas/50">
                  <td className="px-5 py-3">
                    <span className="mono text-[12.5px] font-semibold text-navy">{s.session}</span>
                  </td>
                  <td className="px-5 py-3 text-[12.5px] font-medium text-navy">{s.scenario}</td>
                  <td className="mono px-5 py-3 text-[12.5px] text-muted">{s.participants}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-canvas">
                        <span className="block h-full rounded-full bg-tech" style={{ width: s.convergence }} />
                      </span>
                      <span className="mono text-[12px] font-semibold text-navy">{s.convergence}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12.5px] text-muted">{s.decision}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_TONE[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
