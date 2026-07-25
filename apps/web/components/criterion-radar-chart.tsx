type CriterionCheck = {
  key: string;
  label: string;
  passed: boolean;
  score: number;
  rationale: string;
};

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  index: number,
  total: number,
  value: number
) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = radius * (Math.min(100, Math.max(0, value)) / 100);
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function polygonPoints(
  cx: number,
  cy: number,
  radius: number,
  total: number,
  level: number
) {
  return Array.from({ length: total }, (_, i) => {
    const { x, y } = polarPoint(cx, cy, radius, i, total, level);
    return `${x},${y}`;
  }).join(" ");
}

function labelAnchor(index: number, total: number): "start" | "middle" | "end" {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const cos = Math.cos(angle);
  if (cos > 0.25) return "start";
  if (cos < -0.25) return "end";
  return "middle";
}

export function CriterionRadarChart({
  checks,
  minimumScore,
}: {
  checks: CriterionCheck[];
  minimumScore?: number;
}) {
  if (checks.length < 2) return null;

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 96;
  const labelRadius = radius + 28;
  const levels = [25, 50, 75, 100];
  const n = checks.length;

  const dataPoints = checks
    .map((check, i) => {
      const { x, y } = polarPoint(cx, cy, radius, i, n, check.score);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-8">
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-[260px] w-[260px] sm:h-[280px] sm:w-[280px]"
          role="img"
          aria-label="Rubric criteria radar chart"
        >
          {/* Grid rings */}
          {levels.map((level) => (
            <polygon
              key={level}
              points={polygonPoints(cx, cy, radius, n, level)}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}

          {/* Axis spokes */}
          {checks.map((_, i) => {
            const { x, y } = polarPoint(cx, cy, radius, i, n, 100);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Minimum score threshold */}
          {minimumScore != null && minimumScore > 0 && (
            <polygon
              points={polygonPoints(cx, cy, radius, n, minimumScore)}
              fill="none"
              stroke="rgba(251,191,36,0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}

          {/* Data area */}
          <polygon
            points={dataPoints}
            fill="rgba(52,211,153,0.22)"
            stroke="rgba(52,211,153,0.85)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data vertices */}
          {checks.map((check, i) => {
            const { x, y } = polarPoint(cx, cy, radius, i, n, check.score);
            return (
              <circle
                key={check.key}
                cx={x}
                cy={y}
                r="4"
                fill={check.passed ? "#34d399" : "#fbbf24"}
                stroke="#050508"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels */}
          {checks.map((check, i) => {
            const { x, y } = polarPoint(cx, cy, labelRadius, i, n, 100);
            const anchor = labelAnchor(i, n);
            const dy = i === 0 ? -4 : 4;
            return (
              <g key={`label-${check.key}`}>
                <text
                  x={x}
                  y={y + dy}
                  textAnchor={anchor}
                  className="fill-zinc-300 text-[10px] font-medium"
                  style={{ fontSize: 10 }}
                >
                  {check.label}
                </text>
                <text
                  x={x}
                  y={y + dy + 12}
                  textAnchor={anchor}
                  className={check.passed ? "fill-emerald-400" : "fill-amber-400"}
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {check.score}
                </text>
              </g>
            );
          })}

          {/* Center score hint */}
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            className="fill-zinc-600"
            style={{ fontSize: 9 }}
          >
            /100
          </text>
        </svg>

        {minimumScore != null && (
          <p className="mt-1 text-center text-[10px] text-amber-400/80">
            Dashed ring = minimum to pass ({minimumScore})
          </p>
        )}
      </div>

      {/* Rationale list */}
      <div className="mt-4 w-full min-w-0 space-y-3 lg:mt-6 lg:flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Per criterion
        </p>
        {checks.map((check) => (
          <div
            key={check.key}
            className="rounded-lg border border-white/5 bg-black/20 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-zinc-200">{check.label}</span>
              <span
                className={`tabular-nums text-sm font-semibold ${
                  check.passed ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {check.score}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{check.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
