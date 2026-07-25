"use client";

import clsx from "clsx";
import {
  Bot,
  Cpu,
  Database,
  Fingerprint,
  Layers,
  Link2,
  Scale,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

const ARCH_LAYERS = [
  { label: "Agent layer", sub: "Client + provider hand off work", icon: Bot, color: "violet" },
  { label: "Verdikt API", sub: "POST /api/verify", icon: Layers, color: "indigo" },
  { label: "0G judge", sub: "Structured score + pass/fail", icon: Scale, color: "sky" },
  { label: "Hedera HCS", sub: "Hashes anchored on testnet", icon: Link2, color: "emerald" },
  { label: "ENS identity", sub: "stora.locker verifier", icon: Fingerprint, color: "amber" },
] as const;

const COLOR_MAP = {
  violet: {
    border: "border-violet-500/50",
    bg: "bg-violet-500/15",
    icon: "text-violet-300",
    glow: "shadow-[0_0_24px_rgba(139,92,246,0.25)]",
  },
  indigo: {
    border: "border-indigo-500/50",
    bg: "bg-indigo-500/15",
    icon: "text-indigo-300",
    glow: "shadow-[0_0_24px_rgba(99,102,241,0.25)]",
  },
  sky: {
    border: "border-sky-500/50",
    bg: "bg-sky-500/15",
    icon: "text-sky-300",
    glow: "shadow-[0_0_24px_rgba(56,189,248,0.25)]",
  },
  emerald: {
    border: "border-emerald-500/50",
    bg: "bg-emerald-500/15",
    icon: "text-emerald-300",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.25)]",
  },
  amber: {
    border: "border-amber-500/50",
    bg: "bg-amber-500/15",
    icon: "text-amber-300",
    glow: "shadow-[0_0_24px_rgba(251,191,36,0.2)]",
  },
};

const H_NODES = [
  { label: "Client", sub: "task + rubric", icon: Bot, color: "violet" },
  { label: "Provider", sub: "deliverable", icon: Cpu, color: "violet" },
  { label: "0G", sub: "verdict", icon: Scale, color: "sky" },
  { label: "Hedera", sub: "HCS hash", icon: Database, color: "emerald" },
  { label: "Payout", sub: "optional", icon: Wallet, color: "amber" },
] as const;

const STEP_MS = 1400;

