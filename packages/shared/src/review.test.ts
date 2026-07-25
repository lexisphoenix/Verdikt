import { describe, expect, it } from "vitest";
import { needsHumanReview, humanReviewReason } from "./review";

describe("needsHumanReview", () => {
  const rubric = { minimumScore: 75 };

  it("flags low confidence", () => {
    expect(
      needsHumanReview({ score: 90, confidence: 0.6, pass: true }, rubric)
    ).toBe(true);
  });

  it("flags borderline pass", () => {
    expect(
      needsHumanReview({ score: 78, confidence: 0.9, pass: true }, rubric)
    ).toBe(true);
  });

  it("flags borderline fail", () => {
    expect(
      needsHumanReview({ score: 72, confidence: 0.9, pass: false }, rubric)
    ).toBe(true);
  });

  it("auto-completes clear pass", () => {
    expect(
      needsHumanReview({ score: 92, confidence: 0.88, pass: true }, rubric)
    ).toBe(false);
  });

  it("auto-completes clear fail", () => {
    expect(
      needsHumanReview({ score: 55, confidence: 0.85, pass: false }, rubric)
    ).toBe(false);
  });
});

describe("humanReviewReason", () => {
  it("describes why review is needed", () => {
    const reason = humanReviewReason(
      { score: 76, confidence: 0.7, pass: true },
      { minimumScore: 75 }
    );
    expect(reason).toContain("confidence");
    expect(reason).toContain("borderline");
  });
});
