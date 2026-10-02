import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Pause, Play, RotateCcw, SkipForward, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { demoSteps, useApp } from "../store/AppStore";

/** Reusable vertical/linear step indicator. */
export function ProgressStepper({
  steps,
  current,
  onJump,
  compact = false,
}: {
  steps: string[];
  current: number;
  onJump?: (index: number) => void;
  compact?: boolean;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {steps.map((s, i) => {
        const done = i < current - 1;
        const active = i === current - 1;
        return (
          <li key={s} className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onJump ? () => onJump(i + 1) : undefined}
              disabled={!onJump}
              className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10.5px] font-semibold transition-colors ${
                active
                  ? "border-flare bg-flare text-white"
                  : done
                    ? "border-ok/30 bg-ok-soft text-ok"
                    : "border-line bg-white text-faint"
              } ${onJump ? "hover:border-tech" : "cursor-default"}`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check size={11} aria-hidden /> : <span className="mono">{i + 1}</span>}
              {!compact && <span className="hidden max-w-[150px] truncate sm:inline">{s}</span>}
            </button>
            {i < steps.length - 1 && <ChevronRight size={11} className="text-line-strong" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

export default function DemoController() {
  const { state, dispatch, startDemo } = useApp();
  const navigate = useNavigate();
  const { running, paused, step } = state.demo;

  /* advance */
  useEffect(() => {
    if (!running || paused || step < 1 || step > demoSteps.length) return;
    const id = window.setTimeout(() => {
      const next = step + 1;
      if (next > demoSteps.length) {
        dispatch({ type: "SET_DEMO", patch: { running: false, paused: false, step: demoSteps.length } });
      } else {
        dispatch({ type: "DEMO_STEP", step: next });
        dispatch({ type: "SET_DEMO", patch: { step: next } });
      }
    }, demoSteps[step - 1].duration);
    return () => window.clearTimeout(id);
  }, [running, paused, step, dispatch]);

  /* follow the narrative */
  useEffect(() => {
    if (!running || step < 1) return;
    const target = demoSteps[step - 1]?.route;
    if (target) navigate(target);
  }, [running, step, navigate]);

  const skip = () => {
    const next = step + 1;
    if (next > demoSteps.length) {
      dispatch({ type: "SET_DEMO", patch: { running: false, paused: false, step: demoSteps.length } });
      return;
    }
    dispatch({ type: "DEMO_STEP", step: next });
    dispatch({ type: "SET_DEMO", patch: { step: next } });
  };

  const restart = () => {
    startDemo();
  };

  const close = () => dispatch({ type: "SET_DEMO", patch: { running: false, paused: false, step: 0 } });

  const active = running && step >= 1 && step <= demoSteps.length;
  const current = active ? demoSteps[step - 1] : null;
  const pct = active ? Math.round((step / demoSteps.length) * 100) : 0;

  return (
    <AnimatePresence>
      {active && current && (
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_18px_44px_-16px_rgba(11,31,51,0.4)]"
          role="region"
          aria-label="Demo playback controller"
        >
          <div className="flex items-center gap-2 bg-navy px-3.5 py-2.5">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flare opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-flare" />
            </span>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white">
              Demo mode
            </span>
            <span className="mono ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-bold text-white">
              {step} / {demoSteps.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close demo"
              className="text-white/60 transition-colors hover:text-white"
            >
              <X size={15} aria-hidden />
            </button>
          </div>

          <div className="h-1 w-full bg-canvas">
            <motion.div
              className="h-full bg-flare"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="px-3.5 py-3">
            <p className="mb-0.5 text-[13.5px] font-bold leading-snug text-navy">{current.title}</p>
            <p className="mb-3 text-[11.5px] leading-snug text-muted">{current.caption}</p>

            <div className="mb-3 flex flex-wrap gap-1">
              {demoSteps.map((s, i) => (
                <span
                  key={s.title}
                  title={s.title}
                  className={`h-1.5 w-5 rounded-full transition-colors ${
                    i + 1 < step ? "bg-ok" : i + 1 === step ? "bg-flare" : "bg-line"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_DEMO", patch: { paused: !paused } })}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-line px-2.5 py-2 text-[11.5px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-tech hover:text-tech"
              >
                {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={skip}
                className="inline-flex items-center justify-center gap-1.5 rounded-[9px] border border-line px-2.5 py-2 text-[11.5px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-tech hover:text-tech"
              >
                <SkipForward size={13} aria-hidden />
                Skip
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center gap-1.5 rounded-[9px] bg-flare px-3 py-2 text-[11.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
              >
                <RotateCcw size={13} aria-hidden />
                Restart
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
