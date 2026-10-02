import type {
  AARReport,
  AIInsight,
  ChatMessage,
  CommunicationEvent,
  ConvergenceMetric,
  Decision,
  InformationItem,
  InformationState,
  LocalInfoView,
  NextTrainingCondition,
  Participant,
  Scenario,
  SharedState,
  TimelineEntry,
  TrainingSession,
} from "../types";

/* ------------------------------------------------------------------
   Everything in this file is FICTIONAL / SYNTHETIC DEMO DATA.
   No real locations, units, weapons, coordinates or doctrine.
   ------------------------------------------------------------------ */

export const START_CLOCK = "10:40:00"; // session clock origin (elapsed 00:00)

export const participants: Participant[] = [
  {
    id: "a",
    label: "PLAYER A",
    callsign: "Alpha",
    role: "Information lead",
    initials: "PA",
    color: "#1769AA",
    homeSector: "Sector Alpha",
  },
  {
    id: "b",
    label: "PLAYER B",
    callsign: "Bravo",
    role: "Sensor operator",
    initials: "PB",
    color: "#4B7FB5",
    homeSector: "Node Bravo",
  },
  {
    id: "c",
    label: "PLAYER C",
    callsign: "Charlie",
    role: "Observer liaison",
    initials: "PC",
    color: "#2F9E7E",
    homeSector: "Relay Delta",
  },
  {
    id: "d",
    label: "PLAYER D",
    callsign: "Delta",
    role: "Relay coordinator",
    initials: "PD",
    color: "#7A6FB8",
    homeSector: "Observation Point Echo",
  },
];

export const informationCatalog: InformationItem[] = [
  {
    id: "report-a",
    title: "Report A",
    source: "Sensor Alpha",
    timestamp: "10:42:08",
    status: "CONFIRMED",
    confidence: 92,
    recipientIds: ["a", "c"],
    kind: "REPORT",
    summary: "Corroborated observation from the Sector Alpha sensor feed.",
  },
  {
    id: "report-b",
    title: "Report B",
    source: "Node Bravo",
    timestamp: "10:42:11",
    status: "CONFIRMED",
    confidence: 85,
    recipientIds: ["b", "c"],
    kind: "REPORT",
    summary: "Node Bravo status report relayed over the primary channel.",
  },
  {
    id: "report-c",
    title: "Report C",
    source: "Observer Alpha",
    timestamp: "10:42:13",
    status: "CONFLICTING",
    confidence: 54,
    recipientIds: ["a", "b", "d"],
    kind: "REPORT",
    summary: "Observer account that disagrees with Report D on relay availability.",
  },
  {
    id: "report-d",
    title: "Report D",
    source: "Observer Bravo",
    timestamp: "10:42:17",
    status: "CONFLICTING",
    confidence: 48,
    recipientIds: ["b", "d"],
    kind: "REPORT",
    summary: "Second observer account contradicting Report C.",
  },
  {
    id: "sensor-x",
    title: "Sensor X",
    source: "Sensor Array X",
    timestamp: "10:42:19",
    status: "DELAYED",
    confidence: 66,
    recipientIds: ["a", "b"],
    kind: "SENSOR",
    summary: "Telemetry stream arriving behind schedule under packet loss.",
  },
  {
    id: "sensor-y",
    title: "Sensor Y",
    source: "Sensor Array Y",
    timestamp: "10:42:22",
    status: "CONFIRMED",
    confidence: 88,
    recipientIds: ["c", "d"],
    kind: "SENSOR",
    summary: "Stable telemetry stream, unaffected by the degradation profile.",
  },
  {
    id: "update-d",
    title: "Status Update D",
    source: "Relay Delta",
    timestamp: "10:42:25",
    status: "STALE",
    confidence: 41,
    recipientIds: ["d"],
    kind: "UPDATE",
    summary: "Superseded status packet retained by the relay coordinator.",
  },
  {
    id: "report-21",
    title: "Incoming Report #21",
    source: "Relay Echo",
    timestamp: "10:42:29",
    status: "UNVERIFIED",
    confidence: 35,
    recipientIds: ["d"],
    kind: "REPORT",
    summary: "Partial packet recovered after an interruption; not yet corroborated.",
  },
];

