import { Link } from "react-router-dom";
import { ArrowRight, ScrollText, ShieldCheck } from "lucide-react";
import DecisionPanel from "../components/DecisionPanel";
import DecisionTimeline from "../components/DecisionTimeline";
import SimBadge from "../components/SimBadge";
import { useApp } from "../store/AppStore";

export default function Decision() {
  const { state } = useApp();

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-navy text-white">
          <ShieldCheck size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[21px] font-extrabold tracking-tight text-navy sm:text-[23px]">
              TEAM DECISION
            </h2>
            <SimBadge compact />
          </div>
          <p className="mt-0.5 text-[13px] text-muted">
            The decision is recorded together with its reason, timestamp and the information that
            existed at that moment.
          </p>
        </div>
        <Link
          to="/aar"
          className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-muted transition-colors hover:border-tech hover:text-tech"
        >
          After-action review <ArrowRight size={14} aria-hidden />
        </Link>
      </div>

      <DecisionPanel sharedState={state.sharedState} />

      <section className="panel p-5" aria-label="Decision timeline">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-tech-soft text-tech">
              <ScrollText size={16} aria-hidden />
            </span>
            <div>
              <p className="eyebrow">Evidence chain</p>
              <h3 className="text-[15px] font-bold tracking-tight text-navy">DECISION TIMELINE</h3>
            </div>
          </div>
          <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
            Timestamped for after-action review
          </span>
        </div>
        <DecisionTimeline entries={state.decisionTimeline} />
      </section>
    </div>
  );
}
