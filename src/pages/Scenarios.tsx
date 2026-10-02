import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Library, Rocket, Save, X } from "lucide-react";
import ScenarioCard, { CreateScenarioCard } from "../components/ScenarioCard";
import ScenarioMap from "../components/ScenarioMap";
import SimBadge from "../components/SimBadge";
import type { CommProfile, DomainLabel, InfoProfile, Scenario, ScenarioEvent } from "../types";
import { useApp } from "../store/AppStore";

const DOMAINS: DomainLabel[] = ["Land", "Air", "Cyber", "EW"];
const INFO_PROFILES: InfoProfile[] = ["Complete", "Partial", "Delayed", "Conflicting", "Stale"];
const COMM_PROFILES: CommProfile[] = ["Normal", "Delayed", "Loss", "Interrupted", "Conflicting"];

const BLANK_FORM = {
  name: "",
  description: "",
  participants: 4,
  domain: "Cyber" as DomainLabel,
  informationConditions: "Conflicting" as InfoProfile,
  communicationProfile: "Delayed" as CommProfile,
  difficulty: 2 as 1 | 2 | 3 | 4 | 5,
  events: 4,
};

const baseEvents: ScenarioEvent[] = [
  { id: "e1", code: "EVENT A", name: "Sector Alpha", kind: "EVENT", status: "CONFIRMED", x: 26, y: 32, note: "Primary reference marker for this scenario." },
  { id: "e2", code: "EVENT B", name: "Node Bravo", kind: "EVENT", status: "CONFIRMED", x: 64, y: 26, note: "Secondary marker distributed to two participants." },
  { id: "e3", code: "EVENT C", name: "Relay Delta", kind: "RELAY", status: "CONFLICTING", x: 44, y: 64, note: "Designed conflict point." },
  { id: "e4", code: "EVENT D", name: "Observation Point Echo", kind: "OBSERVATION", status: "STALE", x: 76, y: 66, note: "Staleness test marker." },
];

