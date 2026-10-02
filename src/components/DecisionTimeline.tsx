import { motion } from "framer-motion";
import type { TimelineEntry } from "../types";

export default function DecisionTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-line-strong px-4 py-8 text-center">
        <p className="text-[13px] font-semibold text-navy">No decision timeline yet</p>
        <p className="mt-1 text-[12px] text-muted">
          Submit a team decision to generate a timestamped timeline for the after-action review.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative">
      <span className="absolute left-[78px] top-2 bottom-2 w-px bg-line" aria-hidden />
      {entries.map((e, i) => (
        <motion.li
          key={e.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.4) }}
          className="relative flex items-start gap-4 py-2"
        >
          <span className="mono w-[62px] shrink-0 pt-0.5 text-right text-[11.5px] font-semibold text-faint">
            {e.timestamp}
          </span>
          <span
            className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 ${
              i === entries.length - 1 ? "border-flare bg-flare" : "border-tech bg-white"
            }`}
            aria-hidden
          />
          <span className="flex-1">
            <span
              className={`block text-[13px] font-semibold ${
                i === entries.length - 1 ? "text-navy" : "text-navy/90"
              }`}
            >
              {e.label}
            </span>
            {e.note && <span className="block text-[11.5px] text-muted">{e.note}</span>}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
