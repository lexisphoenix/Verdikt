import { describe, expect, it } from "vitest";
import { buildJudgePrompt } from "./prompts";
import { verifyDeliverable } from "./verify";
import { DEFAULT_RUBRIC, DEMO_DELIVERABLE, DEMO_TASK_SPEC } from "@verdikt/shared";

describe("verifier", () => {
  it("builds stable prompts", () => {
    const a = buildJudgePrompt(DEMO_TASK_SPEC, DEFAULT_RUBRIC, DEMO_DELIVERABLE);
    const b = buildJudgePrompt(DEMO_TASK_SPEC, DEFAULT_RUBRIC, DEMO_DELIVERABLE);
    expect(a).toBe(b);
  });

  it("mock verifier returns structured verdict", async () => {
    const verdict = await verifyDeliverable(
      {
        taskSpec: DEMO_TASK_SPEC,
        rubric: DEFAULT_RUBRIC,
        deliverableText: DEMO_DELIVERABLE,
      },
      { mode: "mock" }
    );
    expect(verdict.score).toBeGreaterThan(0);
    expect(verdict.checks.length).toBe(DEFAULT_RUBRIC.criteria.length);
    expect(verdict.evidenceHash).toMatch(/^0x[a-f0-9]{64}$/);
  });
});
