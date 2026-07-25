import { Shell, Card, Button, Badge, SponsorPills } from "@/components/ui";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Link2,
  Scale,
  Shield,
} from "lucide-react";

const STEPS = [
  {
    n: "1",
    title: "Submit",
    body: "Client sends task spec + rubric. Provider sends the deliverable.",
    icon: FileText,
  },
  {
    n: "2",
    title: "Judge",
    body: "0G scores each criterion and returns pass/fail with notes.",
    icon: Scale,
  },
  {
    n: "3",
    title: "Anchor",
    body: "Hashes land on Hedera HCS — inspectable on HashScan.",
    icon: Link2,
  },
  {
    n: "4",
    title: "Pay",
    body: "Optional testnet HBAR payout when the verdict passes.",
    icon: CheckCircle2,
  },
];

export default function HomePage() {
  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <SponsorPills />
          <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-6xl">
            Did the agent actually deliver?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">
            Submit a task and rubric. Get a scored verdict from 0G. Hashes on
            Hedera. Optional payout on pass.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            We verify the deliverable — not the agent&apos;s reputation.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/jobs/new">
              Run demo <ArrowRight className="ml-2 inline h-4 w-4" />
            </Button>
            <Button href="/dashboard" variant="secondary">
              View jobs
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.n} className="relative pt-8">
              <span className="absolute left-6 top-4 text-xs font-mono text-zinc-600">
                {step.n}
              </span>
              <step.icon className="mb-3 h-5 w-5 text-indigo-400" />
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.body}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card glow>
            <Shield className="mb-4 h-6 w-6 text-indigo-400" />
            <h3 className="text-lg font-semibold">Structured verdict</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Score per criterion, pass threshold, payout recommendation — JSON,
              not a blob of prose.
            </p>
          </Card>
          <Card>
            <Link2 className="mb-4 h-6 w-6 text-emerald-400" />
            <h3 className="text-lg font-semibold">On-chain audit</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Task, deliverable, and verdict hashes published to Hedera Consensus
              Service after every run.
            </p>
          </Card>
          <Card>
            <Scale className="mb-4 h-6 w-6 text-violet-400" />
            <h3 className="text-lg font-semibold">Verifier identity</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              The judge agent resolves via ENS —{" "}
              <a href="/identity" className="text-indigo-300 hover:underline">
                stora.locker
              </a>
              .
            </p>
          </Card>
        </div>

        <Card className="mx-auto mt-12 max-w-3xl border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-emerald-500/5 text-center">
          <Badge tone="info">Live on testnet</Badge>
          <h2 className="mt-4 text-2xl font-semibold">Ready for the demo</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            VPN copy example is pre-filled. One click to verify, then check
            HashScan for the HCS message.
          </p>
          <Button href="/jobs/new" className="mt-6">
            Submit & verify
          </Button>
        </Card>
      </section>
    </Shell>
  );
}
