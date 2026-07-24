import { describe, expect, it } from "vitest";
import { canonicalHash, hashText } from "./hashing";
import { mockEnsProfile } from "./ens";
import { mockHcsPublish } from "./hedera";

describe("chain", () => {
  it("produces stable hashes", () => {
    const a = hashText("hello");
    const b = hashText("hello");
    expect(a).toBe(b);
    expect(a).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it("canonical hash is deterministic", () => {
    const payload = { b: 2, a: 1 };
    expect(canonicalHash(payload)).toBe(canonicalHash({ a: 1, b: 2 }));
  });

  it("mock HCS publish returns success", () => {
    const result = mockHcsPublish({
      jobId: "j1",
      taskSpecHash: "0x1",
      deliverableHash: "0x2",
      verdictHash: "0x3",
      score: 80,
      pass: true,
      recommendedPayoutBps: 10000,
      timestamp: new Date().toISOString(),
    });
    expect(result.status).toBe("SUCCESS");
  });

  it("mock ENS profile has agent fields", () => {
    const profile = mockEnsProfile("verifier.verdikt.eth");
    expect(profile.agentContext).toContain("Verdikt");
    expect(profile.endpointHttps).toContain("/api/verify");
  });
});