export const informationById = (id: string) =>
  informationCatalog.find((i) => i.id === id) ?? informationCatalog[0];

/* --- the four deliberately different information states ------------------- */

const view = (
  participantId: string,
  informationId: string,
  status: LocalInfoView["status"],
  confidence: number,
): LocalInfoView => ({ participantId, informationId, status, confidence });

export const informationStates: InformationState[] = [
  {
    participantId: "a",
    lastUpdated: "10:42:19",
    agreement: 64,
    views: [
      view("a", "report-a", "CONFIRMED", 92),
      view("a", "sensor-x", "CONFIRMED", 84),
      view("a", "report-c", "UNVERIFIED", 44),
    ],
  },
  {
    participantId: "b",
    lastUpdated: "10:42:19",
    agreement: 58,
    views: [
      view("b", "report-b", "CONFIRMED", 85),
      view("b", "sensor-x", "DELAYED", 52),
      view("b", "report-c", "CONFLICTING", 47),
    ],
  },
  {
    participantId: "c",
    lastUpdated: "10:42:22",
    agreement: 61,
    views: [
      view("c", "report-a", "CONFIRMED", 92),
      view("c", "report-b", "CONFLICTING", 49),
      view("c", "sensor-y", "CONFIRMED", 88),
    ],
  },
  {
    participantId: "d",
    lastUpdated: "10:42:29",
    agreement: 52,
    views: [
      view("d", "report-c", "STALE", 40),
      view("d", "sensor-y", "CONFIRMED", 88),
      view("d", "report-d", "UNVERIFIED", 38),
    ],
  },
];

/* --- scenario -------------------------------------------------------------- */

export const scenarios: Scenario[] = [
  {
    id: "signal-horizon",
    name: "SIGNAL HORIZON",
    description:
      "A simulated multi-domain coordination exercise designed to test team information reconstruction under degraded communication.",
    domain: "Cyber",
    difficulty: 2,
    participantIds: ["a", "b", "c", "d"],
    communicationProfile: "Delayed",
    informationProfile: "Conflicting",
    tags: ["Multi-domain coordination", "Baseline", "4 participants"],
    events: [
      {
        id: "evt-a",
        code: "EVENT A",
        name: "Sector Alpha",
        kind: "EVENT",
        status: "CONFIRMED",
        x: 24,
        y: 30,
        note: "Corroborated by Sensor Alpha and Player C.",
      },
      {
        id: "evt-b",
        code: "EVENT B",
        name: "Node Bravo",
        kind: "EVENT",
        status: "CONFIRMED",
        x: 62,
        y: 24,
        note: "Reported by Player B, contested in Player C's local state.",
      },
      {
        id: "evt-c",
        code: "EVENT C",
        name: "Relay Delta",
        kind: "RELAY",
        status: "CONFLICTING",
        x: 44,
        y: 62,
        note: "Report C and Report D disagree on relay availability.",
      },
      {
        id: "evt-d",
        code: "EVENT D",
        name: "Observation Point Echo",
        kind: "OBSERVATION",
        status: "STALE",
        x: 76,
        y: 66,
        note: "Last confirmed packet is older than the staleness window.",
      },
    ],
  },
  {
    id: "echo-trace",
    name: "ECHO TRACE",
    description:
      "Information-conflict focused exercise: two observers describe the same relay differently and the team must reconcile them.",
    domain: "EW",
    difficulty: 3,
    participantIds: ["a", "b", "c", "d"],
    communicationProfile: "Conflicting",
    informationProfile: "Conflicting",
    tags: ["Information conflict", "Observer mismatch"],
    events: [
      {
        id: "evt-a",
        code: "EVENT A",
        name: "Sector Alpha",
        kind: "EVENT",
        status: "CONFIRMED",
        x: 30,
        y: 36,
        note: "Stable reference point for this scenario.",
      },
      {
        id: "evt-b",
        code: "EVENT B",
        name: "Node Bravo",
        kind: "EVENT",
        status: "UNVERIFIED",
        x: 68,
        y: 30,
        note: "Only one participant holds this packet.",
      },
      {
        id: "evt-c",
        code: "EVENT C",
        name: "Relay Delta",
        kind: "RELAY",
        status: "CONFLICTING",
        x: 50,
        y: 66,
        note: "Primary conflict under study.",
      },
    ],
  },
  {
    id: "nexus-recovery",
    name: "NEXUS RECOVERY",
    description:
      "Communication recovery exercise: the channel drops, the team rebuilds shared state and measures recovery time.",
    domain: "Land",
    difficulty: 2,
    participantIds: ["a", "b", "c", "d"],
    communicationProfile: "Interrupted",
    informationProfile: "Partial",
    tags: ["Communication recovery", "Channel outage"],
    events: [
      {
        id: "evt-a",
        code: "EVENT A",
        name: "Sector Alpha",
        kind: "EVENT",
        status: "CONFIRMED",
        x: 26,
        y: 58,
        note: "Reconnected after the outage window.",
      },
      {
        id: "evt-b",
        code: "EVENT B",
        name: "Node Bravo",
        kind: "RELAY",
        status: "DELAYED",
        x: 58,
        y: 34,
        note: "Queue drained 18 seconds after recovery.",
      },
      {
        id: "evt-d",
        code: "EVENT D",
        name: "Observation Point Echo",
        kind: "OBSERVATION",
        status: "STALE",
        x: 78,
        y: 62,
        note: "Never refreshed during the outage.",
      },
    ],
  },
];

