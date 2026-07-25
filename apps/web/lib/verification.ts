import {
  canonicalHash,
  hashText,
  isHederaOperatorConfigured,
  mockHcsPublish,
  mockPayout,
  publishAuditMessage,
  sendHbarPayout,
} from "@verdikt/chain";
import type { AuditMessage, Rubric, Verdict } from "@verdikt/shared";
import { humanReviewReason, needsHumanReview } from "@verdikt/shared";
import { verifyDeliverable } from "@verdikt/verifier";
import { prisma } from "./db";
import { getEnv, isLiveHedera } from "./env";

export type ReviewAction = "approve" | "override" | "reject";

async function publishFinalVerdictToHcs(
  jobId: string,
  job: {
    taskSpec: string;
    deliverableText: string | null;
    deliverableUrl: string | null;
  },
  verdict: Verdict
) {
  const env = getEnv();
  const taskSpecHash = hashText(job.taskSpec);
  const deliverableHash = hashText(job.deliverableText ?? job.deliverableUrl ?? "");
  const verdictHash = canonicalHash(verdict);

  const auditMessage: AuditMessage = {
    jobId,
    taskSpecHash,
    deliverableHash,
    verdictHash,
    score: verdict.score,
    pass: verdict.pass,
    recommendedPayoutBps: verdict.recommendedPayoutBps,
    timestamp: new Date().toISOString(),
  };

  let hcsTransactionId: string;
  let hcsTopicId: string;
  let hcsSequenceNumber: number | undefined;

  if (isLiveHedera()) {
    const result = await publishAuditMessage(
      {
        accountId: env.HEDERA_ACCOUNT_ID!,
        privateKey: env.HEDERA_PRIVATE_KEY!,
        network: env.HEDERA_NETWORK,
        topicId: env.HEDERA_HCS_TOPIC_ID,
      },
      auditMessage
    );
    hcsTransactionId = result.transactionId;
    hcsTopicId = result.topicId;
    hcsSequenceNumber = result.sequenceNumber;
  } else {
    const mock = mockHcsPublish(auditMessage);
    hcsTransactionId = mock.transactionId;
    hcsTopicId = mock.topicId;
    hcsSequenceNumber = mock.sequenceNumber;
  }

  await prisma.verificationJob.update({
    where: { id: jobId },
    data: {
      status: "completed",
      taskSpecHash,
      deliverableHash,
      verdictHash,
      hcsTopicId,
      hcsTransactionId,
      hcsSequenceNumber,
    },
  });

  return { auditMessage, hcsTransactionId, verdictHash, taskSpecHash, deliverableHash };
}

export async function runVerificationPipeline(jobId: string) {
  const job = await prisma.verificationJob.findUnique({
    where: { id: jobId },
    include: { clientAgent: true, providerAgent: true },
  });
  if (!job) throw new Error("Job not found");

  await prisma.verificationJob.update({
    where: { id: jobId },
    data: { status: "running" },
  });

  const env = getEnv();
  const rubric = JSON.parse(job.rubricJson) as Rubric;

  const verdict = await verifyDeliverable(
    {
      taskSpec: job.taskSpec,
      rubric,
      deliverableText: job.deliverableText ?? undefined,
      deliverableUrl: job.deliverableUrl ?? undefined,
    },
    {
      mode: env.VERIFIER_MODE,
      zeroGApiKey: env.ZERO_G_API_KEY,
      zeroGBaseUrl: env.ZERO_G_BASE_URL,
      zeroGModel: env.ZERO_G_MODEL,
      openaiApiKey: env.OPENAI_API_KEY,
    }
  );

  const requiresReview = needsHumanReview(verdict, rubric);
  const reviewReason = requiresReview ? humanReviewReason(verdict, rubric) : null;

  await prisma.verdict.create({
    data: {
      verificationJobId: jobId,
      pass: verdict.pass,
      score: verdict.score,
      recommendedPayoutBps: verdict.recommendedPayoutBps,
      summary: verdict.summary,
      confidence: verdict.confidence,
      rawJson: JSON.stringify(verdict),
      verifierSignature: verdict.verifierSignature,
      aiPass: verdict.pass,
      aiScore: verdict.score,
      aiConfidence: verdict.confidence,
      aiRawJson: JSON.stringify(verdict),
      reviewSource: "ai",
    },
  });

  if (requiresReview) {
    await prisma.verificationJob.update({
      where: { id: jobId },
      data: {
        status: "pending_review",
        reviewStatus: "pending",
        reviewNotes: reviewReason,
      },
    });
    return { verdict, pendingReview: true, reviewReason };
  }

  await prisma.verificationJob.update({
    where: { id: jobId },
    data: {
      reviewStatus: "auto",
      reviewNotes: "Clear score and confidence — auto-approved",
    },
  });

  const hcs = await publishFinalVerdictToHcs(jobId, job, verdict);
  return { verdict, pendingReview: false, ...hcs };
}

