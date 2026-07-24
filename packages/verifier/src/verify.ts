import { createHash } from "crypto";
import type { Rubric, Verdict } from "@verdikt/shared";
import { VerdictSchema } from "@verdikt/shared";
import { buildJudgePrompt, normalizeDeliverable } from "./prompts";

export type VerifierMode = "mock" | "live" | "openai";

export interface VerifyInput {
  taskSpec: string;
  rubric: Rubric;
  deliverableText?: string;
  deliverableUrl?: string;
}

export interface VerifierConfig {
  mode: VerifierMode;
  zeroGApiKey?: string;
  zeroGBaseUrl?: string;
  zeroGModel?: string;
  openaiApiKey?: string;
}

function hashContent(content: string): string {
  return "0x" + createHash("sha256").update(content, "utf8").digest("hex");
}

function scoreDeliverableHeuristic(
  taskSpec: string,
  rubric: Rubric,
  deliverable: string
): Verdict {
  const words = deliverable.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = deliverable.toLowerCase();
  const taskLower = taskSpec.toLowerCase();

  const checks = rubric.criteria.map((criterion) => {
    let score = 70;
    let rationale = "Baseline heuristic evaluation";

    if (criterion.key === "clarity") {
      const avgWordLen =
        words.reduce((s, w) => s + w.length, 0) / Math.max(wordCount, 1);
      score = avgWordLen < 8 && wordCount >= 15 ? 88 : wordCount >= 10 ? 75 : 55;
      rationale =
        score >= 75
          ? "Copy is concise and readable"
          : "Copy may be too short or dense";
    } else if (criterion.key === "accuracy" || criterion.key === "privacy-positioning") {
      const privacyTerms = ["privacy", "encrypt", "secure", "vpn", "track", "log"];
      const hits = privacyTerms.filter((t) => lower.includes(t)).length;
      score = Math.min(95, 60 + hits * 8);
      rationale = `Found ${hits} relevant domain terms`;
    } else if (criterion.key === "tone" || criterion.key === "brand-tone") {
      score = /[!?]/.test(deliverable) ? 72 : 82;
      rationale = "Tone assessed from punctuation and phrasing";
    } else {
      const specTokens = taskLower.split(/\W+/).filter((t) => t.length > 4);
      const overlap = specTokens.filter((t) => lower.includes(t)).length;
      score = Math.min(90, 55 + overlap * 10);
      rationale = `Task alignment score based on ${overlap} keyword overlaps`;
    }

    return {
      key: criterion.key,
      label: criterion.label ?? criterion.key,
      passed: score >= rubric.minimumScore * 0.85,
      score,
      rationale,
    };
  });

  const totalWeight = rubric.criteria.reduce((s, c) => s + c.weight, 0);
  const weightedScore = Math.round(
    checks.reduce((s, c, i) => s + c.score * rubric.criteria[i].weight, 0) /
      totalWeight
  );
  const pass = weightedScore >= rubric.minimumScore;

  return {
    pass,
    score: weightedScore,
    recommendedPayoutBps: pass
      ? weightedScore >= 90
        ? 10000
        : weightedScore >= 80
          ? 7500
          : 5000
      : 0,
    checks,
    summary: pass
      ? `Deliverable meets spec with score ${weightedScore}/100 (mock verifier).`
      : `Deliverable below minimum ${rubric.minimumScore} with score ${weightedScore}/100.`,
    confidence: 0.78,
    evidenceHash: hashContent(deliverable),
  };
}

async function runLiveVerifier(
  config: VerifierConfig,
  prompt: string
): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({
    apiKey: config.zeroGApiKey,
    baseURL: config.zeroGBaseUrl,
  });
  const response = await client.chat.completions.create({
    model: config.zeroGModel ?? "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  return response.choices[0]?.message?.content ?? "{}";
}

async function runOpenAIVerifier(
  config: VerifierConfig,
  prompt: string
): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: config.openaiApiKey });
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  return response.choices[0]?.message?.content ?? "{}";
}

export async function verifyDeliverable(
  input: VerifyInput,
  config: VerifierConfig
): Promise<Verdict> {
  const deliverable = normalizeDeliverable(
    input.deliverableText,
    input.deliverableUrl
  );

  if (config.mode === "mock") {
    return scoreDeliverableHeuristic(input.taskSpec, input.rubric, deliverable);
  }

  const prompt = buildJudgePrompt(input.taskSpec, input.rubric, deliverable);
  let raw: string;

  if (config.mode === "live") {
    if (!config.zeroGApiKey || !config.zeroGBaseUrl) {
      throw new Error("0G credentials required for live verifier mode");
    }
    raw = await runLiveVerifier(config, prompt);
  } else {
    if (!config.openaiApiKey) {
      throw new Error("OpenAI API key required for openai verifier mode");
    }
    raw = await runOpenAIVerifier(config, prompt);
  }

  const parsed = JSON.parse(raw);
  if (!parsed.evidenceHash) {
    parsed.evidenceHash = hashContent(deliverable);
  }
  return VerdictSchema.parse(parsed);
}

export { hashContent };
