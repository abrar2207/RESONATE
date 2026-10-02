import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Ban, CheckCircle2, HelpCircle, MessageCircleQuestion, X } from "lucide-react";
import type { ReconcileAction } from "../types";
import { informationById } from "../data/demo";
import { useApp } from "../store/AppStore";

const ACTIONS: Array<{
  key: ReconcileAction;
  label: string;
  icon: typeof CheckCircle2;
  tone: string;
  hint: string;
}> = [
  { key: "CONFIRM", label: "Mark as confirmed", icon: CheckCircle2, tone: "border-ok bg-ok text-white hover:opacity-90", hint: "Both accounts are accepted as one reconciled fact." },
  { key: "UNVERIFY", label: "Mark as unverified", icon: HelpCircle, tone: "border-tech bg-tech text-white hover:opacity-90", hint: "Conflict closed but the item stays flagged as unverified." },
  { key: "REQUEST", label: "Request more information", icon: MessageCircleQuestion, tone: "border-line bg-white text-navy hover:border-navy", hint: "Asks for another verification cycle before closing." },
  { key: "KEEP", label: "Keep conflict", icon: Ban, tone: "border-line bg-white text-navy hover:border-danger", hint: "Conflict stays open and is carried into the decision." },
];

export default function ReconcileDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = useApp();
  const left = informationById("report-c");
  const right = informationById("report-d");

  const act = (a: ReconcileAction) => {
    dispatch({ type: "RECONCILE", action: a });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/45 px-4 py-6 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Conflict reconciliation"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full w-full max-w-[560px] overflow-y-auto rounded-[14px] border border-line bg-white shadow-2xl"
          >
            <header className="flex items-start gap-3 border-b border-line bg-danger-soft px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-danger">
                <AlertTriangle size={18} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-danger">
                  Conflict detected
                </p>
                <h2 className="text-[17px] font-bold text-navy">Reconcile information</h2>
                <p className="text-[12px] text-muted">
                  Two sources describe the same entity differently. Choose how the shared state
                  should record it.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="text-danger/70 transition-colors hover:text-danger"
              >
                <X size={18} aria-hidden />
              </button>
            </header>

            <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
              {[left, right].map((item, i) => (
                <div key={item.id} className="rounded-[11px] border border-line bg-canvas p-3.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[14px] font-bold text-navy">{item.title}</span>
                    <span className="rounded bg-danger-soft px-1.5 py-0.5 text-[9.5px] font-bold text-danger">
                      {i === 0 ? "REPORT C" : "REPORT D"}
                    </span>
                  </div>
                  <dl className="space-y-1 text-[11.5px] text-muted">
                    <div className="flex justify-between gap-2">
                      <dt className="text-faint">Source:</dt>
                      <dd className="font-medium text-navy">{item.source}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-faint">Timestamp:</dt>
                      <dd className="mono font-medium text-navy">{item.timestamp}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-faint">Confidence:</dt>
                      <dd className="mono font-medium text-navy">{item.confidence}%</dd>
                    </div>
                  </dl>
                  <p className="mt-2 border-t border-line pt-2 text-[11.5px] leading-snug text-muted">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-5 pb-2 text-center">
              <span className="rounded-md bg-danger-soft px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-danger">
                Status: conflicting
              </span>
            </div>

            <div className="grid gap-2 px-5 pb-4 pt-3 sm:grid-cols-2">
              {ACTIONS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => act(a.key)}
                  className={`flex items-start gap-2 rounded-[10px] border px-3 py-2.5 text-left transition-colors ${a.tone}`}
                >
                  <a.icon size={15} className="mt-0.5 shrink-0" aria-hidden />
                  <span>
                    <span className="block text-[12.5px] font-bold uppercase tracking-wide">
                      {a.label}
                    </span>
                    <span className={`block text-[11px] leading-snug ${a.key === "CONFIRM" || a.key === "UNVERIFY" ? "opacity-85" : "text-muted"}`}>
                      {a.hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <p className="border-t border-line px-5 py-3 text-[11px] leading-snug text-faint">
              The reconciliation is written into the shared state and timestamped so the
              after-action review can show exactly when the conflict was closed.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
