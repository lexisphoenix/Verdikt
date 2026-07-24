import { z } from "zod";

export const AgentRoleSchema = z.enum(["client", "provider", "verifier"]);

export const AgentSchema = z.object({
  id: z.string(),
  ensName: z.string().optional().nullable(),
  walletAddress: z.string(),
  displayName: z.string(),
  role: AgentRoleSchema,
  endpointUrl: z.string().optional().nullable(),
  agentContext: z.string().optional().nullable(),
  reputationScore: z.number().optional().nullable(),
  createdAt: z.string(),
});

export const RubricCriterionSchema = z.object({
  key: z.string(),
  weight: z.number().min(0).max(100),
  label: z.string().optional(),
});

export const RubricSchema = z.object({
  criteria: z.array(RubricCriterionSchema).min(1),
  minimumScore: z.number().min(0).max(100).default(75),
});

export const VerdictCheckSchema = z.object({
  key: z.string(),
  label: z.string(),
  passed: z.boolean(),
  score: z.number(),
  rationale: z.string(),
});

export const VerdictSchema = z.object({
  pass: z.boolean(),
  score: z.number().min(0).max(100),
  recommendedPayoutBps: z.number().min(0).max(10000),
  checks: z.array(VerdictCheckSchema),
  summary: z.string(),
  confidence: z.number().min(0).max(1),
  evidenceHash: z.string(),
  verifierSignature: z.string().optional(),
});

export const VerifyRequestSchema = z.object({
  clientAgentId: z.string(),
  providerAgentId: z.string(),
  title: z.string().min(1),
  taskSpec: z.string().min(1),
  rubric: RubricSchema,
  deliverableText: z.string().optional(),
  deliverableUrl: z.string().url().optional(),
  runVerification: z.boolean().default(true),
});

export const RegisterAgentSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  displayName: z.string().min(1),
  role: AgentRoleSchema,
  ensName: z.string().optional(),
  endpointUrl: z.string().url().optional(),
  agentContext: z.string().optional(),
});

export const AuditMessageSchema = z.object({
  jobId: z.string(),
  taskSpecHash: z.string(),
  deliverableHash: z.string(),
  verdictHash: z.string(),
  score: z.number(),
  pass: z.boolean(),
  recommendedPayoutBps: z.number(),
  timestamp: z.string(),
});

export type Agent = z.infer<typeof AgentSchema>;
export type AgentRole = z.infer<typeof AgentRoleSchema>;
export type Rubric = z.infer<typeof RubricSchema>;
export type Verdict = z.infer<typeof VerdictSchema>;
export type VerifyRequest = z.infer<typeof VerifyRequestSchema>;
export type RegisterAgentRequest = z.infer<typeof RegisterAgentSchema>;
export type AuditMessage = z.infer<typeof AuditMessageSchema>;

export const DEFAULT_RUBRIC: Rubric = {
  criteria: [
    { key: "clarity", weight: 40, label: "Clarity" },
    { key: "accuracy", weight: 35, label: "Accuracy" },
    { key: "tone", weight: 25, label: "Brand tone" },
  ],
  minimumScore: 75,
};

export const DEMO_DELIVERABLE = `Your privacy matters. Our VPN encrypts every byte of your traffic with military-grade AES-256, so your browsing stays invisible — even on public Wi-Fi. No logs. No tracking. Just freedom.`;

export const DEMO_TASK_SPEC =
  "Write hero copy for a VPN landing page focused on privacy, clarity, and trust. Keep it under 80 words.";
