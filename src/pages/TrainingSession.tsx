import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  Radio,
  Split,
  Timer,
  TriangleAlert,
  Users,
} from "lucide-react";
import ScenarioMap from "../components/ScenarioMap";
import CommunicationPanel from "../components/CommunicationPanel";
import EventTimeline from "../components/EventTimeline";
import TeamChat from "../components/TeamChat";
import ParticipantCard from "../components/ParticipantCard";
import ReconcileDialog from "../components/ReconcileDialog";
import StatusBadge from "../components/StatusBadge";
import SimBadge from "../components/SimBadge";
import { informationCatalog, informationStates, participants, scenarios } from "../data/demo";
import { currentAgreement, durationLabel, useApp } from "../store/AppStore";
import { InformationCard } from "../components/InformationCard";

function StatusStrip({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Timer;
  tone?: string;
}) {
  return (
    <div className="panel flex items-center gap-3 px-4 py-3">
      <span className={`flex h-8 w-8 items-center justify-center rounded-[9px] ${tone ?? "bg-canvas text-navy"}`}>
        <Icon size={16} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">{label}</p>
        <p className="mono truncate text-[15px] font-bold leading-tight text-navy">{value}</p>
      </div>
    </div>
  );
}

export default function TrainingSessionPage() {
  const { sessionId } = useParams();
  const { state, agreement } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const scenario = scenarios.find((s) => s.id === "signal-horizon") ?? scenarios[0];
  const conflictOpen = state.sharedState.conflicting.length > 0;

  return (
    <div className="mx-auto max-w-[1600px] space-y-4">
      {/* header */}
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <Link
          to="/training"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-navy hover:text-navy"
          aria-label="Back to sessions"
        >
          <ArrowLeft size={15} aria-hidden />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[22px] font-extrabold leading-none tracking-tight text-navy">
              {state.session.operation}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-flare-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-flare-dark">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flare" aria-hidden />
              Live training
            </span>
          </div>
          <p className="mono mt-1 text-[11.5px] text-faint">
            SESSION {(sessionId ?? state.session.id).toUpperCase()} · {scenario.name} · DEMO DATA
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <SimBadge compact />
          <Link
            to="/reconstruction"
            className="inline-flex items-center gap-1.5 rounded-[9px] bg-navy px-3 py-2 text-[11.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
          >
            <Layers size={13} aria-hidden /> Shared state
          </Link>
        </div>
      </div>

      {/* status strip */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatusStrip label="Session time" value={durationLabel(state.session.elapsedSec)} icon={Timer} />
        <StatusStrip
          label="Communication"
          value={state.session.commCondition}
          icon={Radio}
          tone={state.session.commCondition === "NORMAL" ? "bg-ok-soft text-ok" : "bg-flare-soft text-flare-dark"}
        />
        <StatusStrip label="Team" value={`${state.session.participantIds.length} MEMBERS`} icon={Users} />
        <StatusStrip label="Shared state" value={`${agreement}%`} icon={Layers} tone="bg-tech-soft text-tech" />
      </div>

      {/* conflict banner */}
      {conflictOpen && (
        <div className="flex flex-wrap items-center gap-3 rounded-[12px] border border-danger/30 bg-danger-soft px-4 py-3">
          <TriangleAlert size={17} className="text-danger" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-danger">
              Conflict detected
            </p>
            <p className="text-[13px] font-medium text-navy">
              Report C (Observer Alpha · 10:42:13) contradicts Report D (Observer Bravo · 10:42:17)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReconcileOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-[9px] bg-danger px-3.5 py-2 text-[11.5px] font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            <Split size={13} aria-hidden /> Reconcile now
          </button>
        </div>
      )}

      {/* main grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-4">
          <ScenarioMap
            events={scenario.events}
            selectedId={selectedEvent}
            onSelect={setSelectedEvent}
            degraded={state.session.commCondition !== "NORMAL"}
          />
          <CommunicationPanel interactive />
        </div>

        <div className="panel flex flex-col p-4 xl:col-span-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="eyebrow">Information events</p>
              <p className="text-[13.5px] font-semibold text-navy">
                Same scenario <span className="text-danger">≠</span> same information
              </p>
            </div>
            <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
              {informationCatalog.length} items
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {informationCatalog.map((item, i) => {
              const localViews = informationStates
                .flatMap((s) => s.views)
                .filter((v) => v.informationId === item.id);
              return (
                <div key={item.id}>
                  <InformationCard
                    view={{
                      informationId: item.id,
                      participantId: "shared",
                      status: item.status,
                      confidence: item.confidence,
                    }}
                    index={i}
                    onClick={() => setSelectedInfo(selectedInfo === item.id ? null : item.id)}
                  />
                  {selectedInfo === item.id && (
                    <div className="mt-1.5 rounded-[9px] border border-line bg-canvas p-2.5">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-faint">
                        Held by
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {localViews.length === 0 && (
                          <span className="text-[11px] text-faint">Not yet distributed</span>
                        )}
                        {localViews.map((v) => (
                          <span
                            key={v.participantId}
                            className="rounded-md border border-line bg-white px-1.5 py-0.5 text-[10px] font-semibold text-navy"
                          >
                            {v.participantId.toUpperCase()} · {v.status}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1.5 text-[11.5px] leading-snug text-muted">{item.summary}</p>
                      <button
                        type="button"
                        onClick={() => setReconcileOpen(true)}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-muted hover:border-danger hover:text-danger"
                      >
                        <Split size={11} aria-hidden /> Open reconciliation
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-[10px] border border-line bg-canvas p-3">
            <Layers size={14} className="mt-0.5 shrink-0 text-tech" aria-hidden />
            <p className="text-[11.5px] leading-snug text-muted">
              Each participant holds a different subset of these items — the gap between local and
              shared status is what shared-state reconstruction measures.
            </p>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="eyebrow">Team information</p>
            <StatusBadge status="CONFLICTING" size="sm" />
          </div>
          <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
            {informationStates.map((st) => {
              const participant = participants.find((p) => p.id === st.participantId);
              if (!participant) return null;
              return (
                <ParticipantCard
                  key={st.participantId}
                  participant={participant}
                  state={st}
                  onSelectItem={() => setReconcileOpen(true)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="panel p-4 lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="eyebrow">Communication timeline</p>
              <p className="text-[13.5px] font-semibold text-navy">
                Degradation, conflicts and recovery as they happen
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-flare-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-flare-dark">
              <Radio size={11} aria-hidden /> {state.session.commCondition}
            </span>
          </div>
          <EventTimeline events={state.commEvents} />
        </section>

        <div className="lg:col-span-5">
          <TeamChat />
        </div>
      </div>

      <ReconcileDialog open={reconcileOpen} onClose={() => setReconcileOpen(false)} />
    </div>
  );
}
