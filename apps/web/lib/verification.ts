import {
  canonicalHash,
  hashText,
  isHederaConfigured,
  mockHcsPublish,
  mockPayout,
  publishAuditMessage,
  sendHbarPayout,
} from "@verdikt/chain";
import type { AuditMessage, Rubric, Verdict } from "@verdikt/shared";
import { verifyDeliverable } from "@verdikt/verifier";
import { prisma } from "./db";
import { getEnv, isLiveHedera } from "./env";

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
  const taskSpecHash = hashText(job.taskSpec);
  const deliverableHash = hashText(job.deliverableText ?? job.deliverableUrl ?? "");

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

  let hcsTransactionId: string | undefined;
  let hcsTopicId: string | undefined;
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
    },
  });

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

  return { verdict, auditMessage, hcsTransactionId };
}

export async function triggerPayout(jobId: string, recipientAccountId: string) {
  const job = await prisma.verificationJob.findUnique({
    where: { id: jobId },
    include: { verdict: true },
  });
  if (!job?.verdict) throw new Error("Job has no verdict");
  if (!job.verdict.pass) throw new Error("Cannot payout failed verification");

  const payoutBps = job.verdict.recommendedPayoutBps;
  const amountHbar = (payoutBps / 10000) * 1.0; // demo: max 1 HBAR

  const env = getEnv();
  let payoutTransactionId: string;
  let payoutStatus: string;

  if (
    isHederaConfigured({
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
