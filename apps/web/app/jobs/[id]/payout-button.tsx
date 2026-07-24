"use client";

import { useState } from "react";

export function PayoutButton({ jobId }: { jobId: string }) {
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
      <p className="text-sm text-zinc-400">
        Trigger testnet HBAR payout to provider Hedera account (e.g. 0.0.12345)
      </p>
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
