import { Eye, Layers } from "lucide-react";
import type { InformationState, Participant } from "../types";
import InformationCard from "./InformationCard";

export function ParticipantCard({
  participant,
  state,
  onSelectItem,
  highlight = false,
}: {
  participant: Participant;
  state: InformationState;
  onSelectItem?: (informationId: string) => void;
  highlight?: boolean;
}) {
  return (
    <article
      className={`panel flex h-full flex-col p-3.5 transition-shadow ${
        highlight ? "ring-1 ring-flare/50" : ""
      }`}
      aria-label={`${participant.label} information state`}
    >
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[11px] font-bold text-white"
            style={{ backgroundColor: participant.color }}
          >
            {participant.initials}
          </span>
          <div className="leading-tight">
            <p className="text-[12.5px] font-bold tracking-wide text-navy">{participant.label}</p>
            <p className="text-[11px] text-muted">
              {participant.callsign} · {participant.role}
            </p>
          </div>
        </div>
        <span
          className="flex items-center gap-1 rounded-md bg-canvas px-1.5 py-1 text-[10px] font-semibold text-muted"
          title="Share of this participant's state that currently matches the reconciled team state"
        >
          <Layers size={11} aria-hidden />
          {state.agreement}%
        </span>
      </header>

      <div className="mb-2 flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1 font-semibold uppercase tracking-wide text-faint">
          <Eye size={11} aria-hidden /> Local information view
        </span>
        <span className="mono text-faint">updated {state.lastUpdated}</span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {state.views.map((v, i) => (
          <InformationCard
            key={v.informationId}
            view={v}
            index={i}
            compact
            onClick={onSelectItem ? () => onSelectItem(v.informationId) : undefined}
          />
        ))}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${state.agreement}%`, backgroundColor: participant.color }}
        />
      </div>
    </article>
  );
}

export default ParticipantCard;
