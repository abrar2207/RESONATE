import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { convergenceSeries } from "../data/demo";
import type { ConvergenceMetric } from "../types";

const LINES = [
  { key: "a", name: "Player A", color: "#1769AA" },
  { key: "b", name: "Player B", color: "#4B7FB5" },
  { key: "c", name: "Player C", color: "#2F9E7E" },
  { key: "d", name: "Player D", color: "#7A6FB8" },
  { key: "avg", name: "Team mean", color: "#0B1F33" },
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-[9px] border border-line bg-white px-3 py-2 shadow-lg">
      <p className="mono mb-1 text-[10.5px] font-bold text-faint">T+{label}s</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-[11.5px] text-navy">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="font-medium">{p.name}</span>
          <span className="mono ml-auto font-semibold">{p.value}%</span>
        </p>
      ))}
    </div>
  );
}

export default function ConvergenceChart({
  revealCount,
  reached,
  boost = 0,
}: {
  revealCount: number;
  reached: boolean;
  boost?: number;
}) {
  const count = Math.min(Math.max(revealCount, 1), convergenceSeries.length);
  const data: ConvergenceMetric[] = convergenceSeries.slice(0, count).map((d, i) =>
    i === 0 && boost
      ? d
      : {
          ...d,
          a: Math.min(99, d.a + boost),
          b: Math.min(99, d.b + boost),
          c: Math.min(99, d.c + boost),
          d: Math.min(99, d.d + boost),
          avg: Math.min(99, d.avg + boost),
        },
  );
  const last = data[data.length - 1];

  return (
    <section className="panel p-4" aria-label="Team state convergence chart">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Convergence visualisation</p>
          <h3 className="text-[15px] font-bold tracking-tight text-navy">TEAM STATE CONVERGENCE</h3>
          <p className="text-[12px] text-muted">
            State agreement of each participant over time · how quickly can the team reconstruct a
            common understanding?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-line bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
            Demo data
          </span>
          <span className="mono rounded-md bg-tech-soft px-2 py-1 text-[11px] font-bold text-tech">
            {last.avg}% now
          </span>
        </div>
      </header>

      <div className="relative h-[290px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 54, bottom: 6, left: -14 }}>
            <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#5D6E80", fontSize: 11 }}
              axisLine={{ stroke: "#E3E9F0" }}
              tickLine={false}
              label={{ value: "Time (seconds)", position: "insideBottom", offset: -4, fill: "#8B98A7", fontSize: 10.5 }}
            />
            <YAxis
              domain={[30, 90]}
              ticks={[40, 50, 60, 70, 80]}
              tick={{ fill: "#5D6E80", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{ value: "State agreement %", angle: -90, position: "insideLeft", fill: "#8B98A7", fontSize: 10.5 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 11.5, color: "#5D6E80", paddingTop: 6 }}
            />
            <ReferenceLine
              x={42}
              stroke="#F28C28"
              strokeDasharray="4 4"
              label={
                reached
                  ? { value: " 42s · SHARED STATE REACHED", position: "top", fill: "#C96F14", fontSize: 10.5, fontWeight: 700 }
                  : undefined
              }
            />
            {LINES.map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={l.key === "avg" ? 2.6 : 1.8}
                strokeDasharray={l.key === "avg" ? "6 4" : undefined}
                dot={{ r: 2.4, strokeWidth: 0, fill: l.color }}
                activeDot={{ r: 4.5 }}
                isAnimationActive
                animationDuration={450}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <AnimatePresence>
          {reached && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-2 flex items-center gap-2 rounded-lg border border-flare/40 bg-flare-soft px-2.5 py-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-flare" aria-hidden />
              <span className="text-[10.5px] font-bold uppercase tracking-wide text-flare-dark">
                Shared state reached
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2 text-[10.5px] leading-snug text-faint">
        Synthetic demonstration series generated for this prototype — not a measurement of real-team
        or real-world performance.
      </p>
    </section>
  );
}