export default function Scenarios() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [saved, setSaved] = useState(false);

  const selected = state.scenarios.find((s) => s.id === state.selectedScenarioId) ?? state.scenarios[0];

  const buildScenario = (): Scenario => ({
    id: `scn-${Date.now().toString(36)}`,
    name: form.name.trim().toUpperCase() || "UNTITLED SCENARIO",
    description:
      form.description.trim() ||
      "Custom training scenario with a configured information and communication environment.",
    domain: form.domain,
    difficulty: form.difficulty,
    participantIds: ["a", "b", "c", "d"].slice(0, Math.max(2, Math.min(4, form.participants))),
    communicationProfile: form.communicationProfile,
    informationProfile: form.informationConditions,
    tags: [`${form.participants} participants`, form.informationConditions, form.communicationProfile],
    events: baseEvents.slice(0, Math.max(2, form.events)),
  });

  const save = () => {
    const scenario = buildScenario();
    dispatch({ type: "ADD_SCENARIO", scenario });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const startTraining = () => {
    const scenario = buildScenario();
    dispatch({ type: "ADD_SCENARIO", scenario });
    dispatch({ type: "SET_INSTRUCTOR", patch: { difficulty: scenario.difficulty, communicationProfile: scenario.communicationProfile, informationProfile: scenario.informationProfile } });
    navigate("/training/sig-horizon-01");
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-tech-soft text-tech">
          <Library size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-[21px] font-extrabold tracking-tight text-navy sm:text-[23px]">
              SCENARIO LIBRARY
            </h2>
            <SimBadge compact />
          </div>
          <p className="mt-0.5 text-[13px] text-muted">
            Fictional training scenarios — participants, information conditions, communication
            profile, difficulty and events
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-soft"
        >
          Create scenario
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {state.scenarios.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            selected={s.id === state.selectedScenarioId}
            onSelect={() => dispatch({ type: "SELECT_SCENARIO", id: s.id })}
            onStart={() => {
              dispatch({ type: "SELECT_SCENARIO", id: s.id });
              dispatch({ type: "SET_INSTRUCTOR", patch: { difficulty: s.difficulty, communicationProfile: s.communicationProfile, informationProfile: s.informationProfile } });
              navigate("/training/sig-horizon-01");
            }}
          />
        ))}
        <CreateScenarioCard onClick={() => setShowForm(true)} />
      </div>

      {selected && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <ScenarioMap events={selected.events} degraded={selected.communicationProfile !== "Normal"} />
          <section className="panel p-5">
            <p className="eyebrow mb-1">Selected scenario</p>
            <h3 className="text-[19px] font-extrabold tracking-tight text-navy">{selected.name}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{selected.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2.5 text-[12px]">
              {[
                ["Domain", selected.domain],
                ["Difficulty", `Level ${selected.difficulty}`],
                ["Participants", `${selected.participantIds.length}`],
                ["Events", `${selected.events.length}`],
                ["Communication", selected.communicationProfile],
                ["Information", selected.informationProfile],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[9px] bg-canvas px-3 py-2">
                  <dt className="text-[9.5px] font-bold uppercase tracking-wide text-faint">{k}</dt>
                  <dd className="font-semibold text-navy">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => navigate("/training/sig-horizon-01")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-flare px-4 py-3 text-[12.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
            >
              <Rocket size={15} aria-hidden /> Start training
            </button>
          </section>
        </div>
      )}

      {/* builder modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/45 px-4 py-8 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-label="Scenario builder"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[620px] rounded-[14px] border border-line bg-white shadow-2xl"
            >
              <header className="flex items-start gap-3 border-b border-line px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-tech-soft text-tech">
                  <Library size={17} aria-hidden />
                </span>
                <div className="flex-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-tech">
                    Scenario builder
                  </p>
                  <h2 className="text-[17px] font-bold text-navy">Create new scenario</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close scenario builder"
                  className="text-faint hover:text-navy"
                >
                  <X size={18} aria-hidden />
                </button>
              </header>

              <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Scenario name
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. HARBOR LANTERN"
                    className="w-full rounded-[9px] border border-line px-3 py-2.5 text-[13.5px] text-navy outline-none placeholder:text-faint focus:border-tech"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="What does this training scenario exercise?"
                    className="w-full resize-none rounded-[9px] border border-line px-3 py-2.5 text-[13px] text-navy outline-none placeholder:text-faint focus:border-tech"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Participants
                  </span>
                  <input
                    type="number"
                    min={2}
                    max={4}
                    value={form.participants}
                    onChange={(e) => setForm({ ...form, participants: Number(e.target.value) })}
                    className="w-full rounded-[9px] border border-line px-3 py-2.5 text-[13.5px] text-navy outline-none focus:border-tech"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Events
                  </span>
                  <input
                    type="number"
                    min={2}
                    max={4}
                    value={form.events}
                    onChange={(e) => setForm({ ...form, events: Number(e.target.value) })}
                    className="w-full rounded-[9px] border border-line px-3 py-2.5 text-[13.5px] text-navy outline-none focus:border-tech"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Information conditions
                  </span>
                  <select
                    value={form.informationConditions}
                    onChange={(e) => setForm({ ...form, informationConditions: e.target.value as InfoProfile })}
                    className="w-full rounded-[9px] border border-line bg-white px-3 py-2.5 text-[13px] text-navy outline-none focus:border-tech"
                  >
                    {INFO_PROFILES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Communication profile
                  </span>
                  <select
                    value={form.communicationProfile}
                    onChange={(e) => setForm({ ...form, communicationProfile: e.target.value as CommProfile })}
                    className="w-full rounded-[9px] border border-line bg-white px-3 py-2.5 text-[13px] text-navy outline-none focus:border-tech"
                  >
                    {COMM_PROFILES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>

                <div className="sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Domain
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DOMAINS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm({ ...form, domain: d })}
                        className={`rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors ${
                          (form.domain ?? "Cyber") === d
                            ? "border-navy bg-navy text-white"
                            : "border-line text-muted hover:border-navy hover:text-navy"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Difficulty
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {([1, 2, 3, 4, 5] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setForm({ ...form, difficulty: lvl })}
                        className={`rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors ${
                          form.difficulty === lvl
                            ? "border-flare bg-flare text-white"
                            : "border-line text-muted hover:border-flare hover:text-flare-dark"
                        }`}
                      >
                        Level {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <footer className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
                {saved && (
                  <span className="rounded-lg bg-ok-soft px-3 py-2 text-[11.5px] font-semibold text-ok">
                    Scenario saved to library
                  </span>
                )}
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={save}
                    className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-navy transition-colors hover:border-navy"
                  >
                    <Save size={14} aria-hidden /> Save scenario
                  </button>
                  <button
                    type="button"
                    onClick={startTraining}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-flare px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-flare-dark"
                  >
                    <Rocket size={14} aria-hidden /> Start training
                  </button>
                </div>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
