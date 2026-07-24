import clsx from "clsx";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050508] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 font-bold text-black">
              V
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Verdikt</div>
              <div className="text-xs text-zinc-400">Agentic Verification</div>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a href="/dashboard" className="hover:text-white">Dashboard</a>
            <a href="/agents" className="hover:text-white">Agents</a>
            <a href="/jobs/new" className="hover:text-white">New Job</a>
          </nav>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
    </div>
  );
}

export function Card({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md",
        glow && "shadow-[0_0_40px_rgba(99,102,241,0.15)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const tones = {
    default: "bg-zinc-500/20 text-zinc-300",
    success: "bg-emerald-500/20 text-emerald-300",
    warning: "bg-amber-500/20 text-amber-300",
    danger: "bg-rose-500/20 text-rose-300",
    info: "bg-indigo-500/20 text-indigo-300",
  };
  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </div>
  );
}

export function HashBlock({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-3">
      <div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="break-all font-mono text-xs text-emerald-300/90">
        {value ?? "—"}
      </div>
    </div>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-emerald-400 text-black hover:opacity-90",
    secondary: "border border-white/15 bg-white/5 hover:bg-white/10",
    ghost: "text-zinc-300 hover:text-white hover:bg-white/5",
  };
  const cls = clsx(
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition",
    styles[variant],
    className
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return <button className={cls}>{children}</button>;
}
