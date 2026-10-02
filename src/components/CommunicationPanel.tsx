import { Activity, SignalLow, Waves, Zap } from "lucide-react";
import { commEnvironment } from "../data/demo";
import type { CommCondition } from "../types";
import { useApp } from "../store/AppStore";

const LEVELS: { key: CommCondition; tone: string; bar: string }[] = [
  { key: "NORMAL", tone: "bg-ok-soft text-ok", bar: "bg-ok" },
  { key: "DEGRADED", tone: "bg-flare-soft text-flare-dark", bar: "bg-flare" },
  { key: "SEVERELY DEGRADED", tone: "bg-danger-soft text-danger", bar: "bg-danger" },
];

export default function CommunicationPanel({ interactive = false }: { interactive?: boolean }) {
  const { state, dispatch } = useApp();
  const current = state.session.commCondition;
  const isDegraded = current !== "NORMAL";

  const conditions = [
    { label: "Latency", value: isDegraded ? commEnvironment.latency : "0.2s" },
    { label: "Packet loss", value: isDegraded ? commEnvironment.packetLoss : "0%" },
    { label: "Message delay", value: isDegraded ? commEnvironment.messageDelay : "Idle" },
    {
      label: "Information conflict",
      value: isDegraded ? commEnvironment.informationConflict : "None",
    },
  ];

  return (
    <section className="panel p-4" aria-label="Communication environment">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p className="eyebrow">Communication environment</p>
          <p className="text-[13px] font-semibold text-navy">Simulated channel conditions</p>
        </div>
        <Waves size={16} className={isDegraded ? "text-flare" : "text-ok"} aria-hidden />
      </header>

      <div className="mb-3 space-y-1.5">
        {LEVELS.map((l) => {
          const active = l.key === current;
          return (
            <button
              key={l.key}
              type="button"
              disabled={!interactive}
              onClick={() => dispatch({ type: "SET_COMM", condition: l.key })}
              className={`flex w-full items-center gap-2.5 rounded-[9px] border px-2.5 py-1.5 text-left transition-colors ${
                active
                  ? `${l.tone} border-current`
                  : interactive
                    ? "border-line text-faint hover:border-line-strong hover:text-muted"
                    : "border-transparent text-faint opacity-55"
              } ${interactive ? "" : "cursor-default"}`}
              aria-pressed={active}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${active ? l.bar : "bg-line-strong"}`} />
              <span className="text-[11.5px] font-bold uppercase tracking-wide">{l.key}</span>
              {active && <span className="ml-auto text-[10px] font-semibold uppercase">Current</span>}
            </button>
          );
        })}
      </div>

      <dl className="grid grid-cols-2 gap-2">
        {conditions.map((c) => (
          <div key={c.label} className="rounded-[9px] bg-canvas px-2.5 py-2">
            <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">{c.label}</dt>
            <dd
              className={`mono text-[13px] font-semibold ${
                c.value === "Idle" || c.value === "None" || c.value === "0%" || c.value === "0.2s"
                  ? "text-navy"
                  : "text-flare-dark"
              }`}
            >
              {c.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-snug text-faint">
        <Activity size={12} className="mt-px shrink-0" aria-hidden />
        Fictional simulation parameters. These values are generated for training, not measured from
        any real system.
      </p>

      {interactive && (
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[11px] text-muted">
          <SignalLow size={13} aria-hidden />
          Instructors may override the channel state for the live session.
          <Zap size={12} className="ml-auto text-flare" aria-hidden />
        </div>
      )}
    </section>
  );
}