/* --- session --------------------------------------------------------------- */

export const activeSession: TrainingSession = {
  id: "sig-horizon-01",
  operation: "SIGNAL HORIZON",
  scenarioName: "Multi-Domain Coordination",
  scenarioId: "signal-horizon",
  status: "LIVE",
  startedAt: "10:40:00",
  elapsedSec: 161, // 02:41
  commCondition: "DEGRADED",
  convergence: 74,
  decisionPending: true,
  participantIds: ["a", "b", "c", "d"],
};

export const recentSessions = [
  {
    id: "sig-horizon-01",
    session: "SIG-H-0412",
    scenario: "SIGNAL HORIZON",
    participants: 4,
    convergence: "78%",
    decision: "B · Uncertainty marked",
    status: "LIVE",
  },
  {
    id: "echo-trace-07",
    session: "ECH-T-0409",
    scenario: "ECHO TRACE",
    participants: 4,
    convergence: "83%",
    decision: "D · Requested information",
    status: "COMPLETE",
  },
  {
    id: "nexus-recovery-03",
    session: "NEX-R-0407",
    scenario: "NEXUS RECOVERY",
    participants: 3,
    convergence: "71%",
    decision: "A · Confirmed only",
    status: "COMPLETE",
  },
  {
    id: "signal-horizon-11",
    session: "SIG-H-0403",
    scenario: "SIGNAL HORIZON",
    participants: 4,
    convergence: "66%",
    decision: "C · Included unresolved",
    status: "COMPLETE",
  },
  {
    id: "echo-trace-05",
    session: "ECH-T-0330",
    scenario: "ECHO TRACE",
    participants: 4,
    convergence: "88%",
    decision: "B · Uncertainty marked",
    status: "ARCHIVED",
  },
];

/* --- communication environment -------------------------------------------- */

export const seededCommEvents: CommunicationEvent[] = [
  {
    id: "ce-1",
    timestamp: "10:42:08",
    type: "INFO",
    description: "Report A received",
    participantId: "a",
    informationId: "report-a",
    severity: "info",
  },
  {
    id: "ce-2",
    timestamp: "10:42:13",
    type: "LATENCY",
    description: "Player B communication delayed",
    participantId: "b",
    severity: "warn",
  },
  {
    id: "ce-3",
    timestamp: "10:42:17",
    type: "CONFLICT",
    description: "Conflicting report detected",
    informationId: "report-c",
    severity: "danger",
  },
  {
    id: "ce-4",
    timestamp: "10:42:21",
    type: "INTERRUPT",
    description: "Communication interruption",
    severity: "danger",
  },
];

export const commEnvironment = {
  latency: "2.5s",
  packetLoss: "18%",
  messageDelay: "Active",
  informationConflict: "Active",
};

