import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Play, Radio, Users } from "lucide-react";
import { recentSessions } from "../data/demo";
import { durationLabel, useApp } from "../store/AppStore";
import SimBadge from "../components/SimBadge";

const STATUS_TONE: Record<string, string> = {
  LIVE: "bg-flare-soft text-flare-dark",
  COMPLETE: "bg-ok-soft text-ok",
  ARCHIVED: "bg-canvas text-dim ring-1 ring-line",
};

export default function TrainingSessions() {
  const { state, startDemo } = useApp();
  const navigate = useNavigate();

  const enterDemo = () => {
    startDemo();
    navigate("/training");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Training sessions</p>
          <h2 className="text-[24px] font-bold tracking-tight text-navy">Session roster</h2>
          <p className="text-[13px] text-muted">
            Open a session to enter the live training environment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SimBadge compact />
          <button
            type="button"
            onClick={enterDemo}
            className="inline-flex items-center gap-2 rounded-[10px] bg-flare px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
          >
            ▶ Run full demo
          </button>
        </div>
      </div>

      {/* active session */}
      <section className="panel flex flex-wrap items-center gap-5 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-flare-soft text-flare-dark">
          <Radio size={20} aria-hidden />
        </span>
        <div className="min-w-[220px] flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[17px] font-extrabold tracking-tight text-navy">
              {state.session.operation}
            </span>
            <span className="rounded-md bg-flare-soft px-2 py-0.5 text-[10px] font-bold uppercase text-flare-dark">
              {state.session.status}
            </span>
          </div>
          <p className="text-[12.5px] text-muted">
            {state.session.scenarioName} · {state.session.participantIds.length} participants ·{" "}
            {state.session.commCondition} · elapsed {durationLabel(state.session.elapsedSec)}
          </p>
        </div>
        <Link
          to={`/training/${state.session.id}`}
          className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
        >
          Enter session <ArrowRight size={15} aria-hidden />
        </Link>
      </section>

      {/* table */}
      <section className="panel overflow-hidden">
        <div className="border-b border-line px-5 py-3.5">
          <h3 className="eyebrow">All sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/60">
                {["Session", "Scenario", "Participants", "Convergence", "Decision", "Status", ""].map((h) => (
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
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                      <Users size={13} aria-hidden /> {s.participants}
                    </span>
                  </td>
                  <td className="mono px-5 py-3 text-[12.5px] font-semibold text-navy">{s.convergence}</td>
                  <td className="px-5 py-3 text-[12.5px] text-muted">{s.decision}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_TONE[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/training/${s.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted transition-colors hover:border-tech hover:text-tech"
                    >
                      <Play size={12} aria-hidden /> Open
                    </Link>
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