export function AnimatedArchitectureDiagram() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % ARCH_LAYERS.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative pl-8">
      <div className="absolute bottom-4 left-[11px] top-4 w-0.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="flow-dot-vertical absolute left-0 w-full rounded-full bg-gradient-to-b from-violet-400 via-indigo-400 to-emerald-400"
          style={{ animationDuration: `${ARCH_LAYERS.length * STEP_MS}ms` }}
        />
      </div>
      <div className="space-y-3">
        {ARCH_LAYERS.map((layer, i) => {
          const isActive = i === active;
          const isPast = i < active;
          const c = COLOR_MAP[layer.color];
          return (
            <div
              key={layer.label}
              className="relative animate-stagger-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={clsx(
                  "absolute -left-8 top-4 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-mono transition-all duration-500",
                  isActive
                    ? "scale-110 border-indigo-400 bg-indigo-500/30 text-white"
                    : isPast
                      ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                      : "border-white/15 bg-[#050508] text-zinc-500"
                )}
              >
                {i + 1}
              </div>
              <div
                className={clsx(
                  "rounded-xl border p-4 transition-all duration-500",
                  isActive
                    ? clsx(c.border, c.bg, c.glow, "scale-[1.02]")
                    : isPast
                      ? "border-emerald-500/20 bg-emerald-500/5 opacity-80"
                      : "border-white/10 bg-white/[0.02] opacity-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <layer.icon
                    className={clsx(
                      "mt-0.5 h-4 w-4 shrink-0 transition-colors duration-500",
                      isActive || isPast ? c.icon : "text-zinc-600"
                    )}
                  />
                  <div>
                    <div className="text-sm font-semibold">{layer.label}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">{layer.sub}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlowConnector({ lit }: { lit: boolean }) {
  return (
    <div className="relative mx-1 hidden h-px w-5 shrink-0 overflow-hidden bg-white/10 sm:block sm:w-8">
      {lit && <div className="flow-dot-horizontal absolute inset-y-0 w-2 rounded-full bg-emerald-400" />}
      <span
        className={clsx(
          "absolute -right-1 top-1/2 -translate-y-1/2 text-[10px] transition-colors duration-300",
          lit ? "text-emerald-400 animate-arrow-nudge" : "text-zinc-700"
        )}
      >
        ›
      </span>
    </div>
  );
}

export function AnimatedHorizontalFlow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % (H_NODES.length + 1));
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[640px] items-center px-2">
        {H_NODES.map((node, i) => {
          const isActive = i === active;
          const isPast = i < active;
          const c = COLOR_MAP[node.color];
          return (
            <div key={node.label} className="flex flex-1 items-center">
              <div
                className={clsx(
                  "flex flex-1 flex-col items-center rounded-xl border px-3 py-4 text-center transition-all duration-500",
                  isActive
                    ? clsx(c.border, c.bg, c.glow, "scale-105")
                    : isPast
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/10 bg-white/[0.02] opacity-60"
                )}
              >
                <node.icon
                  className={clsx(
                    "mb-2 h-5 w-5 transition-all duration-500",
                    isActive ? clsx(c.icon, "scale-110") : isPast ? "text-emerald-400" : "text-zinc-600"
                  )}
                />
                <div className={clsx("text-sm font-medium", isActive && "text-white")}>
                  {node.label}
                </div>
                <div className="text-xs text-zinc-500">{node.sub}</div>
              </div>
              {i < H_NODES.length - 1 && <FlowConnector lit={i < active} />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-center">
        <span className="text-xs text-zinc-600">
          {active < H_NODES.length
            ? `Processing: ${H_NODES[active].label}…`
            : "Loop complete — restarting"}
        </span>
      </div>
    </div>
  );
}

export function AnimatedLayerStack() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 3), 2000);
    return () => clearInterval(id);
  }, []);

  const layers = [
    {
      title: "Compute",
      icon: Scale,
      accent: "indigo",
      items: ["0G Private Computer", "Rubric → JSON verdict"],
    },
    {
      title: "Audit",
      icon: Link2,
      accent: "emerald",
      items: ["Hedera Consensus Service", "task · deliverable · verdict hashes"],
    },
    {
      title: "Identity",
      icon: Fingerprint,
      accent: "violet",
      items: ["ENS / .locker", "stora.locker verifier agent"],
    },
  ];

  const accentBorder = {
    indigo: "border-indigo-500/30",
    emerald: "border-emerald-500/30",
    violet: "border-violet-500/30",
  };
  const accentBg = {
    indigo: "bg-indigo-500/10",
    emerald: "bg-emerald-500/10",
    violet: "bg-violet-500/10",
  };
  const accentText = {
    indigo: "text-indigo-300",
    emerald: "text-emerald-300",
    violet: "text-violet-300",
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {layers.map((layer, i) => {
        const lit = pulse === i;
        const accent = layer.accent as keyof typeof accentBorder;
        return (
          <div
            key={layer.title}
            className={clsx(
              "rounded-2xl border p-5 transition-all duration-700",
              accentBorder[accent],
              lit ? clsx(accentBg[accent], "scale-[1.03] shadow-lg") : "bg-white/[0.02] opacity-80"
            )}
          >
            <div
              className={clsx(
                "mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider",
                accentText[accent]
              )}
            >
              <layer.icon className={clsx("h-4 w-4", lit && "animate-float")} />
              {layer.title}
            </div>
            <div className="space-y-2">
              <div
                className={clsx(
                  "rounded-lg border px-3 py-2 text-sm transition-colors duration-500",
                  lit ? "border-white/20 bg-black/40" : "border-white/10 bg-black/20"
                )}
              >
                {layer.items[0]}
              </div>
              <div className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-zinc-500">
                {layer.items[1]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
