import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Clock4,
  Gauge,
  Layers,
  Radio,
  Rocket,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AARPanel from "../components/AARPanel";
import AIAnalysisCard from "../components/AIAnalysisCard";
import SimBadge from "../components/SimBadge";
import { aarReport, informationCatalog, nextCondition } from "../data/demo";
import { useApp } from "../store/AppStore";

function SummaryCell({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Clock4;
}) {
  return (
    <div className="rounded-[11px] border border-line bg-white px-3.5 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-faint">
        <Icon size={13} aria-hidden />
        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em]">{label}</span>
      </div>
      <p className="mono text-[18px] font-bold leading-none text-navy">{value}</p>
    </div>
  );
}

export default function AAR() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  const titles: Record<string, string> = {};
  informationCatalog.forEach((i) => {
    titles[i.id] = i.title;
  });

  const startNext = () => {
    dispatch({
      type: "SET_INSTRUCTOR",
      patch: { difficulty: nextCondition.nextLevel as 1 | 2 | 3 | 4 | 5, informationProfile: "Conflicting" },
    });
    dispatch({ type: "LOG", entry: `Adaptive condition applied → level ${nextCondition.nextLevel}` });
    dispatch({ type: "SET_NEXT_READY", value: true });
    setStarted(true);
    window.setTimeout(() => navigate("/training"), 1100);
  };

  const summary = [
    { label: "Duration", value: aarReport.duration, icon: Clock4 },
    { label: "Participants", value: String(aarReport.participants), icon: Users },
    { label: "Communication condition", value: aarReport.commCondition, icon: Radio },
    { label: "Convergence time", value: aarReport.convergenceTime, icon: Gauge },
    { label: "Decision latency", value: aarReport.decisionLatency, icon: Layers },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      {/* header */}
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ok-soft text-ok">
          <BookOpenCheck size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[21px] font-extrabold tracking-tight text-navy sm:text-[23px]">
              AFTER-ACTION REVIEW
            </h2>
            <SimBadge compact />
          </div>
          <p className="mt-0.5 text-[13px] text-muted">
            Evidence-linked analysis of the training session
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-ok-soft px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wide text-ok">
          <CheckCircle2 size={12} aria-hidden /> Analysis complete
        </span>
      </div>

      {/* session summary */}
      <section className="panel p-5" aria-label="Session summary">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="eyebrow">Session summary</p>
            <p className="text-[13.5px] font-semibold text-navy">
              {state.session.operation} · {state.session.id}
            </p>
          </div>
          <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
            Demo data
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {summary.map((s) => (
            <SummaryCell key={s.label} label={s.label} value={s.value} icon={s.icon} />
          ))}
        </div>
      </section>

      {/* sections */}
      <AARPanel report={aarReport} decision={state.decision} informationTitles={titles} />

      {/* team behaviour */}
      <section className="panel p-5" aria-label="Team behaviour">
        <div className="mb-4">
          <p className="eyebrow">Team behaviour</p>
          <h3 className="text-[15px] font-bold tracking-tight text-navy">
            HOW THE TEAM WORKED, NOT JUST WHAT IT DECIDED
          </h3>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={aarReport.behaviour} outerRadius="72%">
                <PolarGrid stroke="#E3E9F0" />
                <PolarAngleAxis dataKey="label" tick={{ fill: "#5D6E80", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#8B98A7", fontSize: 10 }} />
                <Radar
                  name="Behaviour"
                  dataKey="value"
                  stroke="#1769AA"
                  fill="#1769AA"
                  fillOpacity={0.22}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E3E9F0",
                    fontSize: 12,
                    color: "#0B1F33",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aarReport.behaviour} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid stroke="#E3E9F0" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#5D6E80", fontSize: 10.5 }} axisLine={{ stroke: "#E3E9F0" }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#5D6E80", fontSize: 10.5 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(23,105,170,0.06)" }}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E3E9F0",
                    fontSize: 12,
                    color: "#0B1F33",
                  }}
                />
                <Bar dataKey="value" fill="#1769AA" radius={[6, 6, 0, 0]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="mt-2 text-[10.5px] text-faint">
          Behaviour scores are computed from synthetic session telemetry for demonstration.
        </p>
      </section>

      {/* AI analyst */}
      <AIAnalysisCard
        ready={state.aarReady || !state.demo.running}
        summary="During the session, the team reached a shared state after 42 seconds. Two information conflicts remained unresolved at the decision point, and one stale item was carried forward without refresh."
        recommendation="Increase information inconsistency while keeping the scenario structure unchanged."
      />

      {/* adaptive training */}
      <section className="panel overflow-hidden" aria-label="Adaptive training">
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-navy px-5 py-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-flare text-white">
            <BrainCircuit size={16} aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              Adaptive training
            </p>
            <p className="text-[11.5px] text-white/60">
              The system adapts the information environment — not enemy difficulty
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/instructor")}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-navy"
          >
            Instructor controls
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr_auto]">
          <div>
            <p className="eyebrow mb-2">Next training condition</p>
            <div className="flex items-center gap-3">
              <div className="rounded-[10px] bg-canvas px-3.5 py-2.5 text-center">
                <p className="text-[9.5px] font-bold uppercase tracking-wide text-faint">Current level</p>
                <p className="mono text-[24px] font-bold leading-none text-navy">
                  {nextCondition.currentLevel}
                </p>
              </div>
              <ArrowRight size={18} className="text-faint" aria-hidden />
              <div className="rounded-[10px] bg-flare-soft px-3.5 py-2.5 text-center ring-1 ring-flare/30">
                <p className="text-[9.5px] font-bold uppercase tracking-wide text-flare-dark/70">Next level</p>
                <p className="mono text-[24px] font-bold leading-none text-flare-dark">
                  {nextCondition.nextLevel}
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-[10px] border border-line bg-canvas px-3 py-2.5">
              <p className="text-[9.5px] font-bold uppercase tracking-wide text-faint">
                Current weakness
              </p>
              <p className="text-[13.5px] font-semibold text-navy">{nextCondition.weakness}</p>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">Next scenario adjustment</p>
            <ul className="space-y-2">
              {nextCondition.adjustments.map((a) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2.5 rounded-[10px] border border-line bg-white px-3 py-2.5 text-[13px] font-medium text-navy"
                >
                  <span className="mono flex h-5 w-5 items-center justify-center rounded bg-tech-soft text-[12px] font-bold text-tech">
                    +
                  </span>
                  {a}
                </motion.li>
              ))}
            </ul>
            <p className="mt-2.5 text-[11.5px] leading-snug text-faint">
              Difficulty is expressed through information conditions — inconsistency, message
              reliability and staleness — rather than a stronger simulated opponent.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <button
              type="button"
              onClick={startNext}
              disabled={started}
              className="inline-flex items-center justify-center gap-2 rounded-[11px] bg-flare px-5 py-3.5 text-[12.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark disabled:opacity-70"
            >
              <Rocket size={15} aria-hidden />
              {started ? "Starting…" : "Start next training"}
            </button>
            {started && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-[9px] bg-ok-soft px-3 py-2 text-center text-[11.5px] font-medium text-ok"
              >
                Level 3 condition applied — loading SIGNAL HORIZON…
              </motion.p>
            )}
            <Link
              to="/scenarios"
              className="inline-flex items-center justify-center gap-2 rounded-[11px] border border-line px-5 py-3 text-[12px] font-bold uppercase tracking-wide text-muted transition-colors hover:border-navy hover:text-navy"
            >
              Review scenario library
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
