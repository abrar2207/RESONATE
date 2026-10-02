import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, ArrowRight, Combine } from "lucide-react";
import ParticipantCard from "../components/ParticipantCard";
import ReconcileDialog from "../components/ReconcileDialog";
import SimBadge from "../components/SimBadge";
import { informationById, informationStates, participants } from "../data/demo";

const ROWS = ["report-a", "report-b", "report-c", "report-d", "sensor-x", "sensor-y"];

export default function Team() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-tech-soft text-tech">
          <Combine size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[21px] font-extrabold tracking-tight text-navy sm:text-[23px]">
              SAME SCENARIO <span className="text-danger">≠</span> SAME INFORMATION
            </h2>
            <SimBadge compact />
          </div>
          <p className="mt-0.5 text-[13px] text-muted">
            Four participants, one fictional scenario, four deliberately different information
            states.
          </p>
        </div>
        <Link
          to="/reconstruction"
          className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
        >
          Reconstruct shared state <ArrowRight size={14} aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {informationStates.map((st, i) => {
          const participant = participants[i];
          return (
            <ParticipantCard
              key={st.participantId}
              participant={participant}
              state={st}
              onSelectItem={() => setOpen(true)}
            />
          );
        })}
      </div>

      {/* comparison matrix */}
      <section className="panel overflow-hidden" aria-label="Information coverage matrix">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
          <div>
            <p className="eyebrow">Coverage matrix</p>
            <p className="text-[13.5px] font-semibold text-navy">
              Who holds what — and how each participant currently rates it
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
            <ArrowLeftRight size={11} aria-hidden /> Local vs shared
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/60">
                <th className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-faint">
                  Information
                </th>
                {participants.map((p) => (
                  <th key={p.id} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-faint">
                    {p.label}
                  </th>
                ))}
                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-faint">
                  Shared status
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((id) => {
                const item = informationById(id);
                return (
                  <tr key={id} className="border-b border-line last:border-0 hover:bg-canvas/50">
                    <td className="px-5 py-2.5">
                      <span className="block text-[12.5px] font-semibold text-navy">{item.title}</span>
                      <span className="block text-[11px] text-faint">{item.source}</span>
                    </td>
                    {participants.map((p) => {
                      const st = informationStates.find((s) => s.participantId === p.id);
                      const view = st?.views.find((v) => v.informationId === id);
                      if (!view) {
                        return (
                          <td key={p.id} className="px-4 py-2.5">
                            <span className="rounded bg-dim/10 px-1.5 py-0.5 text-[10px] font-bold text-dim">
                              NOT HELD
                            </span>
                          </td>
                        );
                      }
                      const tone =
                        view.status === "CONFIRMED"
                          ? "bg-ok-soft text-ok"
                          : view.status === "CONFLICTING"
                            ? "bg-danger-soft text-danger"
                            : view.status === "DELAYED"
                              ? "bg-flare-soft text-flare-dark"
                              : view.status === "STALE"
                                ? "bg-dim/12 text-dim"
                                : "bg-tech-soft text-tech";
                      return (
                        <td key={p.id} className="px-4 py-2.5">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${tone}`}>
                            {view.status}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          item.status === "CONFIRMED"
                            ? "bg-ok-soft text-ok"
                            : item.status === "CONFLICTING"
                              ? "bg-danger-soft text-danger"
                              : item.status === "DELAYED"
                                ? "bg-flare-soft text-flare-dark"
                                : item.status === "STALE"
                                  ? "bg-dim/12 text-dim"
                                  : "bg-tech-soft text-tech"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-line px-5 py-3 text-[11.5px] text-faint">
          Cells marked <strong className="text-dim">NOT HELD</strong> show information that never
          reached that participant — the primary driver of divergence under degraded communication.
        </div>
      </section>

      <ReconcileDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
