import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  ArrowDownUp,
  Info,
  MessageSquare,
  RefreshCcw,
  Split,
  Timer,
} from "lucide-react";
import type { CommunicationEvent } from "../types";

const ICONS: Record<CommunicationEvent["type"], typeof Info> = {
  LATENCY: Timer,
  LOSS: ArrowDownUp,
  CONFLICT: Split,
  RECOVERY: RefreshCcw,
  INTERRUPT: AlertOctagon,
  INFO: Info,
  MESSAGE: MessageSquare,
  DECISION: RefreshCcw,
};

const TONES: Record<CommunicationEvent["severity"], string> = {
  info: "border-tech/25 bg-tech-soft text-tech",
  warn: "border-flare/30 bg-flare-soft text-flare-dark",
  danger: "border-danger/25 bg-danger-soft text-danger",
  ok: "border-ok/25 bg-ok-soft text-ok",
};

export default function EventTimeline({
  events,
  dense = false,
  emptyText = "No communication events recorded yet.",
}: {
  events: CommunicationEvent[];
  dense?: boolean;
  emptyText?: string;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-line-strong px-4 py-6 text-center text-[12px] text-faint">
        {emptyText}
      </div>
    );
  }

  return (
    <ol className="space-y-1.5">
      <AnimatePresence initial={false}>
        {events
          .slice()
          .reverse()
          .map((e) => {
            const Icon = ICONS[e.type];
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22 }}
                className={`flex items-start gap-2.5 rounded-[9px] border px-2.5 ${
                  dense ? "py-1.5" : "py-2"
                } ${TONES[e.severity]}`}
              >
                <span className="mono shrink-0 pt-px text-[10.5px] font-semibold opacity-80">
                  {e.timestamp}
                </span>
                <Icon size={13} className="mt-0.5 shrink-0" aria-hidden />
                <span className="flex-1 text-[11.5px] font-medium leading-snug">{e.description}</span>
              </motion.li>
            );
          })}
      </AnimatePresence>
    </ol>
  );
}
