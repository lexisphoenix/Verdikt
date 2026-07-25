"use client";

import { useEffect, useState } from "react";
import { Shell, Card, Button } from "@/components/ui";
import { Loader2 } from "lucide-react";
import {
  DEFAULT_RUBRIC,
  DEMO_DELIVERABLE,
  DEMO_TASK_SPEC,
} from "@verdikt/shared";

type Agent = { id: string; displayName: string; role: string };

export default function NewJobPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "VPN hero copy review",
    clientAgentId: "",
    providerAgentId: "",
    taskSpec: DEMO_TASK_SPEC,
    deliverableText: DEMO_DELIVERABLE,
    rubricJson: JSON.stringify(DEFAULT_RUBRIC, null, 2),
  });

  useEffect(() => {
    fetch("/api/agents/register")
      .then((r) => r.json())
      .then((d) => {
        setAgents(d.agents ?? []);
        const client = d.agents?.find((a: Agent) => a.role === "client");
        const provider = d.agents?.find((a: Agent) => a.role === "provider");
        setForm((f) => ({
          ...f,
          clientAgentId: client?.id ?? "",
          providerAgentId: provider?.id ?? "",
        }));
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const rubric = JSON.parse(form.rubricJson);
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          clientAgentId: form.clientAgentId,
          providerAgentId: form.providerAgentId,
          taskSpec: form.taskSpec,
          rubric,
          deliverableText: form.deliverableText,
          runVerification: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.fieldErrors ? JSON.stringify(data.error) : data.error);
      window.location.href = `/jobs/${data.jobId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold">New verification</h1>
        <p className="mt-1 text-zinc-400">
          Task spec, rubric, and deliverable — demo example is pre-filled
        </p>

        {loading && (
          <Card className="mt-6 border-indigo-500/20 bg-indigo-500/5">
            <div className="flex items-center gap-3 text-sm text-indigo-200">
              <Loader2 className="h-5 w-5 animate-spin" />
              <div>
                <div className="font-medium">Judging with 0G…</div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  Usually 5–10 seconds. You&apos;ll land on the verdict page when done.
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="mt-8">
          <form onSubmit={submit} className="space-y-5">
            <Field label="Title">
              <input
                className="input"
                required
                disabled={loading}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Client agent">
                <select
                  className="input"
                  required
                  disabled={loading}
                  value={form.clientAgentId}
                  onChange={(e) => setForm({ ...form, clientAgentId: e.target.value })}
                >
                  <option value="">Select client</option>
                  {agents.filter((a) => a.role === "client").map((a) => (
                    <option key={a.id} value={a.id}>{a.displayName}</option>
                  ))}
                </select>
              </Field>
              <Field label="Provider agent">
                <select
                  className="input"
                  required
                  disabled={loading}
                  value={form.providerAgentId}
                  onChange={(e) => setForm({ ...form, providerAgentId: e.target.value })}
                >
                  <option value="">Select provider</option>
                  {agents.filter((a) => a.role === "provider").map((a) => (
                    <option key={a.id} value={a.id}>{a.displayName}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Task spec">
              <textarea
                className="input min-h-24"
                required
                disabled={loading}
                value={form.taskSpec}
                onChange={(e) => setForm({ ...form, taskSpec: e.target.value })}
              />
            </Field>
            <Field label="Deliverable">
              <textarea
                className="input min-h-32"
                required
                disabled={loading}
                value={form.deliverableText}
                onChange={(e) => setForm({ ...form, deliverableText: e.target.value })}
              />
            </Field>
            <Field label="Rubric (JSON)">
              <textarea
                className="input min-h-40 font-mono text-xs"
                required
                disabled={loading}
                value={form.rubricJson}
                onChange={(e) => setForm({ ...form, rubricJson: e.target.value })}
              />
            </Field>
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 py-3 font-semibold text-black disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Judging…
                  </>
                ) : (
                  "Submit & verify"
                )}
              </button>
              <Button href="/dashboard" variant="secondary">Cancel</Button>
            </div>
          </form>
        </Card>
      </div>
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
        }
        .input:disabled {
          opacity: 0.6;
        }
      `}</style>
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
