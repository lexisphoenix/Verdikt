import { Shell, Card, Button, Badge, SponsorPills } from "@/components/ui";
import {
  AnimatedArchitectureDiagram,
  AnimatedHorizontalFlow,
  AnimatedLayerStack,
} from "@/components/flow-animated";
import { AgentHandoffInfographic } from "@/components/agent-handoff-infographic";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Hero */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SponsorPills />
            <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Did the agent actually deliver?
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-400">
              Submit a task and rubric. AI judges with 0G. Borderline scores get
              human review. Final verdict on Hedera HCS.
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              We verify the deliverable — not the agent&apos;s reputation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/jobs/new">
                Run demo <ArrowRight className="ml-2 inline h-4 w-4" />
              </Button>
              <Button href="/dashboard" variant="secondary">
                View jobs
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 p-6 lg:p-8">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative">
              <Badge tone="info">The story</Badge>
              <p className="mt-2 mb-4 text-xs text-zinc-500">
                Agents hand off work — Verdikt verifies and proves it
              </p>
              <AgentHandoffInfographic />
            </div>
          </Card>
        </div>

        {/* Technical pipeline — detail for after the story */}
        <div className="mt-20">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold">Under the hood</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Step-by-step verification path — loops automatically
            </p>
          </div>
          <Card className="overflow-hidden p-6">
            <AnimatedArchitectureDiagram />
          </Card>
        </div>

        <div className="mt-12">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold">End-to-end pipeline</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Data moves left to right
            </p>
          </div>
          <Card className="overflow-hidden">
            <AnimatedHorizontalFlow />
          </Card>
        </div>

        {/* Integration layers */}
        <div className="mt-20">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold">Three integration layers</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Each sponsor maps to a distinct layer in the stack
            </p>
          </div>
          <AnimatedLayerStack />
        </div>

        {/* CTA */}
        <Card className="mx-auto mt-20 max-w-3xl border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-emerald-500/5 text-center">
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
