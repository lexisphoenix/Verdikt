"use client";

import clsx from "clsx";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  FileCheck,
  Fingerprint,
  Link2,
  Scale,
  Shield,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const CYCLE_MS = 3200;

const STEPS = [
  {
    id: "handoff",
    caption: "Client agent sends task spec + rubric to provider agent",
    detail: "The rubric is the acceptance contract — weighted criteria, minimum score",
  },
  {
    id: "deliver",
    caption: "Provider agent returns the deliverable",
    detail: "Copy, code, report — whatever was requested",
  },
  {
    id: "problem",
    caption: "Without Verdikt: no independent check, no proof",
    detail: "Agents trust the output — or dispute it with no audit trail",
  },
  {
    id: "verdikt",
    caption: "Verdikt compares deliverable against the rubric",
    detail: "POST /api/verify — same contract the client defined upfront",
  },
  {
    id: "judge",
    caption: "0G judges live — score, pass/fail, per-criterion rationale",
    detail: "Structured verdict, not a gut feeling",
  },
  {
    id: "review",
    caption: "Borderline or low confidence → human review first",
    detail: "Approve, override, or reject — then finalize",
  },
  {
    id: "proof",
    caption: "Final verdict anchored on Hedera HCS — tamper-evident",
    detail: "Task, deliverable, and verdict hashes · verifier on stora.locker",
  },
] as const;

function AgentNode({
  label,
  sub,
  active,
  muted,
  icon: Icon,
  accent,
}: {
  label: string;
  sub: string;
  active?: boolean;
  muted?: boolean;
  icon: typeof Bot;
  accent: "violet" | "indigo" | "emerald" | "rose";
}) {
  const styles = {
    violet: {
      ring: "border-violet-500/50 bg-violet-500/15 shadow-[0_0_20px_rgba(139,92,246,0.2)]",
      icon: "text-violet-300",
    },
    indigo: {
      ring: "border-indigo-500/50 bg-indigo-500/15 shadow-[0_0_20px_rgba(99,102,241,0.25)]",
      icon: "text-indigo-300",
    },
    emerald: {
      ring: "border-emerald-500/50 bg-emerald-500/15 shadow-[0_0_20px_rgba(52,211,153,0.2)]",
      icon: "text-emerald-300",
    },
    rose: {
      ring: "border-rose-500/40 bg-rose-500/10 shadow-[0_0_16px_rgba(244,63,94,0.15)]",
      icon: "text-rose-300",
    },
  }[accent];

  return (
    <div
      className={clsx(
        "flex flex-col items-center rounded-xl border px-3 py-3 text-center transition-all duration-700",
        active ? styles.ring : "border-white/10 bg-white/[0.03]",
        muted && !active && "opacity-40"
      )}
    >
      <Icon className={clsx("h-6 w-6", active ? styles.icon : "text-zinc-500")} />
      <div className="mt-2 text-xs font-semibold leading-tight">{label}</div>
      <div className="mt-0.5 text-[10px] text-zinc-500">{sub}</div>
    </div>
  );
}

