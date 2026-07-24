import { describe, expect, it } from "vitest";
import {
  VerifyRequestSchema,
  VerdictSchema,
  RegisterAgentSchema,
} from "./schemas";

describe("schemas", () => {
  it("validates verify request", () => {
    const result = VerifyRequestSchema.safeParse({
      clientAgentId: "c1",
      providerAgentId: "p1",
      title: "Copy review",
      taskSpec: "Write hero copy",
      rubric: {
        criteria: [{ key: "clarity", weight: 100 }],
        minimumScore: 70,
      },
      deliverableText: "Hello world",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid wallet", () => {
    const result = RegisterAgentSchema.safeParse({
      walletAddress: "not-a-wallet",
      displayName: "Test",
      role: "client",
    });
    expect(result.success).toBe(false);
  });

  it("validates verdict shape", () => {
    const result = VerdictSchema.safeParse({
      pass: true,
      score: 85,
      recommendedPayoutBps: 10000,
      checks: [
        {
          key: "clarity",
          label: "Clarity",
          passed: true,
          score: 90,
          rationale: "Clear messaging",
        },
      ],
      summary: "Good deliverable",
      confidence: 0.92,
      evidenceHash: "0xabc",
    });
    expect(result.success).toBe(true);
  });
});
