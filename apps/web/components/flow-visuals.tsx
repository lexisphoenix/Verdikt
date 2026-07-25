import clsx from "clsx";
import {
  ArrowDown,
  Bot,
  Cpu,
  Database,
  Fingerprint,
  Layers,
  Link2,
  Scale,
  Wallet,
} from "lucide-react";

const LAYERS = [
  {
    id: "agents",
    label: "Agent layer",
    sub: "Client + provider hand off work",
    color: "border-violet-500/30 bg-violet-500/10",
    icon: Bot,
    iconColor: "text-violet-300",
  },
  {
    id: "api",
    label: "Verdikt API",
    sub: "POST /api/verify · job + rubric",
    color: "border-indigo-500/30 bg-indigo-500/10",
    icon: Layers,
    iconColor: "text-indigo-300",
  },
  {
    id: "judge",
    label: "0G judge",
    sub: "Structured score + pass/fail",
    color: "border-sky-500/30 bg-sky-500/10",
    icon: Scale,
    iconColor: "text-sky-300",
  },
  {
    id: "audit",
    label: "Hedera HCS",
    sub: "Hashes anchored on testnet",
    color: "border-emerald-500/30 bg-emerald-500/10",
    icon: Link2,
    iconColor: "text-emerald-300",
  },
  {
    id: "identity",
    label: "ENS identity",
    sub: "stora.locker verifier profile",
    color: "border-amber-500/30 bg-amber-500/10",
    icon: Fingerprint,
    iconColor: "text-amber-300",
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="relative pl-8">
      <div className="absolute bottom-4 left-[11px] top-4 w-0.5 bg-gradient-to-b from-violet-500/50 via-indigo-500/40 to-emerald-500/50" />
      <div className="space-y-4">
        {LAYERS.map((layer, i) => (
          <div key={layer.id} className="relative">
            <div className="absolute -left-8 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[#050508] text-[10px] font-mono text-zinc-400">
              {i + 1}
            </div>
            <div
              className={clsx(
                "rounded-xl border p-4 backdrop-blur-sm",
                layer.color
              )}
            >
              <div className="flex items-start gap-3">
                <layer.icon className={clsx("mt-0.5 h-4 w-4 shrink-0", layer.iconColor)} />
                <div>
                  <div className="text-sm font-semibold">{layer.label}</div>
                  <div className="mt-0.5 text-xs text-zinc-400">{layer.sub}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalFlow() {
  const nodes = [
    { label: "Client", sub: "task + rubric", icon: Bot, color: "text-violet-300" },
    { label: "Provider", sub: "deliverable", icon: Cpu, color: "text-violet-300" },
    { label: "0G", sub: "verdict", icon: Scale, color: "text-sky-300" },
    { label: "Hedera", sub: "HCS hash", icon: Database, color: "text-emerald-300" },
    { label: "Payout", sub: "optional", icon: Wallet, color: "text-amber-300" },
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[640px] items-center justify-between gap-2 px-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center">
              <node.icon className={clsx("mb-2 h-5 w-5", node.color)} />
              <div className="text-sm font-medium">{node.label}</div>
              <div className="text-xs text-zinc-500">{node.sub}</div>
            </div>
            {i < nodes.length - 1 && (
              <div className="relative mx-1 hidden h-px w-5 shrink-0 overflow-hidden bg-white/10 sm:block sm:w-8">
                <div className="flow-dot-horizontal absolute inset-y-0 w-1.5 rounded-full bg-indigo-400/80" />
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 animate-arrow-nudge text-[10px] text-zinc-600">
                  ›
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LayerStack() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-300">
          <Scale className="h-4 w-4" />
          Compute
        </div>
        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
            0G Private Computer
          </div>
          <div className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-zinc-500">
            Rubric → JSON verdict
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:-mt-2 sm:mb-2 sm:scale-[1.02]">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-300">
          <Link2 className="h-4 w-4" />
          Audit
        </div>
        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
            Hedera Consensus Service
          </div>
          <div className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-zinc-500">
            task · deliverable · verdict hashes
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-violet-300">
          <Fingerprint className="h-4 w-4" />
          Identity
        </div>
        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">
            ENS / .locker
          </div>
          <div className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-zinc-500">
            stora.locker verifier agent
          </div>
        </div>
      </div>
    </div>
  );
}

export type PipelineStepId = "submit" | "judge" | "review" | "anchor" | "payout";

const PIPELINE_STEPS: Array<{
  id: PipelineStepId;
  label: string;
  icon: typeof Bot;
}> = [
  { id: "submit", label: "Submit", icon: Bot },
  { id: "judge", label: "Judge", icon: Scale },
  { id: "review", label: "Review", icon: Fingerprint },
  { id: "anchor", label: "Anchor", icon: Link2 },
  { id: "payout", label: "Payout", icon: Wallet },
];

export function PipelineTrack({
  active,
  completed,
}: {
  active?: PipelineStepId;
  completed: PipelineStepId[];
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[560px] items-center gap-1">
        {PIPELINE_STEPS.map((step, i) => {
          const done = completed.includes(step.id);
          const current = active === step.id;
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div
                className={clsx(
                  "flex flex-1 flex-col items-center rounded-xl border px-2 py-3 transition",
                  done && "border-emerald-500/40 bg-emerald-500/10",
                  current && !done && "border-indigo-500/40 bg-indigo-500/10 animate-pulse-glow",
                  !done && !current && "border-white/10 bg-white/[0.02]"
                )}
              >
                <step.icon
                  className={clsx(
                    "mb-1 h-4 w-4",
                    done ? "text-emerald-300" : current ? "text-indigo-300" : "text-zinc-600"
                  )}
                />
                <span
                  className={clsx(
                    "text-xs font-medium",
                    done ? "text-emerald-200" : current ? "text-indigo-200" : "text-zinc-500"
                  )}
                >
                  {step.label}
                </span>
              </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="relative mx-1 h-px w-4 shrink-0 overflow-hidden bg-white/10 sm:w-6">
                {done && (
                  <div className="absolute inset-0 origin-left animate-connector-fill bg-emerald-500/60" />
                )}
                {current && !done && (
                  <div className="flow-dot-horizontal absolute inset-y-0 w-1.5 rounded-full bg-indigo-400" />
                )}
              </div>
            )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function InputFlowDiagram() {
  const inputs = [
    { label: "Task spec", desc: "What was requested" },
    { label: "Rubric", desc: "Scoring criteria" },
    { label: "Deliverable", desc: "What the agent sent" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
        What goes in
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {inputs.map((input, i) => (
          <div
            key={input.label}
            className="animate-input-glow rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-center"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <div className="text-sm font-medium">{input.label}</div>
            <div className="mt-1 text-xs text-zinc-500">{input.desc}</div>
          </div>
        ))}
      </div>
      <div className="my-4 flex justify-center">
        <ArrowDown className="h-5 w-5 animate-bounce-down text-indigo-400/70" />
      </div>
      <div className="animate-output-glow rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
        <div className="text-sm font-medium text-emerald-200">Structured verdict + Hedera proof</div>
        <div className="mt-1 text-xs text-zinc-500">Score, PASS/FAIL, criterion breakdown, HCS tx</div>
      </div>
    </div>
  );
}

export function AuditFlowVisual({
  hasVerdict,
  hasHcs,
  hasPayout,
}: {
  hasVerdict: boolean;
  hasHcs: boolean;
  hasPayout: boolean;
}) {
  const blocks = [
    { label: "Task hash", active: true },
    { label: "Deliverable hash", active: true },
    { label: "Verdict hash", active: hasVerdict },
    { label: "HCS message", active: hasHcs },
    { label: "HBAR payout", active: hasPayout },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-2">
          <div
            className={clsx(
              "rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-500",
              block.active
                ? "animate-audit-pop border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-white/10 bg-white/[0.02] text-zinc-600"
            )}
          >
            {block.label}
          </div>
          {i < blocks.length - 1 && (
            <span
              className={clsx(
                "transition-colors duration-500",
                block.active ? "animate-arrow-nudge text-emerald-500/60" : "text-zinc-700"
              )}
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
