import { motion } from "framer-motion";
import { informationById } from "../data/demo";
import type { LocalInfoView } from "../types";
import StatusBadge from "./StatusBadge";

export function InformationCard({
  view,
  index = 0,
  compact = false,
  onClick,
}: {
  view: LocalInfoView;
  index?: number;
  compact?: boolean;
  onClick?: () => void;
}) {
  const item = informationById(view.informationId);
  const baseClass = `block w-full rounded-[10px] border border-line bg-white p-2.5 text-left transition-colors ${
    onClick ? "cursor-pointer hover:border-tech hover:bg-tech-soft/40" : ""
  }`;

  const body = (
    <>
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="text-[12.5px] font-bold text-navy">{item.title}</span>
        <StatusBadge status={view.status} size="sm" />
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10.5px] text-muted">
        <div className="flex gap-1">
          <dt className="text-faint">Source:</dt>
          <dd className="truncate font-medium">{item.source}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-faint">Received:</dt>
          <dd className="mono">{item.timestamp}</dd>
        </div>
      </dl>
      {!compact && (
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className="font-semibold uppercase tracking-wide text-faint">Confidence</span>
            <span className="mono font-semibold text-navy">{view.confidence}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-tech transition-[width] duration-500"
              style={{ width: `${view.confidence}%` }}
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.24) }}
    >
      {onClick ? (
        <button type="button" onClick={onClick} className={baseClass} aria-label={`${item.title} details`}>
          {body}
        </button>
      ) : (
        <div className={baseClass}>{body}</div>
      )}
    </motion.div>
  );
}

export default InformationCard;
