import { describe, expect, it } from "vitest";
import { DEFAULT_RUBRIC } from "@verdikt/shared";
import { normalizeVerdictPayload } from "./normalize-verdict";

describe("normalizeVerdictPayload", () => {
  it("fills missing summary and confidence", () => {
    const result = normalizeVerdictPayload(
      {
        pass: true,
        score: 88,
        recommendedPayoutBps: 7500,
        checks: [
          {
            key: "clarity",
            label: "Clarity",
            passed: true,
            score: 90,
            rationale: "Clear copy",
          },
        ],
      },
      DEFAULT_RUBRIC,
      "0xabc"
    );

    expect(result.summary).toBeTypeOf("string");
    expect(result.confidence).toBe(0.72);
    expect(result.evidenceHash).toBe("0xabc");
  });

  it("normalizes confidence percentages", () => {
    const result = normalizeVerdictPayload(
      { pass: false, score: 40, checks: [] },
      DEFAULT_RUBRIC,
      "0xabc"
    );

    expect(result.confidence).toBe(0.72);
  });
});
