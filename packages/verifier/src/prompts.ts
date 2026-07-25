import type { Rubric } from "@verdikt/shared";

export function buildJudgePrompt(
  taskSpec: string,
  rubric: Rubric,
  deliverable: string
): string {
  const criteriaLines = rubric.criteria
    .map((c) => `- ${c.key} (weight ${c.weight}): ${c.label ?? c.key}`)
    .join("\n");

  return `You are a deterministic verification engine for agent-delivered work.
Evaluate the deliverable ONLY against the task spec and rubric below.
Do not invent criteria. Return valid JSON only — escape double quotes inside strings, no trailing commas, no markdown fences.

TASK SPEC:
${taskSpec}

RUBRIC (minimum score to pass: ${rubric.minimumScore}):
${criteriaLines}

DELIVERABLE:
${deliverable}

OUTPUT SCHEMA (JSON):
{
  "pass": boolean,
  "score": number (0-100),
  "recommendedPayoutBps": number (0-10000, 10000 = 100%),
  "checks": [{"key": string, "label": string, "passed": boolean, "score": number, "rationale": string}],
  "summary": string,
  "confidence": number (0-1),
  "evidenceHash": string (sha256 hex of deliverable, prefix with 0x)
}`;
}

export function normalizeDeliverable(text?: string, url?: string): string {
  if (text?.trim()) return text.trim();
  if (url?.trim()) return `[Deliverable URL: ${url.trim()}]`;
  throw new Error("Deliverable text or URL required");
}
