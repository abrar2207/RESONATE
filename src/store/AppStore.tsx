import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import {
  activeSession,
  convergenceSeries,
  initialDecisionTimeline,
  initialSharedState,
  participants,
  scenarios as seedScenarios,
  seededCommEvents,
  seededMessages,
} from "../data/demo";
import type {
  ChatMessage,
  CommCondition,
  CommunicationEvent,
  Decision,
  DecisionChoice,
  DecisionReason,
  DemoState,
  DomainLabel,
  InstructorConfig,
  ReconcileAction,
  RoleMode,
  Scenario,
  SessionStatus,
  SharedState,
  TimelineEntry,
  TrainingSession,
} from "../types";

/* ------------------------------------------------------------------ */

export interface AppState {
  mode: RoleMode;
  user: { name: string; email: string; role: string } | null;
  session: TrainingSession;
  sharedState: SharedState;
  commEvents: CommunicationEvent[];
  messages: ChatMessage[];
  revealCount: number;
  convergeAnimating: boolean;
  sharedStateReached: boolean;
  unresolvedConflicts: number;
  agreementBoost: number;
  decision: Decision | null;
  decisionChoice: DecisionChoice | null;
  decisionReason: DecisionReason | null;
  decisionTimeline: TimelineEntry[];
  aarReady: boolean;
  nextConditionReady: boolean;
  instructor: InstructorConfig;
  scenarios: Scenario[];
  selectedScenarioId: string;
  demo: DemoState;
  activityLog: string[];
}

type Action =
  | { type: "HYDRATE"; state: AppState }
  | { type: "RESET_ALL" }
  | { type: "SET_USER"; user: AppState["user"] }
  | { type: "SET_DEMO_USER" }
  | { type: "SET_MODE"; mode: RoleMode }
  | { type: "SET_SESSION_STATUS"; status: SessionStatus }
  | { type: "TICK" }
  | { type: "SET_COMM"; condition: CommCondition }
  | { type: "PUSH_EVENT"; event: CommunicationEvent }
  | { type: "PUSH_MESSAGE"; message: ChatMessage }
  | { type: "SET_REVEAL"; count: number }
  | { type: "SET_ANIMATING"; value: boolean }
  | { type: "SET_REACHED"; value: boolean }
  | { type: "RECONCILE"; action: ReconcileAction }
  | { type: "SET_DECISION_CHOICE"; choice: DecisionChoice }
  | { type: "SET_DECISION_REASON"; reason: DecisionReason }
  | { type: "SUBMIT_DECISION" }
  | { type: "SET_AAR_READY"; value: boolean }
  | { type: "SET_NEXT_READY"; value: boolean }
  | { type: "SET_INSTRUCTOR"; patch: Partial<InstructorConfig> }
  | { type: "ADD_SCENARIO"; scenario: Scenario }
  | { type: "SELECT_SCENARIO"; id: string }
  | { type: "SET_DEMO"; patch: Partial<DemoState> }
  | { type: "DEMO_STEP"; step: number }
  | { type: "LOG"; entry: string };

const STORAGE_KEY = "resonate.state.v1";

const baseInstructor: InstructorConfig = {
  domain: "Cyber",
  difficulty: 2,
  communicationProfile: "Delayed",
  informationProfile: "Conflicting",
  sessionStatus: "LIVE",
  activeParticipantIds: ["a", "b", "c", "d"],
};

export const initialState: AppState = {
  mode: "TRAINEE",
  user: null,
  session: { ...activeSession },
  sharedState: { ...initialSharedState, confirmed: [...initialSharedState.confirmed], conflicting: [...initialSharedState.conflicting], stale: [...initialSharedState.stale], unverified: [...initialSharedState.unverified] },
  commEvents: [...seededCommEvents],
  messages: [],
  revealCount: 8,
  convergeAnimating: false,
  sharedStateReached: false,
  unresolvedConflicts: 2,
  agreementBoost: 0,
  decision: null,
  decisionChoice: null,
  decisionReason: null,
  decisionTimeline: [],
  aarReady: false,
  nextConditionReady: false,
  instructor: { ...baseInstructor },
  scenarios: [...seedScenarios],
  selectedScenarioId: "signal-horizon",
  demo: { running: false, paused: false, step: 0 },
  activityLog: [],
};