export const seededMessages: ChatMessage[] = [
  {
    id: "m-1",
    participantId: "a",
    text: "I have confirmation from Report A.",
    timestamp: "10:42:24",
    simulated: true,
  },
  {
    id: "m-2",
    participantId: "b",
    text: "My sensor update is delayed.",
    timestamp: "10:42:31",
    simulated: true,
  },
  {
    id: "m-3",
    participantId: "c",
    text: "Report B conflicts with my information.",
    timestamp: "10:42:39",
    simulated: true,
  },
  {
    id: "m-4",
    participantId: "d",
    text: "I have an older version of the report.",
    timestamp: "10:42:46",
    simulated: true,
  },
];

/* --- shared state ---------------------------------------------------------- */

export const initialSharedState: SharedState = {
  confirmed: ["Event A · Sector Alpha", "Event B · Node Bravo", "Report A"],
  conflicting: ["Report C vs Report D"],
  stale: ["Sensor Update #14", "Sensor X"],
  unverified: ["Incoming Report #21", "Report D"],
};

/* --- convergence ----------------------------------------------------------- */

export const convergenceSeries: ConvergenceMetric[] = [
  { time: 0, a: 38, b: 34, c: 41, d: 36, avg: 37 },
  { time: 5, a: 44, b: 40, c: 47, d: 42, avg: 43 },
  { time: 10, a: 49, b: 46, c: 52, d: 49, avg: 49 },
  { time: 15, a: 55, b: 52, c: 58, d: 54, avg: 55 },
  { time: 20, a: 61, b: 57, c: 63, d: 60, avg: 60 },
  { time: 25, a: 65, b: 62, c: 67, d: 64, avg: 65 },
  { time: 30, a: 68, b: 66, c: 71, d: 67, avg: 68 },
  { time: 35, a: 73, b: 72, c: 76, d: 75, avg: 74 },
  { time: 42, a: 78, b: 76, c: 79, d: 77, avg: 78 },
];

export const convergenceMetrics = [
  { key: "convergenceTime", label: "CONVERGENCE TIME", value: "42 sec", hint: "Time from the first distributed information state until the team's agreement level stabilised above 75%." },
  { key: "stateAgreement", label: "STATE AGREEMENT", value: "78%", hint: "Mean agreement across the four participants at the moment shared state was declared reached." },
  { key: "coverage", label: "INFORMATION COVERAGE", value: "84%", hint: "Share of scenario information items that reached at least two participants before the decision." },
  { key: "conflicts", label: "UNRESOLVED CONFLICTS", value: "2", hint: "Information conflicts still open when the team submitted its decision." },
  { key: "decisionLatency", label: "DECISION LATENCY", value: "31 sec", hint: "Time between shared state being declared and the decision being submitted." },
  { key: "recovery", label: "RECOVERY TIME", value: "18 sec", hint: "Time to return to a functioning exchange rate after a communication interruption." },
];

/* --- decision -------------------------------------------------------------- */

export const decisionOptions = [
  {
    id: "A",
    label: "Confirmed information only",
    detail: "Act strictly on items both observers and sensors agree on.",
  },
  {
    id: "B",
    label: "Confirmed + explicitly marked uncertainty",
    detail: "Use confirmed items and carry unresolved items as flagged uncertainty.",
  },
  {
    id: "C",
    label: "Include unresolved reports",
    detail: "Treat unverified reports as usable information for the simulated action.",
  },
  {
    id: "D",
    label: "Request additional information",
    detail: "Hold the simulated action until a further verification cycle completes.",
  },
] as const;

export const decisionReasons = [
  "Information confidence",
  "Source reliability",
  "Recency",
  "Conflict level",
  "Need for additional verification",
] as const;

export const sampleDecision: Decision = {
  id: "dec-001",
  sessionId: "sig-horizon-01",
  choice: "B",
  reason: "Information confidence",
  timestamp: "10:43:12",
  availableInformation: { confirmed: 3, conflicting: 1, unverified: 2, stale: 1 },
};

