import clsx from "clsx";
import { ArrowRight, Bot, Wallet } from "lucide-react";
import {
  DEMO_JOB_BUDGET_HBAR,
  payoutAmountFromBps,
  payoutPercentFromBps,
} from "@/lib/demo-payout";

function MeterBar({
  value,
  max = 100,
  tone = "indigo",
  striped,
}: {
  value: number;
  max?: number;
  tone?: "indigo" | "emerald" | "amber" | "rose";
  striped?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fill = {
    indigo: "bg-indigo-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
  }[tone];

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-700 ease-out",
          fill,
          striped && "bg-[length:8px_8px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function VerdictPayoutVisual({
  score,
  pass,
  confidence,
  recommendedPayoutBps,
  providerName,
  clientName,
  provisional,
  paidAmountHbar,
  paid,
}: {
  score: number;
  pass: boolean;
  confidence: number;
  recommendedPayoutBps: number;
  providerName: string;
  clientName: string;
  provisional?: boolean;
  paidAmountHbar?: number | null;
  paid?: boolean;
}) {
  const payoutPct = payoutPercentFromBps(recommendedPayoutBps);
  const payoutHbar = paidAmountHbar ?? payoutAmountFromBps(recommendedPayoutBps);
  const confidencePct = Math.round(confidence * 100);
  const confidenceTone =
    confidencePct >= 75 ? "emerald" : confidencePct >= 50 ? "amber" : "rose";

  return (
    <div className="mt-8 space-y-6 border-t border-white/10 pt-8">
      {/* Quality + confidence */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-zinc-300">Work quality</span>
            <span className="tabular-nums text-sm text-zinc-400">
              <span className={pass ? "text-emerald-300" : "text-rose-300"}>{score}</span>
              /100
            </span>
          </div>
          <MeterBar value={score} tone={pass ? "emerald" : "rose"} />
          <p className="mt-1.5 text-xs text-zinc-500">
            {pass ? "Meets the client rubric" : "Below minimum — no payment"}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-zinc-300">AI confidence</span>
            <span className="tabular-nums text-sm text-zinc-400">{confidencePct}%</span>
          </div>
          <MeterBar value={confidencePct} tone={confidenceTone} />
          <p className="mt-1.5 text-xs text-zinc-500">
            How sure the judge is — low confidence triggers human review
          </p>
        </div>
      </div>

      {/* Payout for quality */}
      <div
        className={clsx(
          "rounded-xl border p-5",
          pass
            ? "border-emerald-500/25 bg-emerald-500/5"
            : "border-white/10 bg-black/20"
        )}
      >
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-emerald-300" />
          <span className="text-sm font-semibold text-zinc-200">
            Pay for quality
            {provisional && (
              <span className="ml-2 text-xs font-normal text-amber-300/90">
                (provisional until review)
              </span>
            )}
          </span>
        </div>

        <div className="mb-3 flex items-baseline justify-between gap-2 text-sm">
          <span className="text-zinc-400">Job budget (demo)</span>
          <span className="tabular-nums font-medium text-zinc-200">
            {DEMO_JOB_BUDGET_HBAR.toFixed(2)} HBAR
          </span>
        </div>

        <div className="relative">
          <MeterBar
            value={pass ? payoutPct : 0}
            tone={pass ? "emerald" : "rose"}
            striped={pass && payoutPct > 0}
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              {pass ? `${payoutPct}% of budget released` : "0% — failed verification"}
            </span>
            {pass && (
              <span className="tabular-nums text-emerald-300">
                = {payoutHbar.toFixed(2)} HBAR
              </span>
            )}
          </div>
        </div>

        {/* Client → Provider */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-white/5 bg-black/30 px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Bot className="h-4 w-4 text-violet-300" />
            <span className="max-w-[120px] truncate text-zinc-300">{clientName}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <ArrowRight
              className={clsx(
                "h-5 w-5",
                pass && payoutHbar > 0 ? "text-emerald-400" : "text-zinc-600"
              )}
            />
            {pass && payoutHbar > 0 ? (
              <span className="tabular-nums text-sm font-semibold text-emerald-300">
                {payoutHbar.toFixed(2)} HBAR
              </span>
            ) : (
              <span className="text-xs text-zinc-600">no payout</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Bot className="h-4 w-4 text-indigo-300" />
            <span className="max-w-[120px] truncate text-zinc-300">{providerName}</span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-zinc-500">
          {paid
            ? "Payment sent — provider paid for verified work quality"
            : pass
              ? "Better score → higher payout. Release after verdict is finalized on Hedera."
              : "Provider earns nothing when the deliverable fails the rubric."}
        </p>
      </div>
    </div>
  );
}
