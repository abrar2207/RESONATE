import { useState } from "react";
import { AlertCircle, CheckCircle2, Hand, Send } from "lucide-react";
import { decisionOptions, decisionReasons } from "../data/demo";
import type { DecisionChoice, DecisionReason, SharedState } from "../types";
import { useApp } from "../store/AppStore";

function CountChip({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-line bg-canvas px-2.5 py-1.5">
      <span className={`mono text-[15px] font-bold ${tone}`}>{String(value).padStart(2, "0")}</span>
      <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}

export default function DecisionPanel({
  sharedState,
  locked = false,
}: {
  sharedState: SharedState;
  locked?: boolean;
}) {
  const { state, dispatch } = useApp();
  const [touched, setTouched] = useState(false);

  const choice = state.decisionChoice;
  const reason = state.decisionReason;
  const submitted = Boolean(state.decision);
  const canSubmit = Boolean(choice && reason) && !submitted;

  const submit = () => {
    if (!canSubmit) {
      setTouched(true);
      return;
    }
    dispatch({ type: "SUBMIT_DECISION" });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="panel p-5">
        <div className="mb-4 flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-tech-soft text-tech">
            <AlertCircle size={17} aria-hidden />
          </span>
          <div>
            <p className="eyebrow">Simulated training decision</p>
            <h3 className="text-[15.5px] font-bold leading-snug text-navy">
              Which information state should the team use as the basis for the next simulated
              training action?
            </h3>
            <p className="mt-1 text-[12px] text-muted">
              This is a training judgement about information handling. It is not a real-world
              military or operational recommendation.
            </p>
          </div>
        </div>

        <fieldset className="mb-5" disabled={submitted || locked}>
          <legend className="eyebrow mb-2">Select decision</legend>
          <div className="grid gap-2">
            {decisionOptions.map((o) => {
              const selected = choice === o.id;
              return (
                <label
                  key={o.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-[10px] border p-3 transition-colors ${
                    selected
                      ? "border-tech bg-tech-soft/60"
                      : "border-line bg-white hover:border-line-strong hover:bg-canvas/60"
                  } ${submitted || locked ? "cursor-default opacity-70" : ""}`}
                >
                  <input
                    type="radio"
                    name="decision-choice"
                    className="sr-only"
                    checked={selected}
                    onChange={() => dispatch({ type: "SET_DECISION_CHOICE", choice: o.id as DecisionChoice })}
                  />
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border text-[12px] font-bold ${
                      selected ? "border-tech bg-tech text-white" : "border-line-strong text-muted"
                    }`}
                    aria-hidden
                  >
                    {o.id}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-navy">{o.label}</span>
                    <span className="block text-[11.5px] text-muted">{o.detail}</span>
                  </span>
                  {selected && (
                    <CheckCircle2 size={16} className="ml-auto shrink-0 text-tech" aria-hidden />
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mb-5" disabled={submitted || locked}>
          <legend className="eyebrow mb-2">Select reason</legend>
          <div className="flex flex-wrap gap-2">
            {decisionReasons.map((r) => {
              const selected = reason === r;
              return (
                <label
                  key={r}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors ${
                    selected
                      ? "border-navy bg-navy text-white"
                      : "border-line bg-white text-muted hover:border-navy hover:text-navy"
                  } ${submitted || locked ? "cursor-default opacity-70" : ""}`}
                >
                  <input
                    type="radio"
                    name="decision-reason"
                    className="sr-only"
                    checked={selected}
                    onChange={() => dispatch({ type: "SET_DECISION_REASON", reason: r as DecisionReason })}
                  />
                  {r}
                </label>
              );
            })}
          </div>
        </fieldset>

        {touched && !choice && !submitted && (
          <p className="mb-3 flex items-center gap-1.5 text-[12px] font-medium text-danger">
            <AlertCircle size={13} aria-hidden /> Select a decision and a reason before submitting.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={submit}
            disabled={submitted || locked}
            className="inline-flex items-center gap-2 rounded-[10px] bg-flare px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark disabled:cursor-not-allowed disabled:bg-line-strong"
          >
            <Send size={14} aria-hidden />
            {submitted ? "Decision submitted" : "Submit decision"}
          </button>
          {submitted ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ok">
              <CheckCircle2 size={14} aria-hidden /> Stored with reason, timestamp and available
              information.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11.5px] text-faint">
              <Hand size={13} aria-hidden /> Both a decision and a reason are required.
            </span>
          )}
        </div>
      </section>

      <aside className="panel h-fit p-4">
        <p className="eyebrow mb-3">Current shared state</p>
        <div className="grid grid-cols-2 gap-2">
          <CountChip label="Confirmed" value={sharedState.confirmed.length} tone="text-ok" />
          <CountChip label="Conflicting" value={sharedState.conflicting.length} tone="text-danger" />
          <CountChip label="Unverified" value={sharedState.unverified.length} tone="text-tech" />
          <CountChip label="Stale" value={sharedState.stale.length} tone="text-dim" />
        </div>
        <p className="mt-3 border-t border-line pt-3 text-[11px] leading-snug text-faint">
          The submitted decision stores this exact snapshot so the after-action review never uses
          hindsight.
        </p>
        {state.decision && (
          <div className="mt-3 rounded-[10px] bg-ok-soft p-3">
            <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-ok">
              Stored decision
            </p>
            <p className="text-[12.5px] font-semibold text-navy">
              Option {state.decision.choice} · {state.decision.reason}
            </p>
            <p className="mono text-[11px] text-muted">at {state.decision.timestamp}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
