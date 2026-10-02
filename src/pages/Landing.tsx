import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  GitMerge,
  Layers,
  LineChart,
  Radio,
  Share2,
  Signal,
  Users,
} from "lucide-react";
import SimBadge from "../components/SimBadge";
import { useApp } from "../store/AppStore";

const PLAYER_TONES = ["#1769AA", "#4B7FB5", "#2F9E7E", "#7A6FB8"];

function HeroFlow() {
  const steps = ["Player A", "Player B", "Player C", "Player D"];
  return (
    <div className="panel relative overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="eyebrow">Live concept preview</span>
        <SimBadge compact />
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2">
        {steps.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
            className="rounded-[9px] border border-line bg-canvas px-2 py-2.5 text-center"
          >
            <span
              className="mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-[7px] text-[9.5px] font-bold text-white"
              style={{ backgroundColor: PLAYER_TONES[i] }}
            >
              P{String.fromCharCode(65 + i)}
            </span>
            <span className="block text-[10.5px] font-semibold text-navy">{p}</span>
            <span className="mono mt-0.5 block text-[9.5px] text-faint">
              {["3 known", "1 delayed", "1 conflict", "2 stale"][i]}
            </span>
          </motion.div>
        ))}
      </div>

      <FlowNode label="FRAGMENTED INFORMATION" tone="flare" icon={Layers} note="Same scenario, four different states" />
      <FlowArrow />
      <FlowNode label="COMMUNICATION DEGRADATION" tone="flare" icon={Signal} note="Latency 2.5s · packet loss 18%" />
      <FlowArrow />
      <FlowNode label="SHARED-STATE RECONSTRUCTION" tone="tech" icon={Share2} note="Conflicts reconciled, states aligned" />
      <FlowArrow />
      <FlowNode label="DECISION" tone="navy" icon={CheckCircle2} note="Timestamped with available evidence" />
    </div>
  );
}

