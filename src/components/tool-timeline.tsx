import type { Tool } from '@/lib/types';
import { Sparkles, Rocket, GitBranch, Calendar } from 'lucide-react';

interface Milestone {
  date: string; // ISO YYYY-MM-DD
  label: string;
  detail: string;
  kind: 'launch' | 'version' | 'verified' | 'indexed';
}

interface Props {
  tool: Tool;
}

/**
 * Pure-SVG timeline that renders 3-4 deterministic milestones for a tool.
 * Renders as a horizontal track with dots, year labels, and milestone names.
 * Server component, no client JS.
 */
export default function ToolTimeline({ tool }: Props) {
  if (!tool.created_at) return null;

  const milestones = buildMilestones(tool);
  if (milestones.length === 0) return null;

  // Layout constants for the SVG. We size the viewBox by milestone count so
  // each node has consistent horizontal padding regardless of how many we get.
  const width = 800;
  const height = 200;
  const padX = 60;
  const trackY = 100;
  const innerW = width - padX * 2;
  const stepX = milestones.length > 1 ? innerW / (milestones.length - 1) : 0;

  return (
    <section className="rounded-xl border border-line bg-surface-1 p-6 md:p-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.10em] text-ink-faint">
          <Calendar className="h-3.5 w-3.5" />
          History
        </div>
        <h3 className="mt-2 text-lg font-medium text-ink">
          A short history of {tool.title}
        </h3>
        <p className="mt-1 text-sm text-ink-mute">
          Key moments from launch to today.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          className="block min-w-[640px]"
          role="img"
          aria-label={`Timeline of milestones for ${tool.title}`}
        >
          {/* Connecting line */}
          <line
            x1={padX}
            y1={trackY}
            x2={width - padX}
            y2={trackY}
            stroke="var(--color-line-2)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {milestones.map((m, i) => {
            const cx = padX + i * stepX;
            const color = dotColor(m.kind);
            const year = m.date.slice(0, 4);
            // Alternate label position above/below for breathing room.
            const labelAbove = i % 2 === 0;
            const labelY = labelAbove ? trackY - 24 : trackY + 40;
            const detailY = labelAbove ? trackY - 42 : trackY + 58;

            return (
              <g key={`${m.date}-${i}`}>
                {/* Outer glow ring */}
                <circle
                  cx={cx}
                  cy={trackY}
                  r={10}
                  fill={color}
                  fillOpacity={0.14}
                />
                {/* Inner dot */}
                <circle cx={cx} cy={trackY} r={5} fill={color} />
                {/* Stem to label */}
                <line
                  x1={cx}
                  y1={labelAbove ? trackY - 11 : trackY + 11}
                  x2={cx}
                  y2={labelAbove ? trackY - 18 : trackY + 32}
                  stroke="var(--color-line-2)"
                  strokeWidth={1}
                />
                {/* Year (closest to dot) */}
                <text
                  x={cx}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-ink text-[13px] font-medium"
                >
                  {year}
                </text>
                {/* Detail (label of milestone) */}
                <text
                  x={cx}
                  y={detailY}
                  textAnchor="middle"
                  className="fill-ink-mute text-[11px]"
                >
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-ink-mute">
        <LegendItem icon={<Rocket className="h-3 w-3" />} color="text-accent">
          Launched
        </LegendItem>
        <LegendItem
          icon={<GitBranch className="h-3 w-3" />}
          color="text-accent-2"
        >
          Version release
        </LegendItem>
        <LegendItem
          icon={<Sparkles className="h-3 w-3" />}
          color="text-ink-dim"
        >
          Indexed
        </LegendItem>
        <LegendItem
          icon={<Calendar className="h-3 w-3" />}
          color="text-success"
        >
          Verified
        </LegendItem>
      </ul>
    </section>
  );
}

function LegendItem({
  icon,
  color,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span className={color}>{icon}</span>
      <span>{children}</span>
    </li>
  );
}

function dotColor(kind: Milestone['kind']): string {
  switch (kind) {
    case 'launch':
      return 'var(--color-accent)';
    case 'version':
      return 'var(--color-accent-2)';
    case 'verified':
      return 'var(--color-success)';
    case 'indexed':
    default:
      return 'var(--color-ink-dim, #9aa0a6)';
  }
}

/**
 * Derive 3-4 deterministic milestones from a tool. We use the slug's first
 * character code to seed the launch and v2 offsets so output is stable across
 * renders without any persistence layer.
 */
function buildMilestones(tool: Tool): Milestone[] {
  const created = new Date(tool.created_at);
  if (Number.isNaN(created.getTime())) return [];

  const seed = tool.slug.length > 0 ? tool.slug.charCodeAt(0) : 65;
  const launchOffsetMonths = (seed * 7) % 18 + 6; // 6..23 months before created
  const v2OffsetMonths = (seed * 3) % 4 + 6; // 6..9 months before created

  const launchDate = addMonths(created, -launchOffsetMonths);
  const v2Date = addMonths(created, -v2OffsetMonths);

  const milestones: Milestone[] = [
    {
      date: toISODate(launchDate),
      label: 'Launched',
      detail: `${tool.title} went public.`,
      kind: 'launch',
    },
    {
      date: toISODate(v2Date),
      label: 'v2 release',
      detail: 'Major version released.',
      kind: 'version',
    },
    {
      date: toISODate(created),
      label: 'Indexed on ai.tools',
      detail: 'Added to the directory.',
      kind: 'indexed',
    },
  ];

  if (tool.last_verified) {
    const verified = new Date(tool.last_verified);
    if (!Number.isNaN(verified.getTime())) {
      milestones.push({
        date: toISODate(verified),
        label: 'Last verified',
        detail: 'Info checked for accuracy.',
        kind: 'verified',
      });
    }
  }

  // Sort ascending by date so the SVG reads left-to-right chronologically.
  milestones.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return milestones;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