/* ------------------------- helpers ------------------------- */

export const pad = (n: number) => String(n).padStart(2, "0");

/** Elapsed seconds -> hh:mm:ss clock starting at START_CLOCK (10:40:00). */
export function clockAt(elapsedSec: number): string {
  const [h, m, s] = [10, 40, 0];
  const total = h * 3600 + m * 60 + s + Math.max(0, elapsedSec);
  const hh = Math.floor(total / 3600) % 24;
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

export const durationLabel = (sec: number) => `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;

export function currentAgreement(state: AppState): number {
  const idx = Math.min(Math.max(state.revealCount, 1), convergenceSeries.length);
  const point = convergenceSeries[idx - 1];
  return Math.min(99, point.avg + state.agreementBoost);
}

const cloneShared = (s: SharedState): SharedState => ({
  confirmed: [...s.confirmed],
  conflicting: [...s.conflicting],
  stale: [...s.stale],
  unverified: [...s.unverified],
});

const push = <T,>(list: T[], item: T, max = 40): T[] => [...list, item].slice(-max);

let eventSeq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${eventSeq++}`;

function log(state: AppState, entry: string): string[] {
  return [entry, ...state.activityLog].slice(0, 30);
}

/* ------------------------- demo choreography ------------------------- */

export interface DemoStep {
  title: string;
  caption: string;
  route: string;
  duration: number;
}

export const demoSteps: DemoStep[] = [
  { title: "Scenario created", caption: "SIGNAL HORIZON instantiated with four participants.", route: "/training", duration: 7000 },
  { title: "Four players receive different information", caption: "Same scenario, four different information states.", route: "/training/sig-horizon-01", duration: 11000 },
  { title: "Communication begins degrading", caption: "Latency 2.5s · packet loss 18%.", route: "/training/sig-horizon-01", duration: 10000 },
  { title: "Information states diverge", caption: "Agreement drops to 37% as states fragment.", route: "/training/sig-horizon-01", duration: 10000 },
  { title: "Conflicting information appears", caption: "Report C and Report D contradict each other.", route: "/training/sig-horizon-01", duration: 10000 },
  { title: "Players communicate", caption: "Reconciliation messages exchanged with delays.", route: "/training/sig-horizon-01", duration: 12000 },
  { title: "Shared-state reconstruction begins", caption: "Individual states are reconciled into one view.", route: "/reconstruction", duration: 10000 },
  { title: "States gradually converge", caption: "Agreement climbs from 38% toward 78%.", route: "/reconstruction", duration: 14000 },
  { title: "Shared state reached", caption: "Team agreement stabilises at 78%.", route: "/reconstruction", duration: 9000 },
  { title: "Team makes decision", caption: "Decision + reason selected against available state.", route: "/decision", duration: 12000 },
  { title: "Decision timeline generated", caption: "Every step timestamped for review.", route: "/decision", duration: 8000 },
  { title: "AI after-action review generated", caption: "Evidence-linked analysis of the session.", route: "/aar", duration: 13000 },
  { title: "Next training condition generated", caption: "Adaptive information environment for level 3.", route: "/aar", duration: 9000 },
];

function resetSession(state: AppState): AppState {
  return {
    ...state,
    session: {
      ...state.session,
      status: "LIVE",
      elapsedSec: 128, // clock reads 10:42:08 — matches the first information receipt
      commCondition: "NORMAL",
      convergence: 37,
      decisionPending: true,
    },
    sharedState: cloneShared(initialSharedState),
    commEvents: [],
    messages: [],
    revealCount: 1,
    convergeAnimating: false,
    sharedStateReached: false,
    unresolvedConflicts: 2,
    agreementBoost: 0,
    decision: null,
    decisionChoice: null,
    decisionReason: null,
    decisionTimeline: [],
    aarReady: false,
    nextConditionReady: false,
    activityLog: [],
  };
}

function applyDemoStep(state: AppState, step: number): AppState {
  switch (step) {
    case 1: {
      const s = resetSession(state);
      return {
        ...s,
        commEvents: [
          {
            id: nextId("ce"),
            timestamp: clockAt(128),
            type: "INFO",
            description: "Scenario SIGNAL HORIZON created · 4 participants attached",
            severity: "info",
          },
        ],
        activityLog: ["Scenario created"],
      };
    }
    case 2: {
      const e: CommunicationEvent[] = [
        {
          id: nextId("ce"),
          timestamp: "10:42:08",
          type: "INFO",
          description: "Report A received · distributed to 2 of 4 participants",
          informationId: "report-a",
          severity: "info",
        },
        {
          id: nextId("ce"),
          timestamp: "10:42:11",
          type: "INFO",
          description: "Four distinct information states published",
          severity: "info",
        },
      ];
      return { ...state, commEvents: [...state.commEvents, ...e], activityLog: log(state, "Information states distributed") };
    }
    case 3: {
      const e: CommunicationEvent[] = [
        {
          id: nextId("ce"),
          timestamp: "10:42:13",
          type: "LATENCY",
          description: "Player B communication delayed",
          participantId: "b",
          severity: "warn",
        },
        {
          id: nextId("ce"),
          timestamp: "10:42:14",
          type: "LOSS",
          description: "Latency 2.5s · packet loss 18% · message delay active",
          severity: "warn",
        },
      ];
      return {
        ...state,
        session: { ...state.session, commCondition: "DEGRADED" },
        instructor: { ...state.instructor, sessionStatus: "LIVE", communicationProfile: "Delayed" },
        commEvents: [...state.commEvents, ...e],
        activityLog: log(state, "Communication degradation engaged"),
      };
    }
    case 4: {
      const e: CommunicationEvent = {
        id: nextId("ce"),
        timestamp: "10:42:15",
        type: "LOSS",
        description: "Information states diverging · agreement 37%",
        severity: "warn",
      };
      return {
        ...state,
        session: { ...state.session, convergence: 37 },
        revealCount: 1,
        commEvents: push(state.commEvents, e),
        activityLog: log(state, "Divergence measured"),
      };
    }
    case 5: {
      const e: CommunicationEvent[] = [
        {
          id: nextId("ce"),
          timestamp: "10:42:17",
          type: "CONFLICT",
          description: "Conflicting report detected · Report C vs Report D",
          informationId: "report-c",
          severity: "danger",
        },
        {
          id: nextId("ce"),
          timestamp: "10:42:21",
          type: "INTERRUPT",
          description: "Communication interruption",
          severity: "danger",
        },
      ];
      return { ...state, commEvents: [...state.commEvents, ...e], activityLog: log(state, "Conflict detected") };
    }
    case 6: {
      const msgs: ChatMessage[] = seededMessages.map((m) => ({ ...m, id: nextId("m") }));
      const e: CommunicationEvent = {
        id: nextId("ce"),
        timestamp: "10:42:46",
        type: "MESSAGE",
        description: "4 reconciliation messages exchanged",
        severity: "info",
      };
      return {
        ...state,
        messages: msgs,
        commEvents: push(state.commEvents, e),
        activityLog: log(state, "Team communication open"),
      };
    }
    case 7: {
      const e: CommunicationEvent = {
        id: nextId("ce"),
        timestamp: "10:42:50",
        type: "RECOVERY",
        description: "Shared-state reconstruction started",
        severity: "ok",
      };
      return {
        ...state,
        revealCount: 2,
        convergeAnimating: true,
        commEvents: push(state.commEvents, e),
        activityLog: log(state, "Reconstruction started"),
      };
    }
    case 8:
      return { ...state, convergeAnimating: true, activityLog: log(state, "Convergence in progress") };
    case 9: {
      const e: CommunicationEvent = {
        id: nextId("ce"),
        timestamp: "10:43:02",
        type: "RECOVERY",
        description: "Shared state reached · 78% agreement",
        severity: "ok",
      };
      return {
        ...state,
        revealCount: convergenceSeries.length,
        convergeAnimating: false,
        sharedStateReached: true,
        session: { ...state.session, convergence: 78 },
        commEvents: push(state.commEvents, e),
        activityLog: log(state, "Shared state reached"),
      };
    }
    case 10:
      return {
        ...state,
        decisionChoice: "B",
        decisionReason: "Information confidence",
        activityLog: log(state, "Decision options evaluated"),
      };
    case 11: {
      const s = submitDecision(state);
      return { ...s, activityLog: log(state, "Decision submitted") };
    }
    case 12: {
      const e: CommunicationEvent = {
        id: nextId("ce"),
        timestamp: clockAt(state.session.elapsedSec),
        type: "DECISION",
        description: "After-action review generated",
        severity: "ok",
      };
      return {
        ...state,
        aarReady: true,
        session: { ...state.session, status: "COMPLETE", decisionPending: false },
        commEvents: push(state.commEvents, e),
        activityLog: log(state, "AI analysis complete"),
      };
    }
    case 13:
      return { ...state, nextConditionReady: true, activityLog: log(state, "Adaptive condition proposed") };
    default:
      return state;
  }
}

function submitDecision(state: AppState): AppState {
  const choice = state.decisionChoice ?? "B";
  const reason = state.decisionReason ?? "Information confidence";
  const decision: Decision = {
    id: nextId("dec"),
    sessionId: state.session.id,
    choice,
    reason,
    timestamp: clockAt(state.session.elapsedSec),
    availableInformation: {
      confirmed: state.sharedState.confirmed.length,
      conflicting: state.sharedState.conflicting.length,
      unverified: state.sharedState.unverified.length,
      stale: state.sharedState.stale.length,
    },
  };
  const timeline: TimelineEntry[] = initialDecisionTimeline.map((t) => ({ ...t }));
  timeline[timeline.length - 1] = {
    ...timeline[timeline.length - 1],
    timestamp: decision.timestamp,
    state: "done",
  };
  return {
    ...state,
    decision,
    decisionTimeline: timeline,
    session: { ...state.session, decisionPending: false },
  };
}

/* ------------------------- reducer ------------------------- */

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "RESET_ALL": {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      return { ...initialState, user: state.user, mode: state.mode };
    }
    case "SET_DEMO_USER":
      return state.user
        ? state
        : {
            ...state,
            user: { name: "Demo Trainee", email: "demo@resonate.demo", role: "Trainee" },
            mode: "TRAINEE",
          };
    case "SET_USER":
      return { ...state, user: action.user, mode: action.user?.role === "Instructor" ? "INSTRUCTOR" : "TRAINEE" };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_SESSION_STATUS":
      return {
        ...state,
        session: { ...state.session, status: action.status },
        instructor: { ...state.instructor, sessionStatus: action.status },
      };
    case "TICK": {
      if (state.session.status !== "LIVE") return state;
      const elapsedSec = state.session.elapsedSec + 1;
      return { ...state, session: { ...state.session, elapsedSec } };
    }
    case "SET_COMM":
      return {
        ...state,
        session: { ...state.session, commCondition: action.condition },
      };
    case "PUSH_EVENT":
      return { ...state, commEvents: push(state.commEvents, action.event) };
    case "PUSH_MESSAGE":
      return { ...state, messages: push(state.messages, action.message) };
    case "SET_REVEAL": {
      const count = Math.min(Math.max(action.count, 1), convergenceSeries.length);
      const reached = count >= convergenceSeries.length;
      return {
        ...state,
        revealCount: count,
        session: { ...state.session, convergence: convergenceSeries[count - 1].avg + state.agreementBoost },
        sharedStateReached: reached ? true : state.sharedStateReached,
      };
    }
    case "SET_ANIMATING":
      return { ...state, convergeAnimating: action.value };
    case "SET_REACHED":
      return { ...state, sharedStateReached: action.value };
    case "RECONCILE": {
      const shared = cloneShared(state.sharedState);
      const conflictLabel = "Report C vs Report D";
      let conflicts = state.unresolvedConflicts;
      let boost = state.agreementBoost;
      let activity = "";
      const ts = clockAt(state.session.elapsedSec);

      if (action.action === "CONFIRM") {
        shared.conflicting = shared.conflicting.filter((c) => c !== conflictLabel);
        if (!shared.confirmed.includes(conflictLabel)) shared.confirmed.push(conflictLabel);
        shared.unverified = shared.unverified.filter((c) => c !== "Report D");
        if (!shared.confirmed.includes("Report D")) shared.confirmed.push("Report D");
        conflicts = Math.max(0, conflicts - 1);
        boost = Math.min(8, boost + 4);
        activity = "Conflict reconciled → CONFIRMED";
      } else if (action.action === "UNVERIFY") {
        shared.conflicting = shared.conflicting.filter((c) => c !== conflictLabel);
        shared.unverified = Array.from(new Set([...shared.unverified, conflictLabel]));
        conflicts = Math.max(0, conflicts - 1);
        boost = Math.min(8, boost + 2);
        activity = "Conflict reconciled → UNVERIFIED";
      } else if (action.action === "REQUEST") {
        boost = Math.min(8, boost + 1);
        activity = "Additional information requested";
      } else {
        activity = "Conflict kept open (KEEP CONFLICT)";
      }

      const event: CommunicationEvent = {
        id: nextId("ce"),
        timestamp: ts,
        type: action.action === "KEEP" ? "CONFLICT" : "RECOVERY",
        description: activity,
        informationId: "report-c",
        severity: action.action === "KEEP" ? "warn" : "ok",
      };

      return {
        ...state,
        sharedState: shared,
        unresolvedConflicts: conflicts,
        agreementBoost: boost,
        commEvents: push(state.commEvents, event),
        activityLog: log(state, activity),
        session: {
          ...state.session,
          convergence: convergenceSeries[state.revealCount - 1].avg + boost,
        },
      };
    }
    case "SET_DECISION_CHOICE":
      return { ...state, decisionChoice: action.choice };
    case "SET_DECISION_REASON":
      return { ...state, decisionReason: action.reason };
    case "SUBMIT_DECISION":
      return { ...submitDecision(state), activityLog: log(state, "Decision submitted") };
    case "SET_AAR_READY":
      return { ...state, aarReady: action.value };
    case "SET_NEXT_READY":
      return { ...state, nextConditionReady: action.value };
    case "SET_INSTRUCTOR": {
      const instructor = { ...state.instructor, ...action.patch };
      const session = { ...state.session };
      if (action.patch.sessionStatus) session.status = action.patch.sessionStatus;
      if (action.patch.communicationProfile) {
        session.commCondition =
          action.patch.communicationProfile === "Normal"
            ? "NORMAL"
            : action.patch.communicationProfile === "Interrupted"
              ? "SEVERELY DEGRADED"
              : "DEGRADED";
      }
      return { ...state, instructor, session };
    }
    case "ADD_SCENARIO":
      return { ...state, scenarios: [action.scenario, ...state.scenarios], selectedScenarioId: action.scenario.id };
    case "SELECT_SCENARIO":
      return { ...state, selectedScenarioId: action.id };
    case "SET_DEMO":
      return { ...state, demo: { ...state.demo, ...action.patch } };
    case "DEMO_STEP":
      return applyDemoStep(state, action.step);
    case "LOG":
      return { ...state, activityLog: log(state, action.entry) };
    default:
      return state;
  }
}

