import { Shell, Card, Button, Badge } from "@/components/ui";
import { Shield, Link2, Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge tone="info">ETHGlobal Hackathon · 0G · Hedera · ENS</Badge>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
            Verify agent work
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              with onchain proof
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Verdikt judges agent deliverables inside a TEE, returns structured verdicts,
            and anchors audit hashes to Hedera — with ENS-linked agent identity.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/jobs/new">Create verification job</Button>
            <Button href="/dashboard" variant="secondary">
              Open dashboard
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Card glow>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">TEE Verification</h3>
            <p className="mt-2 text-sm text-zinc-400">
              0G Private Computer runs the judge prompt in sealed inference. Structured JSON verdict, not prose blobs.
            </p>
          </Card>
          <Card>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <Link2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Hedera Audit Trail</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Task, deliverable, and verdict hashes published to HCS. Optional testnet payout on pass.
            </p>
          </Card>
          <Card>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">ENS Agent Identity</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Verifier agents expose agent-context and endpoint records for discoverability.
            </p>
          </Card>
        </div>

        <Card className="mt-12 border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-emerald-500/5">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Demo flow in 60 seconds</h2>
              <p className="mt-2 max-w-xl text-zinc-400">
                Register agents → submit task + rubric → provider deliverable → TEE verdict → HCS anchor → optional payout.
              </p>
            </div>
            <Button href="/jobs/new">
              Run demo <ArrowRight className="ml-2 inline h-4 w-4" />
            </Button>
          </div>
        </Card>
      </section>
    </Shell>
  );
}
