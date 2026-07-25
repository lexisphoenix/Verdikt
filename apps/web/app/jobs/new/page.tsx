"use client";

import { useEffect, useState } from "react";
import { Shell, Card, Button } from "@/components/ui";
import { PipelineTrack } from "@/components/flow-visuals";
import { Loader2 } from "lucide-react";
import {
  DEFAULT_DEMO_PRESET,
  DEMO_PRESETS,
  type DemoPresetId,
} from "@verdikt/shared";

type Agent = { id: string; displayName: string; role: string };

function presetToForm(preset: (typeof DEMO_PRESETS)[number]) {
  return {
    title: preset.title,
    taskSpec: preset.taskSpec,
    deliverableText: preset.deliverableText,
    rubricJson: JSON.stringify(preset.rubric, null, 2),
  };
}

export default function NewJobPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presetId, setPresetId] = useState<DemoPresetId>(DEFAULT_DEMO_PRESET.id);
  const [form, setForm] = useState({
    clientAgentId: "",
    providerAgentId: "",
    ...presetToForm(DEFAULT_DEMO_PRESET),
  });

  const activePreset =
    DEMO_PRESETS.find((p) => p.id === presetId) ?? DEFAULT_DEMO_PRESET;

  useEffect(() => {
    fetch("/api/agents/register")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load agents");
        return r.json();
      })
      .then((d) => {
        const list = d.agents ?? [];
        setAgents(list);
        const client = list.find((a: Agent) => a.role === "client");
        const provider = list.find((a: Agent) => a.role === "provider");
        setForm((f) => ({
          ...f,
          clientAgentId: client?.id ?? "",
          providerAgentId: provider?.id ?? "",
        }));
      })
      .catch(() => setError("Could not load demo agents. Refresh the page."))
      .finally(() => setAgentsLoading(false));
  }, []);

  const clientAgent = agents.find((a) => a.role === "client");
  const providerAgent = agents.find((a) => a.role === "provider");
  const agentsReady = Boolean(form.clientAgentId && form.providerAgentId);

  function applyPreset(id: DemoPresetId) {
    const preset = DEMO_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setForm((f) => ({ ...f, ...presetToForm(preset) }));
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!agentsReady) {
      setError("Demo agents not loaded yet. Wait a moment and try again.");
      return;
    }
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
      <div className={`mx-auto max-w-3xl px-6 py-10 ${loading ? "pb-28" : ""}`}>
        <h1 className="text-3xl font-bold">New verification</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pick a scenario, submit — 0G judges live
        </p>

        <Card className="mt-6">
          <div className="flex flex-wrap gap-2">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                disabled={loading}
                onClick={() => applyPreset(preset.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                  presetId === preset.id
                    ? "border-indigo-500/50 bg-indigo-500/15 font-medium text-white"
                    : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                } disabled:opacity-50`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">{activePreset.expected}</p>
        </Card>

        <Card className="mt-4">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Title">
              <input
                className="input"
                required
                disabled={loading}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Demo agents
              </div>
              {agentsLoading ? (
                <div className="mt-2 flex items-center gap-2 text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </div>
              ) : agentsReady ? (
                <div className="mt-1 text-zinc-300">
                  {clientAgent?.displayName} → {providerAgent?.displayName}
                </div>
              ) : (
                <div className="mt-1 text-rose-300">
                  No demo agents found. Refresh or visit /agents to register.
                </div>
              )}
            </div>
            <Field label="Task spec">
              <textarea
                className="input min-h-20"
                required
                disabled={loading}
                value={form.taskSpec}
                onChange={(e) => setForm({ ...form, taskSpec: e.target.value })}
              />
            </Field>
            <Field label="Deliverable">
              <textarea
                className="input min-h-28"
                required
                disabled={loading}
                value={form.deliverableText}
                onChange={(e) => setForm({ ...form, deliverableText: e.target.value })}
              />
            </Field>
            <details className="group">
              <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-300">
                Rubric (JSON)
              </summary>
              <textarea
                className="input mt-2 min-h-32 font-mono text-xs"
                required
                disabled={loading}
                value={form.rubricJson}
                onChange={(e) => setForm({ ...form, rubricJson: e.target.value })}
              />
            </details>
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                {error}
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading || agentsLoading || !agentsReady}
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

      {loading && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-indigo-500/30 bg-[#050508]/95 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl px-6 py-4">
            <div className="flex items-center gap-4">
              <Loader2 className="h-6 w-6 shrink-0 animate-spin text-indigo-400" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-indigo-100">Judging with 0G…</div>
                <div className="text-xs text-zinc-500">
                  Usually 5–10 seconds — redirecting to verdict
                </div>
              </div>
            </div>
            <div className="mt-3">
              <PipelineTrack active="judge" completed={["submit"]} />
            </div>
          </div>
        </div>
      )}

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
