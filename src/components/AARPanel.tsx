import { motion } from "framer-motion";
import { CircleDot, ListChecks, TriangleAlert } from "lucide-react";
import type { AARReport, Decision } from "../types";

function SectionHead({ icon: Icon, title, tone }: { icon: typeof ListChecks; title: string; tone: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className={`flex h-7 w-7 items-center justify-center rounded-[8px] ${tone}`}>
        <Icon size={14} aria-hidden />
      </span>
      <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-navy">{title}</h3>
    </div>
  );
}

export default function AARPanel({
  report,
  decision,
  informationTitles,
}: {
  report: AARReport;
  decision: Decision | null;
  informationTitles: Record<string, string>;
}) {
  const max = Math.max(...report.informationRanked.map((r) => r.weight));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="panel p-4">
        <SectionHead icon={TriangleAlert} title="What happened?" tone="bg-tech-soft text-tech" />
        <p className="text-[13px] leading-relaxed text-navy/90">{report.whatHappened}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { l: "Duration", v: report.duration },
            { l: "Participants", v: String(report.participants) },
            { l: "Condition", v: report.commCondition },
            { l: "Convergence", v: report.convergenceTime },
            { l: "Decision latency", v: report.decisionLatency },
          ].map((s) => (
            <span
              key={s.l}
              className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[11px]"
            >
              <span className="block text-[9.5px] font-bold uppercase tracking-wide text-faint">
                {s.l}
              </span>
              <span className="mono font-semibold text-navy">{s.v}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="panel p-4">
        <SectionHead icon={CircleDot} title="Where did convergence fail?" tone="bg-flare-soft text-flare-dark" />
        <p className="text-[13px] leading-relaxed text-navy/90">{report.whereFailed}</p>
        <div className="mt-3 rounded-[9px] border border-line bg-canvas px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
            Bottleneck
          </p>
          <p className="text-[12.5px] font-medium text-navy">
            Report C ↔ Report D reconciliation — 33s of the 42s convergence window
          </p>
        </div>
      </section>

      <section className="panel p-4">
        <SectionHead icon={ListChecks} title="What information mattered?" tone="bg-ok-soft text-ok" />
        <ul className="space-y-3">
          {report.informationRanked.map((r, i) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-2 font-semibold text-navy">
                  <span className="mono text-faint">{String(i + 1).padStart(2, "0")}</span>
                  {informationTitles[r.id] ?? r.label}
                  {r.usedInDecision && (
                    <span className="rounded bg-ok-soft px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-ok">
                      Used in decision
                    </span>
                  )}
                </span>
                <span className="mono font-semibold text-muted">{r.weight}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
                <motion.div
                  className="h-full rounded-full bg-tech"
                  initial={{ width: 0 }}
                  animate={{ width: `${(r.weight / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                />
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="panel p-4">
        <SectionHead icon={ListChecks} title="Decision context" tone="bg-navy text-white" />
        <p className="mb-3 rounded-[9px] border border-flare/30 bg-flare-soft px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-flare-dark">
          Information available at decision time — no hindsight applied
        </p>
        {decision ? (
          <dl className="space-y-2 text-[12.5px]">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-2">
              <dt className="text-muted">Decision</dt>
              <dd className="text-right font-semibold text-navy">
                Option {decision.choice} · {decision.reason}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-line pb-2">
              <dt className="text-muted">Reason</dt>
              <dd className="text-right font-semibold text-navy">{decision.reason}</dd>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-line pb-2">
              <dt className="text-muted">Timestamp</dt>
              <dd className="mono font-semibold text-navy">{decision.timestamp}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">Available information</dt>
              <dd className="mono text-right font-semibold text-navy">
                {decision.availableInformation.confirmed} confirmed ·{" "}
                {decision.availableInformation.conflicting} conflicting ·{" "}
                {decision.availableInformation.unverified} unverified ·{" "}
                {decision.availableInformation.stale} stale
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-[12.5px] text-muted">
            No decision has been submitted for this session yet. Complete the decision step to
            populate the decision context.
          </p>
        )}
      </section>
    </div>
  );
}
