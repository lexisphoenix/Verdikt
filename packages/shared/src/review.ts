import type { Rubric, Verdict } from "./schemas";

/** Confidence below this triggers human review. */
export const REVIEW_CONFIDENCE_THRESHOLD = 0.75;

/** Score within this many points of minimumScore is borderline. */
export const REVIEW_BORDERLINE_POINTS = 8;

export function needsHumanReview(
  verdict: Pick<Verdict, "score" | "confidence" | "pass">,
  rubric: Pick<Rubric, "minimumScore">
): boolean {
  if (verdict.confidence < REVIEW_CONFIDENCE_THRESHOLD) return true;

  const distance = Math.abs(verdict.score - rubric.minimumScore);
  if (distance <= REVIEW_BORDERLINE_POINTS) return true;

  return false;
}

export function humanReviewReason(
  verdict: Pick<Verdict, "score" | "confidence" | "pass">,
  rubric: Pick<Rubric, "minimumScore">
): string {
  const reasons: string[] = [];
  if (verdict.confidence < REVIEW_CONFIDENCE_THRESHOLD) {
    reasons.push(
      `low confidence (${Math.round(verdict.confidence * 100)}% < ${Math.round(REVIEW_CONFIDENCE_THRESHOLD * 100)}%)`
    );
  }
  const distance = Math.abs(verdict.score - rubric.minimumScore);
  if (distance <= REVIEW_BORDERLINE_POINTS) {
    reasons.push(
      `borderline score (${verdict.score} vs minimum ${rubric.minimumScore})`
    );
  }
  return reasons.join("; ") || "manual review required";
}
