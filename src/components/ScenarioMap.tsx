import { motion, AnimatePresence } from "framer-motion";
import { RadioTower, X } from "lucide-react";
import type { ScenarioEvent } from "../types";
import { participants } from "../data/demo";
import StatusBadge from "./StatusBadge";

const W = 400;
const H = 280;

const TERRAIN = [
  "M18,54 C60,26 104,44 138,34 C176,22 206,44 196,72 C186,100 140,104 100,98 C58,92 8,84 18,54 Z",
  "M226,168 C258,140 314,138 348,158 C384,178 386,220 356,238 C322,258 264,252 236,228 C210,206 202,188 226,168 Z",
  "M64,196 C88,178 130,182 148,200 C166,218 156,246 128,252 C98,258 60,248 52,228 C46,212 50,206 64,196 Z",
];

const PARTICIPANT_POS: Record<string, { x: number; y: number }> = {
  a: { x: 74, y: 66 },
  b: { x: 254, y: 60 },
  c: { x: 150, y: 214 },
  d: { x: 322, y: 206 },
};

export default function ScenarioMap({
  events,
  selectedId,
  onSelect,
  degraded,
}: {
  events: ScenarioEvent[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  degraded?: boolean;
}) {
  const selected = events.find((e) => e.id === selectedId);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="eyebrow">Scenario environment</p>
          <p className="text-[13px] font-semibold text-navy">Abstract operational grid</p>
        </div>
        <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
          Fictional · Non-geo
        </span>
      </div>

      <div className="relative bg-[#FBFCFE]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-[300px] w-full"
          role="img"
          aria-label="Abstract fictional scenario map with four event markers"
        >
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 L0 0 0 20" fill="none" stroke="#0B1F33" strokeOpacity="0.06" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="#FBFCFE" />
          <rect width={W} height={H} fill="url(#grid)" />

          {TERRAIN.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={i === 1 ? "#1769AA" : "#0B1F33"}
              fillOpacity="0.045"
              stroke="#0B1F33"
              strokeOpacity="0.12"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}

          {/* communication links */}
          {events.map((e) => (
            <line
              key={`l-${e.id}`}
              x1={W / 2}
              y1={H / 2}
              x2={(e.x / 100) * W}
              y2={(e.y / 100) * H}
              stroke={degraded ? "#F28C28" : "#1769AA"}
              strokeOpacity={degraded ? 0.45 : 0.3}
              strokeWidth="1.2"
              strokeDasharray={degraded ? "5 4" : "0"}
            />
          ))}

          {/* relay nodes */}
          <g opacity="0.75">
            <circle cx="200" cy="140" r="16" fill="#FFFFFF" stroke="#1769AA" strokeWidth="1.4" />
            <circle cx="200" cy="140" r="5" fill="#1769AA" />
            <text x="200" y="167" textAnchor="middle" fontSize="8.5" fill="#5D6E80" fontWeight="600">
              RELAY CORE
            </text>
          </g>

          {/* participants */}
          {participants.map((p) => {
            const pos = PARTICIPANT_POS[p.id];
            if (!pos) return null;
            return (
              <g key={p.id} transform={`translate(${pos.x} ${pos.y})`}>
                <rect x="-11" y="-9" width="22" height="18" rx="5" fill="#FFFFFF" stroke={p.color} strokeWidth="1.3" />
                <text x="0" y="3.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={p.color}>
                  {p.initials}
                </text>
              </g>
            );
          })}

          {/* events */}
          {events.map((e) => {
            const cx = (e.x / 100) * W;
            const cy = (e.y / 100) * H;
            const isSel = e.id === selectedId;
            const conflict = e.status === "CONFLICTING";
            const stroke = conflict ? "#C8442E" : e.status === "STALE" ? "#7D8B9B" : "#1F8A55";
            return (
              <g
                key={e.id}
                transform={`translate(${cx} ${cy})`}
                onClick={() => onSelect?.(isSel ? null : e.id)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                aria-label={`${e.code} ${e.name} status ${e.status}`}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") onSelect?.(isSel ? null : e.id);
                }}
              >
                {isSel && <circle r="17" fill={stroke} fillOpacity="0.12" />}
                <circle r="10" fill="#FFFFFF" stroke={stroke} strokeWidth="2" />
                <circle r="4" fill={stroke} />
                <text y="24" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#0B1F33">
                  {e.code}
                </text>
                <text y="34" textAnchor="middle" fontSize="7.5" fill="#5D6E80">
                  {e.name}
                </text>
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-3 top-3 w-[236px] rounded-[10px] border border-line bg-white p-3 shadow-lg"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div>
                  <p className="eyebrow">{selected.code}</p>
                  <p className="text-[13px] font-bold text-navy">{selected.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect?.(null)}
                  aria-label="Close event card"
                  className="text-faint hover:text-navy"
                >
                  <X size={14} aria-hidden />
                </button>
              </div>
              <div className="mb-2">
                <StatusBadge status={selected.status} size="sm" />
              </div>
              <p className="text-[11.5px] leading-snug text-muted">{selected.note}</p>
              <div className="mt-2 flex items-center gap-1.5 text-faint">
                <RadioTower size={11} aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Training entity
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-2.5 text-[10.5px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ok" /> Confirmed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-danger" /> Conflicting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-dim" /> Stale
        </span>
        <span className="ml-auto hidden sm:inline">Click a marker for details</span>
      </div>
    </div>
  );
}
