import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, CircleHelp, MinusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SharedState } from "../types";

interface Column {
  key: keyof SharedState;
  title: string;
  icon: LucideIcon;
  tone: string;
  dot: string;
  hint: string;
}

const COLUMNS: Column[] = [
  {
    key: "confirmed",
    title: "CONFIRMED",
    icon: CheckCircle2,
    tone: "text-ok",
    dot: "bg-ok",
    hint: "Corroborated by two or more participants.",
  },
  {
    key: "conflicting",
    title: "CONFLICTING",
    icon: AlertTriangle,
    tone: "text-danger",
    dot: "bg-danger",
    hint: "Sources still disagree — needs reconciliation.",
  },
  {
    key: "stale",
    title: "STALE",
    icon: MinusCircle,
    tone: "text-dim",
    dot: "bg-dim",
    hint: "Older than the freshness window.",
  },
  {
    key: "unverified",
    title: "UNVERIFIED",
    icon: CircleHelp,
    tone: "text-tech",
    dot: "bg-tech",
    hint: "Held but not yet corroborated.",
  },
];

export default function SharedStatePanel({
  sharedState,
  onConflictClick,
}: {
  sharedState: SharedState;
  onConflictClick?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col, i) => {
        const items = sharedState[col.key];
        const isEmpty = items.length === 0;
        return (
          <motion.section
            key={col.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="panel flex flex-col p-3.5"
            aria-label={`${col.title} shared state`}
          >
            <header className="mb-3 flex items-center justify-between">
              <span className={`flex items-center gap-1.5 ${col.tone}`}>
                <col.icon size={14} aria-hidden />
                <span className="text-[11px] font-bold uppercase tracking-[0.1em]">{col.title}</span>
              </span>
              <span className="mono rounded-md bg-canvas px-1.5 py-0.5 text-[12px] font-bold text-navy">
                {String(items.length).padStart(2, "0")}
              </span>
            </header>

            <ul className="flex flex-1 flex-col gap-1.5">
              {isEmpty && (
                <li className="rounded-[8px] border border-dashed border-line-strong px-2 py-3 text-center text-[11px] text-faint">
                  None
                </li>
              )}
              {items.map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={col.key === "conflicting" ? onConflictClick : undefined}
                    className={`flex w-full items-center gap-2 rounded-[8px] border border-line bg-canvas/70 px-2 py-1.5 text-left text-[11.5px] font-medium text-navy transition-colors ${
                      col.key === "conflicting" && onConflictClick
                        ? "hover:border-danger hover:bg-danger-soft"
                        : "cursor-default"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${col.dot}`} />
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-2.5 border-t border-line pt-2 text-[10px] leading-snug text-faint">
              {col.hint}
            </p>
          </motion.section>
        );
      })}
    </div>
  );
}
