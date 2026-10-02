import { Library, Plus, Rocket } from "lucide-react";
import type { Scenario } from "../types";

const DIFFICULTY_LABEL = ["Foundation", "Basic", "Intermediate", "Advanced", "Expert"];

export default function ScenarioCard({
  scenario,
  selected,
  onSelect,
  onStart,
}: {
  scenario: Scenario;
  selected?: boolean;
  onSelect?: () => void;
  onStart?: () => void;
}) {
  return (
    <article
      className={`panel flex h-full flex-col p-4 transition-shadow ${
        selected ? "ring-1 ring-tech" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Scenario</p>
          <h3 className="text-[15px] font-extrabold tracking-tight text-navy">{scenario.name}</h3>
        </div>
        <span className="rounded-md bg-tech-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-tech">
          {scenario.domain}
        </span>
      </div>

      <p className="mb-3 flex-1 text-[12.5px] leading-relaxed text-muted">{scenario.description}</p>

      <dl className="mb-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-[8px] bg-canvas px-2.5 py-1.5">
          <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Difficulty</dt>
          <dd className="font-semibold text-navy">
            Level {scenario.difficulty} · {DIFFICULTY_LABEL[scenario.difficulty - 1]}
          </dd>
        </div>
        <div className="rounded-[8px] bg-canvas px-2.5 py-1.5">
          <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Events</dt>
          <dd className="font-semibold text-navy">{scenario.events.length} markers</dd>
        </div>
        <div className="rounded-[8px] bg-canvas px-2.5 py-1.5">
          <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Communication</dt>
          <dd className="font-semibold text-navy">{scenario.communicationProfile}</dd>
        </div>
        <div className="rounded-[8px] bg-canvas px-2.5 py-1.5">
          <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Information</dt>
          <dd className="font-semibold text-navy">{scenario.informationProfile}</dd>
        </div>
      </dl>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {scenario.tags.map((t) => (
          <span
            key={t}
            className="rounded-md border border-line px-2 py-0.5 text-[10.5px] font-medium text-muted"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSelect}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-line px-3 py-2 text-[11.5px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-tech hover:text-tech"
        >
          <Library size={13} aria-hidden />
          {selected ? "Selected" : "Select"}
        </button>
        <button
          type="button"
          onClick={onStart}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-navy px-3 py-2 text-[11.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
        >
          <Rocket size={13} aria-hidden />
          Start training
        </button>
      </div>
    </article>
  );
}

export function CreateScenarioCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-line-strong bg-white/50 p-4 text-muted transition-colors hover:border-tech hover:text-tech"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas">
        <Plus size={18} aria-hidden />
      </span>
      <span className="text-[13px] font-bold uppercase tracking-wide">Create new scenario</span>
      <span className="max-w-[200px] text-center text-[11.5px] text-faint">
        Define participants, information conditions, communication profile and difficulty.
      </span>
    </button>
  );
}
