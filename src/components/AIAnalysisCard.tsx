import { motion } from "framer-motion";
import { AlertTriangle, Brain, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { aiInsights } from "../data/demo";

const ICONS = {
  pattern: TrendingUp,
  strength: CheckCircle2,
  risk: AlertTriangle,
} as const;

const TONES = {
  pattern: "bg-tech-soft text-tech",
  strength: "bg-ok-soft text-ok",
  risk: "bg-flare-soft text-flare-dark",
} as const;

export default function AIAnalysisCard({
  summary,
  recommendation,
  ready = true,
}: {
  summary: string;
  recommendation: string;
  ready?: boolean;
}) {
  return (
    <section className="panel overflow-hidden" aria-label="AI training analyst">
      <header className="flex flex-wrap items-center gap-3 border-b border-line bg-navy px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white/10 text-white">
          <Brain size={16} aria-hidden />
        </span>
        <div>
          <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-white">
            AI Training Analyst
          </p>
          <p className="text-[11px] text-white/60">AI-assisted training analytics · evidence-linked</p>
        </div>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            ready ? "bg-ok/20 text-ok" : "bg-flare/20 text-flare"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          {ready ? "Analysis complete" : "Analysing"}
        </span>
      </header>

      <div className="p-4">
        <p className="mb-4 border-l-2 border-flare pl-3 text-[13.5px] leading-relaxed text-navy">
          {summary}
        </p>

        <p className="eyebrow mb-2.5">Observed patterns</p>
        <ul className="mb-4 space-y-2">
          {aiInsights.map((ins, i) => {
            const Icon = ICONS[ins.category];
            return (
              <motion.li
                key={ins.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.07 }}
                className="flex gap-3 rounded-[10px] border border-line bg-canvas/60 p-3"
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${TONES[ins.category]}`}>
                  <Icon size={14} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-navy">
                    {i + 1}. {ins.title}
                  </span>
                  <span className="block text-[11.5px] leading-snug text-muted">{ins.body}</span>
                </span>
              </motion.li>
            );
          })}
        </ul>

        <div className="rounded-[10px] border border-flare/30 bg-flare-soft p-3.5">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-flare-dark">
            <Sparkles size={13} aria-hidden /> Next training recommendation
          </p>
          <p className="text-[13.5px] font-medium leading-relaxed text-navy">“{recommendation}”</p>
          <p className="mt-2 text-[10.5px] leading-snug text-flare-dark/80">
            Training-design recommendation only. RESONATE does not generate combat, targeting or
            operational advice.
          </p>
        </div>
      </div>
    </section>
  );
}