function FlowNode({
  label,
  tone,
  icon: Icon,
  note,
}: {
  label: string;
  tone: "tech" | "flare" | "navy";
  icon: typeof Layers;
  note: string;
}) {
  const tones = {
    tech: "border-tech/30 bg-tech-soft text-tech",
    flare: "border-flare/35 bg-flare-soft text-flare-dark",
    navy: "border-navy/20 bg-navy text-white",
  };
  return (
    <div className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 ${tones[tone]}`}>
      <Icon size={16} className="shrink-0" aria-hidden />
      <span className="min-w-0">
        <span className="block truncate text-[11.5px] font-bold uppercase tracking-wide">{label}</span>
        <span className={`block truncate text-[11px] ${tone === "navy" ? "text-white/70" : "opacity-80"}`}>
          {note}
        </span>
      </span>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-canvas text-faint">
        <ArrowRight size={12} className="rotate-90" />
      </span>
    </div>
  );
}

const PROBLEM = [
  "Teams rarely receive the same information at the same time.",
  "Under degraded communication, one participant's 'confirmed' is another's 'stale'.",
  "Traditional trainers score the final action — not how understanding was rebuilt.",
];

const APPROACH = [
  "Distribute deliberately different information states to each participant.",
  "Degrade the communication channel with latency, loss and interruption.",
  "Measure how participants reconcile differences into one shared state.",
  "Record the decision against the exact information available at that moment.",
];

const HOW = [
  { n: "01", t: "Scenario created", d: "Instructor selects domain, difficulty and information profile." },
  { n: "02", t: "Information fragmented", d: "Each participant receives a different subset of the same scenario." },
  { n: "03", t: "Communication degrades", d: "Latency, packet loss and interruptions are injected." },
  { n: "04", t: "Divergence measured", d: "Individual states drift apart; agreement drops." },
  { n: "05", t: "Reconciliation", d: "Conflicting reports are confirmed, marked or kept open." },
  { n: "06", t: "Shared state reached", d: "Agreement stabilises; convergence time is recorded." },
  { n: "07", t: "Decision + AAR", d: "Decision, timeline and evidence-linked review are generated." },
];

const TECH = [
  "React + Vite + TypeScript",
  "Tailwind CSS",
  "Recharts analytics",
  "Framer Motion",
  "Lucide icons",
  "Frontend-simulated real-time events",
  "LocalStorage demo persistence",
  "Spring Boot + PostgreSQL ready",
];

export default function Landing() {
  const navigate = useNavigate();
  const { startDemo } = useApp();

  const runDemo = () => {
    startDemo();
    navigate("/training");
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[62px] max-w-[1180px] items-center gap-4 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-navy text-white">
              <Radio size={17} aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-[0.16em] text-navy">RESONATE</span>
              <span className="block text-[9.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                SIH 2026 · SIH26248
              </span>
            </span>
          </div>
          <nav className="ml-auto hidden items-center gap-6 text-[12.5px] font-medium text-muted lg:flex">
            <a href="#problem" className="hover:text-navy">The problem</a>
            <a href="#approach" className="hover:text-navy">The approach</a>
            <a href="#innovation" className="hover:text-navy">Core innovation</a>
            <a href="#how" className="hover:text-navy">How it works</a>
            <a href="#tech" className="hover:text-navy">Technology</a>
          </nav>
          <Link
            to="/login"
            className="rounded-[9px] border border-line px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-muted transition-colors hover:border-navy hover:text-navy"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={runDemo}
            className="rounded-[9px] bg-flare px-3.5 py-2 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
          >
            ▶ Start demo
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="grid-canvas border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <SimBadge />
              <span className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">
                Problem statement SIH26248
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[52px] font-extrabold leading-[1.02] tracking-[-0.02em] text-navy sm:text-[64px]"
            >
              RESONATE
            </motion.h1>
            <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-tech">
              Resilient Shared-State Reconstruction for Degraded Communication Environments
            </p>

            <h2 className="mt-6 max-w-[520px] text-[26px] font-bold leading-[1.25] tracking-tight text-navy sm:text-[30px]">
              Train teams to think together{" "}
              <span className="text-flare">when information no longer arrives together.</span>
            </h2>
            <p className="mt-3 max-w-[520px] text-[14.5px] leading-relaxed text-muted">
              An immersive decision-making trainer for degraded communication environments.
              RESONATE fragments what each participant knows, degrades the channel, and measures how
              quickly the team reconstructs a single shared state before deciding.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={runDemo}
                className="inline-flex items-center gap-2 rounded-[11px] bg-flare px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-flare-dark"
              >
                ▶ Start demo
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-[11px] border border-navy/25 bg-white px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
              >
                Explore platform <ArrowRight size={15} aria-hidden />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-[11.5px] text-faint">
              <span className="font-bold uppercase tracking-[0.14em] text-navy">SIH 2026</span>
              <span className="h-3 w-px bg-line-strong" />
              <span className="font-bold uppercase tracking-[0.14em] text-navy">SIH26248</span>
              <span className="h-3 w-px bg-line-strong" />
              <span>Prototype for training and research only</span>
            </div>
          </div>

          <HeroFlow />
        </div>
      </section>

      {/* problem */}
      <section id="problem" className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow mb-2">The problem</p>
            <h2 className="text-[27px] font-bold leading-tight tracking-tight text-navy">
              Teams fail together long before they fail individually.
            </h2>
          </div>
          <ul className="space-y-3">
            {PROBLEM.map((p, i) => (
              <li key={p} className="panel flex gap-3 p-4">
                <span className="mono text-[13px] font-bold text-flare">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[14px] leading-relaxed text-navy/90">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* approach */}
      <section id="approach" className="border-y border-line bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <p className="eyebrow mb-2">The approach</p>
          <h2 className="mb-7 max-w-[720px] text-[27px] font-bold leading-tight tracking-tight text-navy">
            Make information asymmetry the subject of training — then measure the recovery.
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <div key={a} className="rounded-[12px] border border-line bg-canvas p-4">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-[9px] bg-navy text-[12px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-[13px] leading-relaxed text-navy/90">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* core innovation */}
      <section id="innovation" className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="panel overflow-hidden">
          <div className="border-b border-line bg-navy px-6 py-6">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-flare px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                Our core innovation
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Measurable, not decorative
              </span>
            </div>
            <h2 className="text-[30px] font-extrabold leading-tight tracking-tight text-white sm:text-[36px]">
              SHARED-STATE RECONSTRUCTION
            </h2>
            <p className="mt-3 max-w-[760px] text-[14.5px] leading-relaxed text-white/75">
              “RESONATE deliberately creates distributed information states and measures how teams
              reconcile those differences into a common state before making a decision.”
            </p>
          </div>

          <div className="grid-canvas bg-white px-6 py-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { t: "FRAGMENT", i: Layers, c: "text-flare-dark", bg: "bg-flare-soft border-flare/30" },
                { t: "RECONCILE", i: GitMerge, c: "text-flare-dark", bg: "bg-flare-soft border-flare/30" },
                { t: "CONVERGE", i: LineChart, c: "text-tech", bg: "bg-tech-soft border-tech/30" },
                { t: "DECIDE", i: CheckCircle2, c: "text-tech", bg: "bg-tech-soft border-tech/30" },
                { t: "LEARN", i: BrainCircuit, c: "text-navy", bg: "bg-canvas border-line" },
              ].map((s, i) => (
                <div key={s.t} className="relative">
                  <div className={`flex h-full flex-col items-center gap-2 rounded-[12px] border px-3 py-5 text-center ${s.bg}`}>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] bg-white ${s.c}`}>
                      <s.i size={17} aria-hidden />
                    </span>
                    <span className={`text-[12px] font-extrabold tracking-[0.1em] ${s.c}`}>{s.t}</span>
                    <span className="mono text-[10px] text-faint">step {i + 1}</span>
                  </div>
                  {i < 4 && (
                    <span className="absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white text-faint shadow-sm lg:flex" aria-hidden>
                      <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-[12px] text-faint">
              Fragmentation → reconciliation → convergence → decision → adaptive training.
            </p>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="border-y border-line bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <p className="eyebrow mb-2">How it works</p>
          <h2 className="mb-7 text-[27px] font-bold leading-tight tracking-tight text-navy">
            Seven measurable stages in every session
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h) => (
              <li key={h.n} className="rounded-[12px] border border-line p-4">
                <span className="mono mb-2 block text-[12px] font-bold text-flare">{h.n}</span>
                <p className="mb-1 text-[13.5px] font-semibold text-navy">{h.t}</p>
                <p className="text-[12px] leading-snug text-muted">{h.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[12px] border border-line bg-canvas p-4">
            <Users size={16} className="text-tech" aria-hidden />
            <p className="text-[13px] text-navy">
              The judge journey:{" "}
              <strong>start demo → observe fragmentation → trigger degradation → reconcile → watch convergence → decide → inspect context → read the AAR → see the next training condition.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* technology */}
      <section id="tech" className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow mb-2">Technology</p>
            <h2 className="text-[27px] font-bold leading-tight tracking-tight text-navy">
              Lightweight, backend-optional, ready to integrate.
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              The first prototype runs entirely in the browser with simulated real-time events and
              local persistence. The data model and service boundaries are structured so a Spring
              Boot + PostgreSQL backend can be connected without redesigning the interface.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TECH.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-2.5 text-[12px] font-medium text-navy"
              >
                <CheckCircle2 size={13} className="shrink-0 text-ok" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-navy">
        <div className="mx-auto max-w-[1180px] px-5 py-14 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-flare">RESONATE</p>
          <h2 className="mx-auto mt-3 max-w-[620px] text-[30px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[38px]">
            “From communication failure to measurable team recovery.”
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={runDemo}
              className="rounded-[11px] bg-flare px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
            >
              ▶ Run full demo
            </button>
            <button
              type="button"
              onClick={() => navigate("/reconstruction")}
              className="rounded-[11px] border border-white/30 px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-navy"
            >
              See shared-state reconstruction
            </button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.16em] text-white/50">
            <span className="font-bold">SIH 2026</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="font-bold">SIH26248</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Training &amp; research prototype</span>
          </div>
        </div>
      </section>

      <footer className="bg-navy-soft px-5 py-5 text-center text-[11px] text-white/45">
        RESONATE · Immersive Multi-Domain Decision-Making Trainer for Degraded Communication
        Environments · All entities, coordinates and events shown are fictional.
      </footer>
    </div>
  );
}
