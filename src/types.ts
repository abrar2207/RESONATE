/* ------------------------------------------------------------------
   RESONATE — shared type system
   All data in this prototype is fictional / synthetic demo data.
   ------------------------------------------------------------------ */

export type InformationStatus =
  | "CONFIRMED"
  | "MISSING"
  | "DELAYED"
  | "CONFLICTING"
  | "STALE"
  | "UNVERIFIED";

export type CommCondition = "NORMAL" | "DEGRADED" | "SEVERELY DEGRADED";

export type SessionStatus = "IDLE" | "LIVE" | "PAUSED" | "COMPLETE";

export type RoleMode = "TRAINEE" | "INSTRUCTOR";

export type CommEventType =
  | "LATENCY"
  | "LOSS"
  | "CONFLICT"
  | "RECOVERY"
  | "INTERRUPT"
  | "INFO"
  | "MESSAGE"
  | "DECISION";

export interface Participant {
  id: string;
  /** Display label used across the UI, e.g. "PLAYER A" */
  label: string;
  /** Fictional team callsign */
  callsign: string;
  role: string;
  initials: string;
  color: string;
  homeSector: string;
}

/** A single piece of scenario information as it exists in the world model. */
export interface InformationItem {
  id: string;
  title: string;
  /** Fictional source designator, e.g. "Sensor Alpha" */
  source: string;
  /** hh:mm:ss of first receipt */
  timestamp: string;
  status: InformationStatus;
  /** 0–100 */
  confidence: number;
  recipientIds: string[];
  kind: "REPORT" | "SENSOR" | "UPDATE" | "EVENT";
  summary: string;
}

/** How one participant currently perceives a piece of information. */
export interface LocalInfoView {
  informationId: string;
  participantId: string;
  /** The *local* status — may diverge from the reconciled shared status. */
  status: InformationStatus;
  confidence: number;
}

export interface InformationState {
  participantId: string;
  views: LocalInfoView[];
  lastUpdated: string;
  /** Local agreement with the team's reconciled state, 0–100 */
  agreement: number;
}

export interface CommunicationEvent {
  id: string;
  timestamp: string;
  type: CommEventType;
  description: string;
  participantId?: string;
  informationId?: string;
  severity: "info" | "warn" | "danger" | "ok";
}

export interface ChatMessage {
  id: string;
  participantId: string;
  text: string;
  timestamp: string;
  simulated?: boolean;
}

export type MapNodeKind = "EVENT" | "RELAY" | "OBSERVATION";

export interface ScenarioEvent {
  id: string;
  /** EVENT A / B / C / D */
  code: string;
  name: string;
  kind: MapNodeKind;
  status: InformationStatus;
  /** normalised 0-100 coordinates on the abstract grid */
  x: number;
  y: number;
  note: string;
}

export type DomainLabel = "Land" | "Air" | "Cyber" | "EW";
export type CommProfile = "Normal" | "Delayed" | "Loss" | "Interrupted" | "Conflicting";
export type InfoProfile = "Complete" | "Partial" | "Delayed" | "Conflicting" | "Stale";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  domain: DomainLabel;
  difficulty: 1 | 2 | 3 | 4 | 5;
  participantIds: string[];
  communicationProfile: CommProfile;
  informationProfile: InfoProfile;
  events: ScenarioEvent[];
  tags: string[];
}

export type DecisionChoice = "A" | "B" | "C" | "D";

export type DecisionReason =
  | "Information confidence"
  | "Source reliability"
  | "Recency"
  | "Conflict level"
  | "Need for additional verification";

export interface Decision {
  id: string;
  sessionId: string;
  choice: DecisionChoice;
  reason: DecisionReason;
  timestamp: string;
  /** Snapshot of the shared state at decision time — no hindsight. */
  availableInformation: {
    confirmed: number;
    conflicting: number;
    unverified: number;
    stale: number;
  };
}

export interface SharedState {
  confirmed: string[];
  conflicting: string[];
  stale: string[];
  unverified: string[];
}

export interface ConvergenceMetric {
  /** seconds from scenario start */
  time: number;
  a: number;
  b: number;
  c: number;
  d: number;
  avg: number;
}

export interface TimelineEntry {
  id: string;
  label: string;
  timestamp: string;
  note?: string;
  state: "done" | "active" | "pending";
}

export interface TrainingSession {
  id: string;
  operation: string;
  scenarioName: string;
  scenarioId: string;
  status: SessionStatus;
  startedAt: string;
  elapsedSec: number;
  commCondition: CommCondition;
  convergence: number;
  decisionPending: boolean;
  participantIds: string[];
}

export interface RankedInformation {
  id: string;
  label: string;
  weight: number;
  usedInDecision: boolean;
}

export interface BehaviourMetric {
  key: string;
  label: string;
  value: number;
}

export interface AARReport {
  sessionId: string;
  duration: string;
  participants: number;
  commCondition: CommCondition;
  convergenceTime: string;
  decisionLatency: string;
  whatHappened: string;
  whereFailed: string;
  informationRanked: RankedInformation[];
  behaviour: BehaviourMetric[];
}

export interface AIInsight {
  id: string;
  title: string;
  body: string;
  category: "pattern" | "strength" | "risk";
}

export interface NextTrainingCondition {
  currentLevel: number;
  nextLevel: number;
  weakness: string;
  adjustments: string[];
}

export interface ScenarioForm {
  name: string;
  description: string;
  participants: number;
  informationConditions: InfoProfile;
  communicationProfile: CommProfile;
  difficulty: 1 | 2 | 3 | 4 | 5;
  events: number;
}

/* ---------------------------- demo orchestration ---------------------------- */

export const DEMO_STEP_COUNT = 13;

export interface DemoState {
  running: boolean;
  paused: boolean;
  step: number;
}

export type ReconcileAction = "CONFIRM" | "UNVERIFY" | "REQUEST" | "KEEP";

export interface InstructorConfig {
  domain: DomainLabel;
  difficulty: 1 | 2 | 3 | 4 | 5;
  communicationProfile: CommProfile;
  informationProfile: InfoProfile;
  sessionStatus: SessionStatus;
  activeParticipantIds: string[];
}
