import { prisma } from "@/lib/db";
import { Shell, Card, Badge, HashBlock, Button } from "@/components/ui";
import { hederaExplorerUrl } from "@verdikt/chain";
import { notFound } from "next/navigation";
import { PayoutButton } from "./payout-button";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.verificationJob.findUnique({
    where: { id },
    include: { verdict: true, clientAgent: true, providerAgent: true },
  });

  if (!job) notFound();

  const verdictRaw = job.verdict?.rawJson
    ? (JSON.parse(job.verdict.rawJson) as {
        checks: Array<{ key: string; label: string; passed: boolean; score: number; rationale: string }>;
      })
    : null;

  const explorerUrl = job.hcsTransactionId?.startsWith("@mock")
    ? null
    : job.hcsTransactionId
      ? hederaExplorerUrl(job.hcsTransactionId)
      : null;

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone={job.status === "completed" ? "success" : "info"}>{job.status}</Badge>
            <h1 className="mt-3 text-3xl font-bold">{job.title}</h1>
            <p className="mt-1 text-zinc-400">
              {job.clientAgent.displayName} → {job.providerAgent.displayName}
            </p>
          </div>
          <Button href="/dashboard" variant="secondary">Back</Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 font-semibold">Task spec</h2>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{job.taskSpec}</p>
            <h2 className="mb-3 mt-6 font-semibold">Deliverable</h2>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap">
              {job.deliverableText ?? job.deliverableUrl ?? "—"}
            </p>
          </Card>

          <Card glow={Boolean(job.verdict?.pass)}>
            <h2 className="mb-4 font-semibold">Verdict</h2>
            {job.verdict ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold">{job.verdict.score}</div>
                  <div>
                    <Badge tone={job.verdict.pass ? "success" : "danger"}>
                      {job.verdict.pass ? "PASS" : "FAIL"}
                    </Badge>
                    <div className="mt-2 text-sm text-zinc-400">
                      Payout: {job.verdict.recommendedPayoutBps / 100}% · Confidence{" "}
                      {Math.round(job.verdict.confidence * 100)}%
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-300">{job.verdict.summary}</p>
                {verdictRaw?.checks && (
                  <div className="mt-6 space-y-3">
                    {verdictRaw.checks.map((check) => (
                      <div
                        key={check.key}
                        className="rounded-xl border border-white/5 bg-black/20 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{check.label}</span>
                          <Badge tone={check.passed ? "success" : "warning"}>
                            {check.score}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">{check.rationale}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-zinc-400">Verification pending...</p>
            )}
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="mb-4 font-semibold">Audit trail</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <HashBlock label="Task hash" value={job.taskSpecHash} />
            <HashBlock label="Deliverable hash" value={job.deliverableHash} />
            <HashBlock label="Verdict hash" value={job.verdictHash} />
            <HashBlock label="HCS transaction" value={job.hcsTransactionId} />
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-indigo-300 hover:underline"
            >
              View on HashScan →
            </a>
          )}
        </Card>

        {job.verdict?.pass && (
          <Card className="mt-6">
            <h2 className="mb-2 font-semibold">Payout</h2>
            {job.payoutTransactionId ? (
              <div className="text-sm text-zinc-300">
                <div>Status: {job.payoutStatus}</div>
                <div className="mt-1 font-mono text-xs">{job.payoutTransactionId}</div>
                <div className="mt-1">Amount: {job.payoutAmountHbar} HBAR</div>
              </div>
            ) : (
              <PayoutButton jobId={job.id} />
            )}
          </Card>
        )}
      </div>
    </Shell>
  );
}
