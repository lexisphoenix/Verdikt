"use client";

import { useState } from "react";
import {
  DEMO_JOB_BUDGET_HBAR,
  payoutAmountFromBps,
  payoutPercentFromBps,
} from "@/lib/demo-payout";

export function PayoutButton({
  jobId,
  recommendedPayoutBps,
}: {
  jobId: string;
  recommendedPayoutBps: number;
}) {
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const payoutHbar = payoutAmountFromBps(recommendedPayoutBps);
  const payoutPct = payoutPercentFromBps(recommendedPayoutBps);

  async function trigger() {
    if (!accountId.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/jobs/${jobId}/verify`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientAccountId: accountId.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setResult(`Payout sent: ${data.payoutTransactionId} (${data.payoutAmountHbar} HBAR)`);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setResult(data.error ?? "Payout failed");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <p className="text-sm font-medium text-emerald-200">
          Release {payoutHbar.toFixed(2)} HBAR ({payoutPct}% of {DEMO_JOB_BUDGET_HBAR} HBAR budget)
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Score-based payment to the provider&apos;s Hedera account (testnet demo).
        </p>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
          placeholder="0.0.xxxxx"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <button
          onClick={trigger}
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Sending..." : "Release payout"}
        </button>
      </div>
      {result && <p className="text-sm text-emerald-300">{result}</p>}
    </div>
  );
}
