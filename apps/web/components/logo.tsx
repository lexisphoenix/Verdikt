import clsx from "clsx";

export function LogoMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="vdkt-grad" x1="8" y1="4" x2="32" y2="36">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#vdkt-grad)" />
      <path
        d="M20 8L28 12V20C28 26 24 29.5 20 31C16 29.5 12 26 12 20V12L20 8Z"
        fill="rgba(0,0,0,0.35)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.75"
      />
      <path
        d="M16.5 20L18.8 22.5L23.8 17"
        stroke="#050508"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoWordmark({
  subtitle = "Work verification",
  compact = false,
}: {
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={compact ? 36 : 40} />
      <div>
        <div className="text-lg font-semibold tracking-tight leading-none">Verdikt</div>
        {!compact && (
          <div className="mt-0.5 text-xs text-zinc-400">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
