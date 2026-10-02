import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Filter, LineChart as LineIcon } from "lucide-react";
import { analyticsSessions, conflictResolutionSeries } from "../data/demo";
import SimBadge from "../components/SimBadge";

const AXIS = { fill: "#5D6E80", fontSize: 10.5 };
const TOOLTIP = {
  borderRadius: 10,
  border: "1px solid #E3E9F0",
  fontSize: 12,
  color: "#0B1F33",
} as const;

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h3 className="text-[14px] font-bold tracking-tight text-navy">{title}</h3>
        </div>
        <span className="rounded-md bg-canvas px-2 py-1 text-[9.5px] font-bold uppercase tracking-wide text-muted">
          Demo data
        </span>
      </div>
      <div className="h-[220px] w-full">{children}</div>
    </section>
  );
}

function Select({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-faint">
        {label}
      </span>
      <select
        defaultValue={options[0]}
        className="w-full rounded-[9px] border border-line bg-white px-3 py-2 text-[12.5px] font-medium text-navy outline-none focus:border-tech"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function Analytics() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-tech-soft text-tech">
          <LineIcon size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[21px] font-extrabold tracking-tight text-navy sm:text-[23px]">
              TRAINING ANALYTICS
            </h2>
            <SimBadge compact />
          </div>
          <p className="mt-0.5 text-[13px] text-muted">
            Convergence, agreement, latency, conflict resolution and recovery across sessions
          </p>
        </div>
      </div>

      {/* filters */}
      <section className="panel p-4" aria-label="Analytics filters">
        <div className="mb-3 flex items-center gap-2">
          <Filter size={14} className="text-tech" aria-hidden />
          <p className="eyebrow">Filters</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Select label="Session" options={["All sessions", ...analyticsSessions.map((s) => s.session)]} />
          <Select label="Team" options={["All teams", "Team Alfa", "Team Bravo", "Team Charlie"]} />
          <Select label="Scenario" options={["All scenarios", "SIGNAL HORIZON", "ECHO TRACE", "NEXUS RECOVERY"]} />
          <Select label="Difficulty" options={["All levels", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"]} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Convergence time by session" subtitle="Lower is faster recovery">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsSessions} margin={{ top: 6, right: 8, left: -20, bottom: 2 }}>
              <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="session" tick={AXIS} axisLine={{ stroke: "#E3E9F0" }} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} unit="s" />
              <Tooltip cursor={{ fill: "rgba(23,105,170,0.06)" }} contentStyle={TOOLTIP} />
              <Bar dataKey="convergence" name="Convergence (s)" fill="#1769AA" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="State agreement by session" subtitle="Higher is stronger shared state">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsSessions} margin={{ top: 6, right: 8, left: -20, bottom: 2 }}>
              <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="session" tick={AXIS} axisLine={{ stroke: "#E3E9F0" }} tickLine={false} />
              <YAxis domain={[50, 100]} tick={AXIS} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={TOOLTIP} />
              <Line
                type="monotone"
                dataKey="agreement"
                name="Agreement (%)"
                stroke="#1F8A55"
                strokeWidth={2.4}
                dot={{ r: 3, fill: "#1F8A55", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Decision latency" subtitle="Time from shared state to decision">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsSessions} margin={{ top: 6, right: 8, left: -20, bottom: 2 }}>
              <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="session" tick={AXIS} axisLine={{ stroke: "#E3E9F0" }} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} unit="s" />
              <Tooltip cursor={{ fill: "rgba(242,140,40,0.08)" }} contentStyle={TOOLTIP} />
              <Bar dataKey="decision" name="Decision latency (s)" fill="#F28C28" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Conflict resolution" subtitle="Automated vs trainee-closed conflicts">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conflictResolutionSeries} margin={{ top: 6, right: 8, left: -20, bottom: 2 }}>
              <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="phase" tick={AXIS} axisLine={{ stroke: "#E3E9F0" }} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(11,31,51,0.05)" }} contentStyle={TOOLTIP} />
              <Bar dataKey="automated" name="System-flagged" stackId="a" fill="#1769AA" radius={[0, 0, 0, 0]} maxBarSize={40} />
              <Bar dataKey="manual" name="Trainee-resolved" stackId="a" fill="#F28C28" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Information coverage" subtitle="Items reaching two or more participants">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsSessions} margin={{ top: 6, right: 8, left: -20, bottom: 2 }}>
              <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="session" tick={AXIS} axisLine={{ stroke: "#E3E9F0" }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={AXIS} axisLine={false} tickLine={false} unit="%" />
              <Tooltip cursor={{ fill: "rgba(31,138,85,0.07)" }} contentStyle={TOOLTIP} />
              <Bar dataKey="coverage" name="Coverage (%)" fill="#2F9E7E" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Communication recovery" subtitle="Seconds to restore exchange after interruption">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsSessions} margin={{ top: 6, right: 8, left: -20, bottom: 2 }}>
              <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="session" tick={AXIS} axisLine={{ stroke: "#E3E9F0" }} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} unit="s" />
              <Tooltip contentStyle={TOOLTIP} />
              <Line
                type="monotone"
                dataKey="recovery"
                name="Recovery (s)"
                stroke="#C8442E"
                strokeWidth={2.4}
                dot={{ r: 3, fill: "#C8442E", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <p className="text-[11px] leading-snug text-faint">
        All analytics shown are synthetic demonstration data generated for the RESONATE prototype.
        They do not represent measured performance of any real team, unit or system.
      </p>
    </div>
  );
}
