import type { Rubric } from "./schemas";
import {
  DEFAULT_RUBRIC,
  DEMO_DELIVERABLE,
  DEMO_TASK_SPEC,
} from "./schemas";

export type DemoPresetId =
  | "vpn-pass"
  | "incident-pass"
  | "incident-borderline"
  | "incident-fail";

export interface DemoPreset {
  id: DemoPresetId;
  label: string;
  description: string;
  title: string;
  taskSpec: string;
  deliverableText: string;
  rubric: Rubric;
  expected: string;
}

const INCIDENT_TASK_SPEC = `Write a public status page update for a 45-minute API outage on our payment API.
Must include: (1) what happened at a high level, (2) user impact, (3) current status,
(4) ETA or next update time. Professional apology tone. Max 150 words.`;

const INCIDENT_RUBRIC: Rubric = {
  minimumScore: 75,
  criteria: [
    { key: "completeness", weight: 35, label: "All required sections present" },
    { key: "accuracy", weight: 35, label: "Technically plausible and precise" },
    { key: "tone", weight: 30, label: "Professional apology, not defensive" },
  ],
};

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "vpn-pass",
    label: "VPN copy",
    description: "Marketing hero — clear pass, auto-completes",
    title: "VPN hero copy review",
    taskSpec: DEMO_TASK_SPEC,
    deliverableText: DEMO_DELIVERABLE,
    rubric: DEFAULT_RUBRIC,
    expected: "PASS → HCS anchor → optional payout",
  },
  {
    id: "incident-pass",
    label: "Incident update",
    description: "Status page post-mortem — strong pass",
    title: "API outage status update",
    taskSpec: INCIDENT_TASK_SPEC,
    deliverableText: `Incident summary — Payment API degradation (14:02–14:47 UTC)

What happened: A misconfigured rate limiter on our checkout service caused elevated 503 errors for roughly 12% of payment requests.

User impact: Some customers saw failed checkouts or delayed confirmations during the window. No funds were lost; all pending transactions reconciled successfully.

Current status: Systems are fully operational. We deployed a fix and added monitoring alerts.

Next update: A full post-mortem will be published within 48 hours. We apologize for the disruption and appreciate your patience.`,
    rubric: INCIDENT_RUBRIC,
    expected: "PASS → different rubric criteria",
  },
  {
    id: "incident-borderline",
    label: "Borderline appeal",
    description: "Strong VPN copy vs strict rubric — triggers human review",
    title: "VPN hero copy (borderline)",
    taskSpec: DEMO_TASK_SPEC,
    deliverableText: DEMO_DELIVERABLE,
    rubric: { ...DEFAULT_RUBRIC, minimumScore: 95 },
    expected: "pending_review → approve / override / reject",
  },
  {
    id: "incident-fail",
    label: "Failed deliverable",
    description: "Too thin — should fail rubric",
    title: "API outage status update (fail)",
    taskSpec: INCIDENT_TASK_SPEC,
    deliverableText: `Sorry about the downtime. We're looking into it and will fix things soon.
Our team is great and we rarely have issues. Stay tuned!`,
    rubric: INCIDENT_RUBRIC,
    expected: "FAIL → no payout",
  },
];

export const DEFAULT_DEMO_PRESET = DEMO_PRESETS[0];

export function getDemoPreset(id: DemoPresetId): DemoPreset {
  const preset = DEMO_PRESETS.find((p) => p.id === id);
  if (!preset) throw new Error(`Unknown demo preset: ${id}`);
  return preset;
}