export const initialDecisionTimeline: TimelineEntry[] = [
  { id: "t1", label: "Scenario started", timestamp: "10:40:00", state: "done" },
  { id: "t2", label: "Information distributed", timestamp: "10:42:08", state: "done" },
  { id: "t3", label: "Communication degraded", timestamp: "10:42:13", state: "done" },
  { id: "t4", label: "Conflict detected", timestamp: "10:42:17", state: "done" },
  { id: "t5", label: "Team discussion", timestamp: "10:42:39", state: "done" },
  { id: "t6", label: "Shared state reconstructed", timestamp: "10:42:50", state: "done" },
  { id: "t7", label: "Decision submitted", timestamp: "10:43:12", state: "done" },
];

/* --- AAR ------------------------------------------------------------------- */

export const aarReport: AARReport = {
  sessionId: "sig-horizon-01",
  duration: "06:12",
  participants: 4,
  commCondition: "DEGRADED",
  convergenceTime: "42 sec",
  decisionLatency: "31 sec",
  whatHappened:
    "Communication degradation caused participant information states to diverge. Each participant held a different subset of the same scenario, so agreement fell to 37% before reconciliation began.",
  whereFailed:
    "The team spent additional time resolving conflicting information. Report C and Report D disagreed for 33 seconds before an explicit reconciliation action was taken, and one stale item was never refreshed.",
  informationRanked: [
    { id: "report-a", label: "Report A", weight: 92, usedInDecision: true },
    { id: "report-b", label: "Report B", weight: 78, usedInDecision: true },
    { id: "sensor-x", label: "Sensor X", weight: 64, usedInDecision: false },
    { id: "report-c", label: "Report C", weight: 47, usedInDecision: false },
    { id: "update-d", label: "Status Update D", weight: 31, usedInDecision: false },
  ],
  behaviour: [
    { key: "sharing", label: "Information Sharing", value: 76 },
    { key: "conflict", label: "Conflict Resolution", value: 54 },
    { key: "convergence", label: "Convergence", value: 78 },
    { key: "timing", label: "Decision Timing", value: 69 },
  ],
};

export const aiInsights: AIInsight[] = [
  {
    id: "i1",
    title: "Delayed information increased convergence time",
    body: "Sensor X arrived 6.4s late for Player B. Players holding late items needed an extra reconciliation round before their state matched the group.",
    category: "pattern",
  },
  {
    id: "i2",
    title: "Confirmed reports reconciled faster than conflicting ones",
    body: "Confirmed items reached team agreement in a median of 11 seconds, while the Report C / Report D pair required 33 seconds and a manual decision.",
    category: "strength",
  },
  {
    id: "i3",
    title: "One stale item remained unresolved at decision time",
    body: "Status Update D was still marked stale when the decision was submitted, so the decision context carried an open information gap.",
    category: "risk",
  },
];

export const nextCondition: NextTrainingCondition = {
  currentLevel: 2,
  nextLevel: 3,
  weakness: "Conflict resolution",
  adjustments: [
    "Increased information inconsistency",
    "Reduced message reliability",
    "Same core scenario",
  ],
};

/* --- analytics (synthetic series) ------------------------------------------ */

export const analyticsSessions = [
  { session: "SIG-H-0412", convergence: 42, agreement: 78, decision: 31, conflicts: 2, coverage: 84, recovery: 18 },
  { session: "ECH-T-0409", convergence: 36, agreement: 83, decision: 24, conflicts: 1, coverage: 88, recovery: 12 },
  { session: "NEX-R-0407", convergence: 51, agreement: 71, decision: 39, conflicts: 3, coverage: 74, recovery: 27 },
  { session: "SIG-H-0403", convergence: 58, agreement: 66, decision: 44, conflicts: 4, coverage: 69, recovery: 33 },
  { session: "ECH-T-0330", convergence: 31, agreement: 88, decision: 21, conflicts: 1, coverage: 91, recovery: 9 },
  { session: "NEX-R-0326", convergence: 47, agreement: 75, decision: 34, conflicts: 2, coverage: 80, recovery: 22 },
];

export const conflictResolutionSeries = [
  { phase: "Detect", automated: 4, manual: 1 },
  { phase: "Discuss", automated: 3, manual: 4 },
  { phase: "Reconcile", automated: 6, manual: 5 },
  { phase: "Close", automated: 5, manual: 6 },
];
