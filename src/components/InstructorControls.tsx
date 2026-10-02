import {
  AlertTriangle,
  Ban,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Split,
  Timer,
  UserRound,
} from "lucide-react";
import type { CommProfile, DomainLabel, InfoProfile } from "../types";
import { participants } from "../data/demo";
import { useApp, clockAt } from "../store/AppStore";

const DOMAINS: DomainLabel[] = ["Land", "Air", "Cyber", "EW"];
const DIFFICULTIES: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];
const COMM_PROFILES: CommProfile[] = ["Normal", "Delayed", "Loss", "Interrupted", "Conflicting"];
const INFO_PROFILES: InfoProfile[] = ["Complete", "Partial", "Delayed", "Conflicting", "Stale"];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel p-4">
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </section>
  );
}

function Pill({
  active,
  children,
  onClick,
  tone = "tech",
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  tone?: "tech" | "flare";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors ${
        active
          ? tone === "flare"
            ? "border-flare bg-flare text-white"
            : "border-navy bg-navy text-white"
          : "border-line bg-white text-muted hover:border-navy hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

export default function InstructorControls() {
  const { state, dispatch } = useApp();
  const cfg = state.instructor;
  const ts = () => clockAt(state.session.elapsedSec);

  const trigger = (kind: "delay" | "conflict" | "remove" | "restore" | "generate") => {
    const id = `ce-manual-${Date.now().toString(36)}`;
    if (kind === "delay") {
      dispatch({ type: "SET_COMM", condition: "DEGRADED" });
      dispatch({
        type: "PUSH_EVENT",
        event: { id, timestamp: ts(), type: "LATENCY", description: "Instructor injected delay", severity: "warn" },
      });
    } else if (kind === "conflict") {
      dispatch({
        type: "PUSH_EVENT",
        event: {
          id,
          timestamp: ts(),
          type: "CONFLICT",
          description: "Instructor created a conflicting report pair",
          severity: "danger",
        },
      });
      dispatch({ type: "LOG", entry: "Instructor created conflict" });
    } else if (kind === "remove") {
      dispatch({
        type: "PUSH_EVENT",
        event: { id, timestamp: ts(), type: "LOSS", description: "Information item removed from distribution", severity: "warn" },
      });
      dispatch({ type: "LOG", entry: "Information removed" });
    } else if (kind === "restore") {
      dispatch({ type: "SET_COMM", condition: "NORMAL" });
      dispatch({
        type: "PUSH_EVENT",
        event: { id, timestamp: ts(), type: "RECOVERY", description: "Communication restored", severity: "ok" },
      });
    } else {
      dispatch({
        type: "PUSH_EVENT",
        event: { id, timestamp: ts(), type: "INFO", description: "New scenario event generated on the grid", severity: "info" },
      });
      dispatch({ type: "LOG", entry: "Scenario event generated" });
    }
  };

  const status = state.session.status;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <Group title="Session control">
        <div className="mb-3 rounded-[10px] border border-line bg-canvas p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-navy">{state.session.operation}</span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                status === "LIVE"
                  ? "bg-ok-soft text-ok"
                  : status === "PAUSED"
                    ? "bg-flare-soft text-flare-dark"
                    : "bg-canvas text-dim ring-1 ring-line"
              }`}
            >
              {status}
            </span>
          </div>
          <p className="mono mt-1 text-[11px] text-faint">Session {state.session.id}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_SESSION_STATUS", status: "LIVE" })}
            className="flex items-center justify-center gap-1.5 rounded-[9px] bg-ok px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            <Play size={13} aria-hidden /> Start
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_SESSION_STATUS", status: "PAUSED" })}
            className="flex items-center justify-center gap-1.5 rounded-[9px] border border-line px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-navy"
          >
            <Pause size={13} aria-hidden /> Pause
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_SESSION_STATUS", status: "LIVE" })}
            className="flex items-center justify-center gap-1.5 rounded-[9px] border border-line px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-navy"
          >
            <Timer size={13} aria-hidden /> Resume
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "RESET_ALL" })}
            className="flex items-center justify-center gap-1.5 rounded-[9px] border border-danger/40 bg-danger-soft px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-wide text-danger transition-colors hover:bg-danger hover:text-white"
          >
            <RotateCcw size={13} aria-hidden /> Reset
          </button>
        </div>
      </Group>

      <Group title="Scenario configuration">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-faint">Domain</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {DOMAINS.map((d) => (
            <Pill key={d} active={cfg.domain === d} onClick={() => dispatch({ type: "SET_INSTRUCTOR", patch: { domain: d } })}>
              {d}
            </Pill>
          ))}
        </div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-faint">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <Pill key={d} active={cfg.difficulty === d} tone="flare" onClick={() => dispatch({ type: "SET_INSTRUCTOR", patch: { difficulty: d } })}>
              Level {d}
            </Pill>
          ))}
        </div>
        <p className="mt-3 border-t border-line pt-3 text-[11px] leading-snug text-faint">
          Domain and difficulty describe training content categories only — they do not map to real
          assets, forces or geography.
        </p>
      </Group>

      <Group title="Communication profile">
        <div className="flex flex-wrap gap-2">
          {COMM_PROFILES.map((p) => (
            <Pill
              key={p}
              active={cfg.communicationProfile === p}
              onClick={() => dispatch({ type: "SET_INSTRUCTOR", patch: { communicationProfile: p } })}
            >
              {p}
            </Pill>
          ))}
        </div>
        <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-faint">
          Information profile
        </p>
        <div className="flex flex-wrap gap-2">
          {INFO_PROFILES.map((p) => (
            <Pill
              key={p}
              active={cfg.informationProfile === p}
              onClick={() => dispatch({ type: "SET_INSTRUCTOR", patch: { informationProfile: p } })}
            >
              {p}
            </Pill>
          ))}
        </div>
        <p className="mt-3 border-t border-line pt-3 text-[11px] leading-snug text-faint">
          Current channel condition: <strong className="text-navy">{state.session.commCondition}</strong>
        </p>
      </Group>

      <Group title="Participants">
        <ul className="space-y-2">
          {participants.map((p) => {
            const active = cfg.activeParticipantIds.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "SET_INSTRUCTOR",
                      patch: {
                        activeParticipantIds: active
                          ? cfg.activeParticipantIds.filter((x) => x !== p.id)
                          : [...cfg.activeParticipantIds, p.id],
                      },
                    })
                  }
                  className="flex w-full items-center gap-2.5 rounded-[9px] border border-line bg-white px-3 py-2 text-left transition-colors hover:border-navy"
                  aria-pressed={active}
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[10px] font-bold text-white"
                    style={{ backgroundColor: active ? p.color : "#7D8B9B" }}
                  >
                    {p.initials}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[12.5px] font-semibold text-navy">{p.label}</span>
                    <span className="block text-[11px] text-muted">
                      {p.callsign} · {p.role}
                    </span>
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold uppercase ${
                      active ? "text-ok" : "text-faint"
                    }`}
                  >
                    <UserRound size={12} aria-hidden />
                    {active ? "Attached" : "Removed"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Trigger event">
        <p className="mb-3 text-[11.5px] leading-snug text-muted">
          Simulation controls only. These inject information-environment changes into the training
          session — they do not model or recommend real-world actions.
        </p>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => trigger("delay")}
            className="flex items-center gap-2 rounded-[9px] border border-line bg-white px-3 py-2.5 text-[12px] font-semibold text-navy transition-colors hover:border-flare hover:bg-flare-soft"
          >
            <Timer size={14} className="text-flare" aria-hidden /> Inject delay
          </button>
          <button
            type="button"
            onClick={() => trigger("conflict")}
            className="flex items-center gap-2 rounded-[9px] border border-line bg-white px-3 py-2.5 text-[12px] font-semibold text-navy transition-colors hover:border-danger hover:bg-danger-soft"
          >
            <Split size={14} className="text-danger" aria-hidden /> Create conflict
          </button>
          <button
            type="button"
            onClick={() => trigger("remove")}
            className="flex items-center gap-2 rounded-[9px] border border-line bg-white px-3 py-2.5 text-[12px] font-semibold text-navy transition-colors hover:border-danger hover:bg-danger-soft"
          >
            <Ban size={14} className="text-danger" aria-hidden /> Remove information
          </button>
          <button
            type="button"
            onClick={() => trigger("restore")}
            className="flex items-center gap-2 rounded-[9px] border border-line bg-white px-3 py-2.5 text-[12px] font-semibold text-navy transition-colors hover:border-ok hover:bg-ok-soft"
          >
            <Radio size={14} className="text-ok" aria-hidden /> Restore communication
          </button>
          <button
            type="button"
            onClick={() => trigger("generate")}
            className="flex items-center gap-2 rounded-[9px] border border-line bg-white px-3 py-2.5 text-[12px] font-semibold text-navy transition-colors hover:border-tech hover:bg-tech-soft"
          >
            <Plus size={14} className="text-tech" aria-hidden /> Generate event
          </button>
        </div>
        <p className="mt-3 flex items-start gap-1.5 border-t border-line pt-3 text-[10.5px] leading-snug text-faint">
          <AlertTriangle size={12} className="mt-px shrink-0" aria-hidden />
          All injected events are logged to the session timeline for after-action review.
        </p>
      </Group>
    </div>
  );
}
