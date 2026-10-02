import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={text}
        className="text-faint transition-colors hover:text-tech"
      >
        <Info size={13} aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-56 -translate-x-1/2 rounded-lg bg-navy px-3 py-2 text-[11.5px] font-normal leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "tech",
  delta,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: LucideIcon;
  accent?: "tech" | "flare" | "ok" | "danger" | "navy";
  delta?: string;
}) {
  const accents: Record<string, string> = {
    tech: "bg-tech-soft text-tech",
    flare: "bg-flare-soft text-flare-dark",
    ok: "bg-ok-soft text-ok",
    danger: "bg-danger-soft text-danger",
    navy: "bg-canvas text-navy",
  };
  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="eyebrow leading-relaxed">{label}</span>
        {hint && <InfoTip text={hint} />}
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="mono text-[26px] font-semibold leading-none tracking-tight text-navy">
          {value}
        </span>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${accents[accent]}`}>
          <Icon size={16} aria-hidden />
        </span>
      </div>
      {delta && <span className="text-[11px] font-medium text-muted">{delta}</span>}
    </div>
  );
}

export default MetricCard;
