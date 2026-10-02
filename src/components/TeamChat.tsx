import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { participants } from "../data/demo";
import { clockAt, useApp } from "../store/AppStore";

const SUGGESTIONS = [
  "I have confirmation from Report A.",
  "My sensor update is delayed.",
  "Report B conflicts with my information.",
  "Can we reconcile Report C and Report D?",
];

export default function TeamChat() {
  const { state, dispatch } = useApp();
  const [draft, setDraft] = useState("");
  const [asId, setAsId] = useState("a");

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({
      type: "PUSH_MESSAGE",
      message: {
        id: `m-${Date.now().toString(36)}`,
        participantId: asId,
        text: trimmed,
        timestamp: clockAt(state.session.elapsedSec),
      },
    });
    dispatch({
      type: "PUSH_EVENT",
      event: {
        id: `ce-msg-${Date.now().toString(36)}`,
        timestamp: clockAt(state.session.elapsedSec),
        type: "MESSAGE",
        description: `${participants.find((p) => p.id === asId)?.label ?? "Player"} sent a reconciliation message`,
        participantId: asId,
        severity: "info",
      },
    });
    setDraft("");
  };

  return (
    <section className="panel flex h-full flex-col p-4" aria-label="Team communication">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p className="eyebrow">Team communication</p>
          <p className="text-[13px] font-semibold text-navy">Reconciliation channel</p>
        </div>
        <span className="rounded-md bg-canvas px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-faint">
          {state.messages.length} messages
        </span>
      </header>

      <div className="mb-3 min-h-[150px] flex-1 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {state.messages.length === 0 && (
            <p className="rounded-[9px] border border-dashed border-line-strong px-3 py-5 text-center text-[11.5px] text-faint">
              No messages yet. Send one to open the reconciliation channel.
            </p>
          )}
          {state.messages.map((m) => {
            const p = participants.find((x) => x.id === m.participantId);
            if (!p) return null;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] text-[9px] font-bold text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.initials}
                </span>
                <div className="min-w-0 flex-1 rounded-[9px] border border-line bg-canvas px-2.5 py-1.5">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-[11.5px] font-bold text-navy">{p.label}</span>
                    <span className="mono text-[10px] text-faint">{m.timestamp}</span>
                  </div>
                  <p className="text-[12px] leading-snug text-muted">{m.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-line bg-white px-2.5 py-1 text-[10.5px] text-muted transition-colors hover:border-tech hover:text-tech"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="flex items-center gap-2"
      >
        <label className="sr-only" htmlFor="chat-as">
          Send as
        </label>
        <select
          id="chat-as"
          value={asId}
          onChange={(e) => setAsId(e.target.value)}
          className="rounded-[9px] border border-line bg-white px-2 py-2 text-[11.5px] font-semibold text-navy outline-none"
        >
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>
        <input
          id="chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message about information reconciliation…"
          className="min-w-0 flex-1 rounded-[9px] border border-line bg-white px-3 py-2 text-[12.5px] text-navy outline-none placeholder:text-faint focus:border-tech"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-navy text-white transition-colors hover:bg-tech"
        >
          <Send size={15} aria-hidden />
        </button>
      </form>
      <p className="mt-2 text-[10.5px] leading-snug text-faint">
        Messages are restricted to information reconciliation and training coordination.
      </p>
    </section>
  );
}
