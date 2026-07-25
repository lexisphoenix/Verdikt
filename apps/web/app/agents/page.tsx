"use client";

import { useEffect, useState } from "react";
import { Shell, Card, Badge, Button } from "@/components/ui";

type Agent = {
  id: string;
  displayName: string;
  role: string;
  walletAddress: string;
  ensName?: string | null;
  agentContext?: string | null;
  endpointUrl?: string | null;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({
    displayName: "",
    walletAddress: "",
    role: "client",
    ensName: "",
    agentContext: "",
    endpointUrl: "",
  });
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/agents/register");
    const data = await res.json();
    setAgents(data.agents ?? []);
  }

  useEffect(() => {
    void fetch("/api/agents/register")
      .then((r) => r.json())
      .then((data) => setAgents(data.agents ?? []));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/agents/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ensName: form.ensName || undefined,
        agentContext: form.agentContext || undefined,
        endpointUrl: form.endpointUrl || undefined,
      }),
    });
    setForm({
      displayName: "",
      walletAddress: "",
      role: "client",
      ensName: "",
      agentContext: "",
      endpointUrl: "",
    });
    await load();
    setLoading(false);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Agents</h1>
        <p className="mt-1 text-zinc-400">Client, provider, and verifier identities</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold">Register agent</h2>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Display name">
                <input
                  required
                  className="input"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                />
              </Field>
              <Field label="Wallet address">
                <input
                  required
                  className="input"
                  placeholder="0x..."
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                />
              </Field>
              <Field label="Role">
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="client">Client</option>
                  <option value="provider">Provider</option>
                  <option value="verifier">Verifier</option>
                </select>
              </Field>
              <Field label="ENS name (optional)">
                <input
                  className="input"
                  placeholder="agent.example.eth"
                  value={form.ensName}
                  onChange={(e) => setForm({ ...form, ensName: e.target.value })}
                />
              </Field>
              <Field label="Agent context">
                <textarea
                  className="input min-h-20"
                  value={form.agentContext}
                  onChange={(e) => setForm({ ...form, agentContext: e.target.value })}
                />
              </Field>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 py-2.5 font-semibold text-black disabled:opacity-50"
              >
                {loading ? "Saving..." : "Register agent"}
              </button>
            </form>
          </Card>

          <div className="space-y-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{agent.displayName}</div>
                    <div className="mt-1 font-mono text-xs text-zinc-500">
                      {agent.walletAddress}
                    </div>
                    {agent.ensName && (
                      <div className="mt-2 text-sm text-indigo-300">{agent.ensName}</div>
                    )}
                    {agent.agentContext && (
                      <p className="mt-2 text-sm text-zinc-400">{agent.agentContext}</p>
                    )}
                  </div>
                  <Badge tone={agent.role === "verifier" ? "info" : "default"}>
                    {agent.role}
                  </Badge>
                </div>
              </Card>
            ))}
            {agents.length === 0 && (
              <Card>
                <p className="text-zinc-400">No agents yet. Run seed or register above.</p>
                <Button href="/dashboard" variant="secondary" className="mt-4">
                  Back to dashboard
                </Button>
              </Card>
            )}
          </div>
        </div>
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
        .input:focus {
          outline: 2px solid rgba(99, 102, 241, 0.4);
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
