import { prisma } from "@/lib/db";
import { Shell, Card, Badge, HashBlock, Button } from "@/components/ui";
import {
  AuditFlowVisual,
  PipelineTrack,
  type PipelineStepId,
} from "@/components/flow-visuals";
import { hederaExplorerUrl } from "@verdikt/chain";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { PayoutButton } from "./payout-button";
import { ReviewPanel } from "./review-panel";

export const dynamic = "force-dynamic";

function statusTone(status: string): "success" | "warning" | "danger" | "info" {
  if (status === "completed") return "success";
  if (status === "pending_review") return "warning";
  if (status === "failed") return "danger";
  return "info";
}

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

  const completed: PipelineStepId[] = ["submit"];
  if (job.verdict) completed.push("judge");
  if (
    job.status === "completed" &&
    (job.reviewStatus === "approved" ||
      job.reviewStatus === "overridden" ||
      job.reviewStatus === "rejected" ||
      job.reviewStatus === "auto")
  ) {
    completed.push("review");
  }
  if (job.hcsTransactionId && !job.hcsTransactionId.startsWith("@mock")) {
    completed.push("anchor");
  }
  if (job.payoutTransactionId) completed.push("payout");

  const active: PipelineStepId | undefined =
    job.status === "submitted" || job.status === "running"
      ? "judge"
      : job.status === "pending_review"
        ? "review"
        : job.status === "completed" && job.verdict?.pass && !job.payoutTransactionId
          ? "payout"
          : undefined;

  const showAiBadge = job.verdict && job.status === "pending_review";

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone={statusTone(job.status)}>{job.status.replace("_", " ")}</Badge>
            {job.verdict && job.verdict.reviewSource !== "ai" && job.status === "completed" && (
              <span className="ml-2 inline-block">
                <Badge tone="info">{job.verdict.reviewSource.replace("_", " ")}</Badge>
              </span>
            )}
            <h1 className="mt-3 text-3xl font-bold">{job.title}</h1>
            <p className="mt-1 text-zinc-400">
              {job.clientAgent.displayName} → {job.providerAgent.displayName}
            </p>
          </div>
          <Button href="/dashboard" variant="secondary">Back</Button>
        </div>

        <Card className="mt-6">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Pipeline progress
          </div>
          <PipelineTrack active={active} completed={completed} />
        </Card>

        {job.status === "pending_review" && job.verdict && (
          <div className="mt-6">
            <ReviewPanel
              jobId={job.id}
              aiScore={job.verdict.aiScore ?? job.verdict.score}
              aiPass={job.verdict.aiPass ?? job.verdict.pass}
              aiConfidence={job.verdict.aiConfidence ?? job.verdict.confidence}
              reviewReason={job.reviewNotes}
            />
          </div>
        )}

        {job.verdict && (
          <Card
            className={`mt-8 ${
              job.verdict.pass
                ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent"
                : "border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent"
            }`}
            glow={job.status === "completed"}
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div
                  className={`text-6xl font-bold tabular-nums ${
                    job.verdict.pass ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {job.verdict.score}
                </div>
                <div>
                  {showAiBadge && (
                    <div className="mb-2">
                      <Badge tone="warning">Provisional AI verdict</Badge>
                    </div>
                  )}
                  <Badge tone={job.verdict.pass ? "success" : "danger"}>
                    {job.verdict.pass ? "PASS" : "FAIL"}
                  </Badge>
                  <p className="mt-2 max-w-md text-sm text-zinc-300">{job.verdict.summary}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Payout {job.verdict.recommendedPayoutBps / 100}% · Confidence{" "}
                    {Math.round(job.verdict.confidence * 100)}%
                    {job.verdict.aiScore != null && job.verdict.aiScore !== job.verdict.score && (
                      <> · AI was {job.verdict.aiScore}/100</>
                    )}
                  </p>
                </div>
              </div>
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-200 hover:bg-indigo-500/20"
                >
                  View on HashScan
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {verdictRaw?.checks && (
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {verdictRaw.checks.map((check) => (
                  <div
                    key={check.key}
                    className="rounded-xl border border-white/5 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{check.label}</span>
                      <Badge tone={check.passed ? "success" : "warning"}>
                        {check.score}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {check.rationale}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 font-semibold">Task spec</h2>
            <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">{job.taskSpec}</p>
            <h2 className="mb-3 mt-6 font-semibold">Deliverable</h2>
            <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
              {job.deliverableText ?? job.deliverableUrl ?? "—"}
            </p>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Audit trail</h2>
            {job.status === "pending_review" && (
              <p className="mb-4 text-sm text-amber-200/80">
                HCS anchor runs after human review — final verdict only.
              </p>
            )}
            <AuditFlowVisual
              hasVerdict={Boolean(job.verdictHash)}
              hasHcs={Boolean(job.hcsTransactionId && !job.hcsTransactionId.startsWith("@mock"))}
              hasPayout={Boolean(job.payoutTransactionId)}
            />
            <div className="mt-5 grid gap-3">
              <HashBlock label="Task hash" value={job.taskSpecHash} />
              <HashBlock label="Deliverable hash" value={job.deliverableHash} />
              <HashBlock label="Verdict hash" value={job.verdictHash} />
              <HashBlock label="HCS transaction" value={job.hcsTransactionId} />
            </div>
            {!job.verdict && (
              <p className="mt-4 text-sm text-zinc-400">Verification pending…</p>
            )}
          </Card>
        </div>

        {job.status === "completed" && job.verdict?.pass && (
          <Card className="mt-6">
            <h2 className="mb-2 font-semibold">Payout</h2>
            {job.payoutTransactionId ? (
              <div className="text-sm text-zinc-300">
                <Badge tone="success">Sent</Badge>
                <div className="mt-2 font-mono text-xs">{job.payoutTransactionId}</div>
                <div className="mt-1">{job.payoutAmountHbar} HBAR on Hedera testnet</div>
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