/* ------------------------- context ------------------------- */

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  participants: typeof participants;
  agreement: number;
  startDemo: () => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadInitial(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || typeof parsed !== "object" || !parsed.session) return initialState;
    return {
      ...initialState,
      ...parsed,
      demo: { running: false, paused: false, step: 0 },
      convergeAnimating: false,
    };
  } catch {
    return initialState;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  /* session clock */
  useEffect(() => {
    if (state.session.status !== "LIVE") return;
    const id = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(id);
  }, [state.session.status]);

  /* convergence animation */
  useEffect(() => {
    if (!state.convergeAnimating) return;
    if (state.revealCount >= convergenceSeries.length) {
      dispatch({ type: "SET_ANIMATING", value: false });
      return;
    }
    const id = window.setTimeout(() => dispatch({ type: "SET_REVEAL", count: state.revealCount + 1 }), 1900);
    return () => window.clearTimeout(id);
  }, [state.convergeAnimating, state.revealCount]);

  /* persistence */
  useEffect(() => {
    try {
      const snapshot: AppState = { ...state, demo: { running: false, paused: false, step: 0 }, convergeAnimating: false };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* quota / private mode — prototype continues in memory */
    }
  }, [state]);

  const startDemo = useCallback(() => {
    dispatch({ type: "SET_DEMO_USER" });
    dispatch({ type: "DEMO_STEP", step: 1 });
    dispatch({ type: "SET_DEMO", patch: { running: true, paused: false, step: 1 } });
  }, []);

  const resetAll = useCallback(() => dispatch({ type: "RESET_ALL" }), []);

  const agreement = useMemo(() => currentAgreement(state), [state]);

  const value: AppContextValue = {
    state,
    dispatch,
    participants,
    agreement,
    startDemo,
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