export async function submitHumanReview(
  jobId: string,
  action: ReviewAction,
  input?: { notes?: string; pass?: boolean; score?: number }
) {
  const job = await prisma.verificationJob.findUnique({
    where: { id: jobId },
    include: { verdict: true },
  });
  if (!job?.verdict) throw new Error("Job has no AI verdict");
  if (job.status !== "pending_review") {
    throw new Error("Job is not awaiting human review");
  }

  const aiSnapshot = JSON.parse(job.verdict.aiRawJson ?? job.verdict.rawJson) as Verdict;
  let finalVerdict: Verdict = { ...aiSnapshot };
  let reviewStatus: string;
  let reviewSource: string;

  if (action === "approve") {
    reviewStatus = "approved";
    reviewSource = "human_confirmed";
  } else if (action === "reject") {
    finalVerdict = {
      ...aiSnapshot,
      pass: false,
      recommendedPayoutBps: 0,
      summary: `Human review rejected. AI summary: ${aiSnapshot.summary}`,
    };
    reviewStatus = "rejected";
    reviewSource = "human_override";
  } else {
    const pass = input?.pass ?? aiSnapshot.pass;
    const score = input?.score ?? aiSnapshot.score;
    finalVerdict = {
      ...aiSnapshot,
      pass,
      score,
      recommendedPayoutBps: pass
        ? score >= 90
          ? 10000
          : score >= 80
            ? 7500
            : 5000
        : 0,
      summary: `Human override (AI score ${job.verdict.aiScore}). ${input?.notes ?? ""}`.trim(),
    };
    reviewStatus = "overridden";
    reviewSource = "human_override";
  }

  const notes = [job.reviewNotes, input?.notes].filter(Boolean).join(" · ");

  await prisma.verdict.update({
    where: { id: job.verdict.id },
    data: {
      pass: finalVerdict.pass,
      score: finalVerdict.score,
      recommendedPayoutBps: finalVerdict.recommendedPayoutBps,
      summary: finalVerdict.summary,
      confidence: job.verdict.aiConfidence ?? job.verdict.confidence,
      rawJson: JSON.stringify(finalVerdict),
      reviewSource,
    },
  });

  await prisma.verificationJob.update({
    where: { id: jobId },
    data: {
      reviewStatus,
      reviewNotes: notes || null,
      reviewedAt: new Date(),
    },
  });

  const hcs = await publishFinalVerdictToHcs(jobId, job, finalVerdict);
  return { verdict: finalVerdict, reviewStatus, ...hcs };
}

export async function triggerPayout(jobId: string, recipientAccountId: string) {
  const job = await prisma.verificationJob.findUnique({
    where: { id: jobId },
    include: { verdict: true },
  });
  if (!job?.verdict) throw new Error("Job has no verdict");
  if (job.status !== "completed") {
    throw new Error("Payout requires a finalized verdict on Hedera");
  }
  if (!job.hcsTransactionId || job.hcsTransactionId.startsWith("@mock")) {
    throw new Error("Payout requires a published HCS audit message");
  }
  if (!job.verdict.pass) throw new Error("Cannot payout failed verification");

  const payoutBps = job.verdict.recommendedPayoutBps;
  const amountHbar = (payoutBps / 10000) * 1.0; // demo: max 1 HBAR

  const env = getEnv();
  let payoutTransactionId: string;
  let payoutStatus: string;

  if (
    isHederaOperatorConfigured({
      accountId: env.HEDERA_ACCOUNT_ID,
      privateKey: env.HEDERA_PRIVATE_KEY,
      network: env.HEDERA_NETWORK,
    })
  ) {
    const result = await sendHbarPayout(
      {
        accountId: env.HEDERA_ACCOUNT_ID!,
        privateKey: env.HEDERA_PRIVATE_KEY!,
        network: env.HEDERA_NETWORK,
      },
      recipientAccountId,
      amountHbar
    );
    payoutTransactionId = result.transactionId;
    payoutStatus = result.status;
  } else {
    const mock = mockPayout(recipientAccountId, amountHbar);
    payoutTransactionId = mock.transactionId;
    payoutStatus = mock.status;
  }

  await prisma.verificationJob.update({
    where: { id: jobId },
    data: {
      payoutTransactionId,
      payoutAmountHbar: amountHbar,
      payoutStatus,
    },
  });

  return { payoutTransactionId, payoutAmountHbar: amountHbar, payoutStatus };
}

export function formatVerdict(raw: string): Verdict {
  return JSON.parse(raw) as Verdict;
}