function FlowArrow({
  lit,
  label,
  warn,
}: {
  lit?: boolean;
  label?: string;
  warn?: boolean;
}) {
  return (
    <div className="relative flex min-w-[52px] flex-1 flex-col items-center justify-center px-1">
      <div
        className={clsx(
          "relative h-0.5 w-full overflow-hidden rounded-full transition-colors duration-500",
          warn ? "bg-rose-500/20" : lit ? "bg-indigo-500/30" : "bg-white/10"
        )}
      >
        {lit && (
          <div
            className={clsx(
              "packet-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full",
              warn ? "bg-rose-400" : "bg-indigo-400"
            )}
          />
        )}
      </div>
      {label && (
        <span
          className={clsx(
            "mt-1.5 max-w-[72px] text-center text-[9px] leading-tight transition-colors duration-500",
            lit ? (warn ? "text-rose-300/90" : "text-indigo-300/90") : "text-zinc-600"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export function AgentHandoffInfographic() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const phase = current.id;
  const showProblem = phase === "problem";
  const showVerdikt =
    phase === "verdikt" ||
    phase === "judge" ||
    phase === "review" ||
    phase === "proof";
  const handoffActive = phase === "handoff";
  const deliverActive = phase === "deliver";
  const verdiktActive = phase === "verdikt";
  const judgeActive = phase === "judge";
  const reviewActive = phase === "review";
  const proofActive = phase === "proof";

  return (
    <div className="relative">
      {/* Before row — agent handoff */}
      <div
        className={clsx(
          "rounded-xl border p-4 transition-all duration-700",
          showProblem
            ? "border-rose-500/30 bg-rose-500/5"
            : "border-white/10 bg-black/20"
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Agent-to-agent handoff
          </span>
          {showProblem && (
            <span className="flex items-center gap-1 text-[10px] text-rose-300">
              <AlertTriangle className="h-3 w-3" />
              No proof
            </span>
          )}
        </div>

        <div className="flex items-start">
          <AgentNode
            label="Client agent"
            sub="task + rubric"
            icon={Bot}
            accent="violet"
            active={handoffActive}
            muted={showVerdikt && !handoffActive}
          />
          <FlowArrow lit={handoffActive || deliverActive} label="spec + rubric" />
          <AgentNode
            label="Provider agent"
            sub="does the work"
            icon={Bot}
            accent="violet"
            active={deliverActive}
            muted={showVerdikt && !deliverActive}
          />
          <FlowArrow
            lit={deliverActive || showProblem}
            label="deliverable"
            warn={showProblem}
          />
          <div
            className={clsx(
              "flex flex-col items-center rounded-xl border px-3 py-3 text-center transition-all duration-700",
              showProblem
                ? "border-rose-500/40 bg-rose-500/10"
                : showVerdikt
                  ? "border-white/10 bg-white/[0.02] opacity-30"
                  : "border-dashed border-white/15 bg-white/[0.02] opacity-60"
            )}
          >
            {showProblem ? (
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            ) : (
              <span className="text-lg text-zinc-600">?</span>
            )}
            <div className="mt-2 text-xs font-semibold text-zinc-400">
              {showProblem ? "Trust only" : "Then what?"}
            </div>
          </div>
        </div>
      </div>

      {/* Verdikt layer — slides in */}
      <div
        className={clsx(
          "mt-3 overflow-hidden rounded-xl border transition-all duration-700",
          showVerdikt
            ? "max-h-48 border-indigo-500/30 bg-indigo-500/5 opacity-100"
            : "max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-300" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-300">
              Verdikt verification layer
            </span>
          </div>
          <div className="flex items-center justify-between gap-1">
            <MiniStep
              icon={FileCheck}
              label="Rubric"
              active={verdiktActive}
              done={judgeActive || reviewActive || proofActive}
            />
            <MiniConnector lit={verdiktActive || judgeActive} />
            <MiniStep
              icon={Scale}
              label="0G judge"
              active={judgeActive}
              done={reviewActive || proofActive}
            />
            <MiniConnector lit={judgeActive || reviewActive} />
            <MiniStep
              icon={UserCheck}
              label="Review?"
              active={reviewActive}
              done={proofActive}
            />
            <MiniConnector lit={reviewActive || proofActive} />
            <MiniStep
              icon={Link2}
              label="HCS"
              active={proofActive}
              done={false}
            />
            <MiniConnector lit={proofActive} />
            <MiniStep
              icon={Fingerprint}
              label="stora.locker"
              active={proofActive}
              done={false}
            />
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-4 min-h-[4.5rem]">
        <p
          key={current.caption}
          className="animate-stagger-in text-sm font-medium leading-snug text-zinc-200"
        >
          {proofActive && (
            <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-emerald-400" />
          )}
          {current.caption}
        </p>
        <p
          key={current.detail}
          className="animate-stagger-in mt-1.5 text-xs leading-relaxed text-zinc-500"
          style={{ animationDelay: "60ms" }}
        >
          {current.detail}
        </p>
        <div className="mt-3 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={clsx(
                "h-1 flex-1 rounded-full transition-all duration-500",
                i === step ? "bg-indigo-400" : i < step ? "bg-indigo-400/40" : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStep({
  icon: Icon,
  label,
  active,
  done,
}: {
  icon: typeof Scale;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center transition-all duration-500",
        active ? "scale-110" : done ? "opacity-90" : "opacity-50"
      )}
    >
      <div
        className={clsx(
          "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-500",
          active
            ? "border-indigo-400/60 bg-indigo-500/20"
            : done
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-white/10 bg-black/30"
        )}
      >
        <Icon
          className={clsx(
            "h-3.5 w-3.5",
            active ? "text-indigo-300" : done ? "text-emerald-400" : "text-zinc-500"
          )}
        />
      </div>
      <span className="mt-1 text-[9px] text-zinc-500">{label}</span>
    </div>
  );
}

function MiniConnector({ lit }: { lit: boolean }) {
  return (
    <div className="relative mx-0.5 h-px w-3 shrink-0 overflow-hidden bg-white/10 sm:w-5">
      {lit && <div className="packet-dot absolute inset-y-0 w-1.5 rounded-full bg-indigo-400" />}
    </div>
  );
}
