import { Radio } from "lucide-react";

/**
 * Persistent environment marker so judges always know they are looking at
 * a training simulation, not an operational system.
 */
export function SimBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg border border-flare/35 bg-flare-soft px-2.5 py-1.5"
      title="All entities, coordinates and events in this prototype are fictional."
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flare opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-flare" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-flare-dark">
        Simulation
      </span>
      {!compact && (
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.1em] text-flare-dark/70 sm:inline">
          · Demo environment
        </span>
      )}
      <Radio size={12} className="hidden text-flare-dark/70 sm:block" aria-hidden />
    </div>
  );
}

export default SimBadge;
