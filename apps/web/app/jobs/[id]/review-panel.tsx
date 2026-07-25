"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";

export function ReviewPanel({
  jobId,
  aiScore,
  aiPass,
  aiConfidence,
  reviewReason,
}: {
  jobId: string;
  aiScore: number;
  aiPass: boolean;
  aiConfidence: number;
  reviewReason?: string | null;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [pass, setPass] = useState(aiPass);
  const [score, setScore] = useState(aiScore);
  const [notes, setNotes] = useState("");

  async function submit(action: "approve" | "override" | "reject") {
    setLoading(action);
    setError(null);
    const res = await fetch(`/api/jobs/${jobId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        notes: notes || undefined,
        pass: action === "override" ? pass : undefined,
        score: action === "override" ? score : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Review failed");
      setLoading(null);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="warning">Human review required</Badge>
          <h2 className="mt-3 text-lg font-semibold">AI verdict needs a second look</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Borderline score or low confidence — confirm, override, or reject before
            anchoring on Hedera HCS.
          </p>
          {reviewReason && (
            <p className="mt-2 text-xs text-amber-200/80">{reviewReason}</p>
          )}
        </div>
        <div className="text-right text-sm text-zinc-400">
          <div>AI: {aiPass ? "PASS" : "FAIL"} · {aiScore}/100</div>
          <div>Confidence {Math.round(aiConfidence * 100)}%</div>
        </div>
      </div>

      {overrideOpen && (
        <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-zinc-400">Final pass</span>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
              value={pass ? "pass" : "fail"}
              onChange={(e) => setPass(e.target.value === "pass")}
            >
              <option value="pass">PASS</option>
              <option value="fail">FAIL</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-zinc-400">Final score</span>
            <input
              type="number"
              min={0}
              max={100}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-zinc-400">Notes (optional)</span>
            <textarea
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 min-h-16"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why you changed the verdict…"
            />
          </label>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-rose-300">{error}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={Boolean(loading)}
          onClick={() => submit("approve")}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {loading === "approve" ? "Confirming…" : "Approve AI verdict"}
        </button>
        <button
          type="button"
          disabled={Boolean(loading)}
          onClick={() => {
            if (!overrideOpen) {
              setOverrideOpen(true);
              return;
            }
            submit("override");
          }}
          className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200 disabled:opacity-50"
        >
          {loading === "override"
            ? "Saving…"
            : overrideOpen
              ? "Submit override"
              : "Override"}
        </button>
        <button
          type="button"
          disabled={Boolean(loading)}
          onClick={() => submit("reject")}
          className="rounded-xl border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-300 disabled:opacity-50"
        >
          {loading === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </div>
  );
}
