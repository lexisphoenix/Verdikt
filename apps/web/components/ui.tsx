import clsx from "clsx";
import type { ReactNode } from "react";
import { LogoWordmark } from "./logo";
import { MobileNav } from "./mobile-nav";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs/new", label: "New job" },
  { href: "/agents", label: "Agents" },
  { href: "/identity", label: "Identity" },
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050508] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <header className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="hover:opacity-90">
            <LogoWordmark />
          </a>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
            <a
              href="/jobs/new"
              className="rounded-lg bg-white/10 px-3 py-1.5 font-medium text-white hover:bg-white/15"
            >
              Run demo
            </a>
          </nav>
          <MobileNav />
        </div>
      </header>

      <main className="relative z-10 flex-1">{children}</main>

      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-zinc-500">
          <div>
            <span className="text-zinc-400">Verdikt</span>
            <span className="mx-2">·</span>
            <span>Alexis Phoenix</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://verdikt-kohl.vercel.app" className="hover:text-zinc-300">
              Live demo
            </a>
            <a
              href="https://github.com/lexisphoenix/Verdikt"
              className="hover:text-zinc-300"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="/api/health" className="hover:text-zinc-300">
              Health
            </a>
          </div>
        </div>
      </footer>
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

export function SponsorPills() {
  const sponsors = ["0G", "Hedera", "ENS"];
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {sponsors.map((s) => (
        <span
          key={s}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
