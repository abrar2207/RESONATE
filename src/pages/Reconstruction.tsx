import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  HelpCircle,
  MessageCircleQuestion,
  Share2,
  Split,
} from "lucide-react";
import ConvergenceChart from "../components/ConvergenceChart";
import SharedStatePanel from "../components/SharedStatePanel";
import MetricCard from "../components/MetricCard";
import ReconcileDialog from "../components/ReconcileDialog";
import TeamChat from "../components/TeamChat";
import SimBadge from "../components/SimBadge";
import { convergenceMetrics, informationById, informationStates, participants } from "../data/demo";
import { currentAgreement, useApp } from "../store/AppStore";
import {
  Activity,
  Clock4,
  Gauge,
  Layers,
  Radar,
  Timer,
} from "lucide-react";

const METRIC_ICONS = [Clock4, Gauge, Layers, Split, Timer, Activity];

export default function Reconstruction() {
  const { state, dispatch, agreement } = useApp();
  const [open, setOpen] = useState(false);
  const conflictOpen = state.sharedState.conflicting.length > 0;
  const left = informationById("report-c");
  const right = informationById("report-d");

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      {/* header */}
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <Link
          to="/training/sig-horizon-01"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-navy hover:text-navy"
          aria-label="Back to training session"
        >
          <ArrowLeft size={15} aria-hidden />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-flare-soft text-flare-dark">
              <Share2 size={16} aria-hidden />
            </span>
            <h2 className="text-[21px] font-extrabold tracking-tight text-navy sm:text-[24px]">
              SHARED-STATE RECONSTRUCTION
            </h2>
            <SimBadge compact />
          </div>
          <p className="mt-1 text-[13px] text-muted">
            How quickly can the team reconstruct a common understanding?
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow">Current agreement</p>
          <p className="mono text-[28px] font-bold leading-none text-flare-dark">{agreement}%</p>
        </div>
      </div>

      {/* pipeline */}
      <section className="panel p-5" aria-label="Reconstruction pipeline">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="eyebrow">Reconstruction pipeline</p>
            <p className="text-[13.5px] font-semibold text-navy">
              Individual states → information reconciliation → shared state
            </p>
          </div>
          <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
            Demo data
          </span>
        </div>

        <div className="grid items-stretch gap-3 lg:grid-cols-[1.5fr_auto_0.9fr_auto_1fr]">
          {/* individual states */}
          <div className="rounded-[12px] border border-line bg-canvas p-3">
            <p className="eyebrow mb-2.5">Individual states</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {informationStates.map((st, i) => {
                const p = participants[i];
                return (
                  <motion.div
                    key={st.participantId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="rounded-[10px] border border-line bg-white p-2.5"
                  >
                    <div className="mb-2 flex items-center gap-1.5">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-[7px] text-[9px] font-bold text-white"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.initials}
                      </span>
                      <span className="text-[11px] font-bold tracking-wide text-navy">{p.label}</span>
                    </div>
                    <ul className="space-y-1">
                      {st.views.map((v) => (
                        <li
                          key={v.informationId}
                          className="flex items-center justify-between gap-1 text-[10.5px]"
                        >
                          <span className="truncate text-muted">
                            {informationById(v.informationId).title}
                          </span>
                          <span
                            className={`shrink-0 rounded px-1 py-px text-[9px] font-bold ${
                              v.status === "CONFIRMED"
                                ? "bg-ok-soft text-ok"
                                : v.status === "CONFLICTING"
                                  ? "bg-danger-soft text-danger"
                                  : v.status === "DELAYED"
                                    ? "bg-flare-soft text-flare-dark"
                                    : v.status === "STALE"
                                      ? "bg-dim/15 text-dim"
                                      : "bg-tech-soft text-tech"
                            }`}
                          >
                            {v.status.slice(0, 5)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-2.5 text-[11px] leading-snug text-faint">
              Four participants · four different views of the same scenario.
            </p>
          </div>

          {/* reconciliation */}
          <div className="flex items-center justify-center">
            <span className="hidden h-full w-8 items-center justify-center text-line-strong lg:flex" aria-hidden>
              <ArrowRight size={18} />
            </span>
            <div className="rounded-[12px] border border-flare/35 bg-flare-soft px-4 py-4 text-center">
              <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-flare-dark">
                <Split size={17} aria-hidden />
              </span>
              <p className="text-[11px] font-extrabold uppercase leading-tight tracking-[0.08em] text-flare-dark">
                Information
                <br />
                reconciliation
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-3 w-full rounded-[9px] bg-flare px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
              >
                {conflictOpen ? "Resolve conflict" : "Reconciliation done"}
              </button>
            </div>
          </div>

          {/* shared state preview */}
          <div className="flex items-center justify-center">
            <span className="hidden h-full w-8 items-center justify-center text-line-strong lg:flex" aria-hidden>
              <ArrowRight size={18} />
            </span>
            <div className="w-full rounded-[12px] border border-tech/30 bg-tech-soft px-4 py-4">
              <p className="eyebrow mb-2 text-tech">Shared state</p>
              <ul className="space-y-1.5">
                {[
                  { l: "Confirmed", v: state.sharedState.confirmed.length, c: "text-ok" },
                  { l: "Conflicting", v: state.sharedState.conflicting.length, c: "text-danger" },
                  { l: "Stale", v: state.sharedState.stale.length, c: "text-dim" },
                  { l: "Unverified", v: state.sharedState.unverified.length, c: "text-tech" },
                ].map((r) => (
                  <li key={r.l} className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-muted">{r.l}</span>
                    <span className={`mono font-bold ${r.c}`}>{String(r.v).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-tech/20 pt-2">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-tech">
                  Agreement {agreement}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* shared state categories */}
      <section aria-label="Shared state categories">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="eyebrow">Reconciled shared state</p>
            <p className="text-[13.5px] font-semibold text-navy">
              Four information categories held by the team
            </p>
          </div>
        </div>
        <SharedStatePanel sharedState={state.sharedState} onConflictClick={() => setOpen(true)} />
      </section>

      {/* convergence chart */}
      <ConvergenceChart
        revealCount={state.revealCount}
        reached={state.sharedStateReached}
        boost={state.agreementBoost}
      />

      {/* metrics */}
      <section aria-label="Convergence metrics">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="eyebrow">Convergence metrics</p>
            <p className="text-[13.5px] font-semibold text-navy">Measured for this session</p>
          </div>
          <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
            Demo data · not real-world measurements
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {convergenceMetrics.map((m, i) => {
            const Icon = METRIC_ICONS[i % METRIC_ICONS.length];
            return (
              <MetricCard
                key={m.key}
                label={m.label}
                value={m.value}
                hint={m.hint}
                icon={Icon}
                accent={i === 3 ? "flare" : i === 1 ? "ok" : "tech"}
              />
            );
          })}
        </div>
      </section>

      {/* reconciliation interaction */}
      <section className="panel overflow-hidden" aria-label="Information reconciliation">
        <div className="mb-0 flex flex-wrap items-center gap-3 border-b border-line bg-danger-soft px-5 py-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white text-danger">
            <Split size={16} aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-danger">
              {conflictOpen ? "Conflict detected" : "Conflict resolved"}
            </p>
            <p className="text-[13.5px] font-semibold text-navy">
              Report C vs Report D — choose how the team records it
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "RECONCILE", action: "KEEP" })}
            className="rounded-lg border border-danger/30 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-danger"
          >
            Reset to conflicting
          </button>
        </div>

        <div className="grid gap-3 p-5 lg:grid-cols-[1fr_auto_1fr]">
          {[left, right].map((item, i) => (
            <div key={item.id} className="rounded-[11px] border border-line bg-canvas p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[15px] font-bold text-navy">{item.title}</span>
                <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-danger ring-1 ring-line">
                  {i === 0 ? "REPORT C" : "REPORT D"}
                </span>
              </div>
              <dl className="space-y-1 text-[12px] text-muted">
                <div className="flex justify-between border-b border-line pb-1">
                  <dt className="text-faint">Source</dt>
                  <dd className="font-medium text-navy">{item.source}</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-1">
                  <dt className="text-faint">Timestamp</dt>
                  <dd className="mono font-medium text-navy">{item.timestamp}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-faint">Status</dt>
                  <dd className="font-semibold text-danger">CONFLICTING</dd>
                </div>
              </dl>
            </div>
          ))}

          <div className="flex items-center justify-center lg:px-2">
            <span className="rounded-lg bg-navy px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-widest text-white">
              vs.
            </span>
          </div>

          <div className="lg:col-span-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: "CONFIRM", label: "Mark as confirmed", icon: CheckCircle2, cls: "border-ok bg-ok text-white hover:opacity-90" },
                { k: "UNVERIFY", label: "Mark as unverified", icon: HelpCircle, cls: "border-tech bg-tech text-white hover:opacity-90" },
                { k: "REQUEST", label: "Request more information", icon: MessageCircleQuestion, cls: "border-line bg-white text-navy hover:border-navy" },
                { k: "KEEP", label: "Keep conflict", icon: Ban, cls: "border-line bg-white text-navy hover:border-danger" },
              ].map((b) => (
                <button
                  key={b.k}
                  type="button"
                  onClick={() => dispatch({ type: "RECONCILE", action: b.k as "CONFIRM" | "UNVERIFY" | "REQUEST" | "KEEP" })}
                  className={`flex items-center justify-center gap-2 rounded-[10px] border px-3 py-3 text-[11.5px] font-bold uppercase tracking-wide transition-colors ${b.cls}`}
                >
                  <b.icon size={14} aria-hidden />
                  {b.label}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[11.5px] leading-snug text-faint">
              Each action writes to the shared state, bumps the agreement score and is timestamped in
              the communication timeline — the system tracks the reconstruction process, it does not
              merely display information.
            </p>
          </div>
        </div>
      </section>

      {/* communication */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TeamChat />
        <section className="panel p-4">
          <p className="eyebrow mb-2">Latest reconstruction events</p>
          <p className="mb-3 text-[13px] font-semibold text-navy">
            Activity log · most recent first
          </p>
          {state.activityLog.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-line-strong px-4 py-8 text-center text-[12px] text-faint">
              No reconstruction activity yet. Run the demo or resolve a conflict to begin.
            </div>
          ) : (
            <ul className="space-y-1.5">
              {state.activityLog.map((entry, i) => (
                <li
                  key={`${entry}-${i}`}
                  className="flex items-center gap-2 rounded-[8px] bg-canvas px-3 py-2 text-[12px] text-navy"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-tech" aria-hidden />
                  {entry}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-line pt-3">
            <Link
              to="/decision"
              className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
            >
              Proceed to decision <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </section>
      </div>

      <ReconcileDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
