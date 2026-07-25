import type { Rubric } from "@verdikt/shared";

type RawCheck = {
  key?: string;
  label?: string;
  passed?: boolean;
  score?: number;
  rationale?: string;
};

/** Fill missing fields from 0G responses before Zod validation. */
export function normalizeVerdictPayload(
  raw: Record<string, unknown>,
  rubric: Rubric,
  deliverableHash: string
): Record<string, unknown> {
  const rawChecks = Array.isArray(raw.checks) ? (raw.checks as RawCheck[]) : [];

  const checks = rubric.criteria.map((criterion, index) => {
    const existing =
      rawChecks.find((c) => c?.key === criterion.key) ?? rawChecks[index];

    if (existing && typeof existing === "object") {
      return {
        key: criterion.key,
        label: String(existing.label ?? criterion.label ?? criterion.key),
        passed: Boolean(existing.passed),
        score: Number(existing.score ?? 0),
        rationale: String(existing.rationale ?? "No rationale provided"),
      };
    }

    return {
      key: criterion.key,
      label: criterion.label ?? criterion.key,
      passed: false,
      score: 0,
      rationale: "Criterion missing from model response",
    };
  });

  const totalWeight = rubric.criteria.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = Math.round(
    checks.reduce((sum, check, i) => sum + check.score * rubric.criteria[i].weight, 0) /
      totalWeight
  );

  const score = typeof raw.score === "number" ? raw.score : weightedScore;
  const pass = typeof raw.pass === "boolean" ? raw.pass : score >= rubric.minimumScore;

  let recommendedPayoutBps = raw.recommendedPayoutBps;
  if (typeof recommendedPayoutBps !== "number") {
    recommendedPayoutBps = pass
      ? score >= 90
        ? 10000
        : score >= 80
          ? 7500
          : 5000
      : 0;
  }

  const summaryFromChecks = checks
    .map((c) => `${c.label}: ${c.rationale}`)
    .join(" ")
    .slice(0, 800);

  const summary =
    typeof raw.summary === "string" && raw.summary.trim()
      ? raw.summary.trim()
      : summaryFromChecks ||
        `Scored ${score}/100 (minimum ${rubric.minimumScore}).`;

  let confidence: number;
  if (typeof raw.confidence !== "number") {
    confidence = 0.72;
  } else {
    confidence = raw.confidence > 1 ? raw.confidence / 100 : raw.confidence;
  }
  confidence = Math.min(1, Math.max(0, confidence));

  return {
    ...raw,
    pass,
    score,
    recommendedPayoutBps,
    checks,
    summary,
    confidence,
    evidenceHash:
      typeof raw.evidenceHash === "string" ? raw.evidenceHash : deliverableHash,
  };
}
