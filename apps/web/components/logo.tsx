import clsx from "clsx";
import Image from "next/image";

export function LogoMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={clsx("shrink-0 rounded-[22%]", className)}
      priority
      aria-hidden
    />
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
    <div className="flex items-center gap-2.5">
      <LogoMark size={compact ? 32 : 36} />
      <div>
        <div className="text-lg font-semibold tracking-tight leading-none">Verdikt</div>
        {!compact && (
          <div className="mt-0.5 text-[11px] text-zinc-500">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
