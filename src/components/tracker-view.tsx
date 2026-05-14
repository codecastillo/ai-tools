'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Circle, BookmarkPlus, Zap, ArrowRight } from 'lucide-react';
import TrackerButton from '@/components/tracker-button';
import { cn } from '@/lib/cn';

type Status = 'untried' | 'want' | 'using';

const STORAGE_KEY = 'aitools_tracker';
const EVENT_NAME = 'aitools_tracker_change';

interface ToolLite {
  slug: string;
  title: string;
  tagline?: string | null;
}

interface Props {
  tools: ToolLite[];
}

function readTracker(): Record<string, Status> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, Status> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof k !== 'string') continue;
      if (v === 'untried' || v === 'want' || v === 'using') {
        out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export default function TrackerView({ tools }: Props) {
  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState<Record<string, Status>>({});

  useEffect(() => {
    setMounted(true);
    setMap(readTracker());

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Record<string, Status>>).detail;
      setMap(
        detail && typeof detail === 'object' && !Array.isArray(detail)
          ? detail
          : readTracker(),
      );
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setMap(readTracker());
    };

    window.addEventListener(EVENT_NAME, onChange as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const groups = useMemo(() => {
    const using: ToolLite[] = [];
    const want: ToolLite[] = [];
    const untried: ToolLite[] = [];
    for (const tool of tools) {
      const s = map[tool.slug] ?? 'untried';
      if (s === 'using') using.push(tool);
      else if (s === 'want') want.push(tool);
      else untried.push(tool);
    }
    return { using, want, untried };
  }, [tools, map]);

  if (!mounted) {
    return <div className="min-h-[300px]" aria-hidden />;
  }

  if (tools.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface-1 p-10 text-center">
        <p className="text-base text-ink">No tools available to track yet.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-bright"
        >
          Browse tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center text-sm text-ink-mute">
        You are using{' '}
        <span className="font-semibold text-success">{groups.using.length}</span>{' '}
        {groups.using.length === 1 ? 'tool' : 'tools'}, want to try{' '}
        <span className="font-semibold text-accent">{groups.want.length}</span>,
        and haven&apos;t tried{' '}
        <span className="font-semibold text-ink">{groups.untried.length}</span>.
      </p>

      <div className="mt-10 space-y-12">
        <Section
          title="Using"
          icon={<Zap className="h-4 w-4 text-success fill-success" />}
          count={groups.using.length}
          tone="success"
          tools={groups.using}
          emptyHint="Cycle a tool to Using to track what you rely on day-to-day."
        />
        <Section
          title="Want to try"
          icon={<BookmarkPlus className="h-4 w-4 text-accent" />}
          count={groups.want.length}
          tone="accent"
          tools={groups.want}
          emptyHint="Nothing on your shortlist yet. Mark a tool as Want to try."
        />
        <Section
          title="Untried"
          icon={<Circle className="h-4 w-4 text-ink-faint" />}
          count={groups.untried.length}
          tone="muted"
          tools={groups.untried}
          emptyHint="You have at least dabbled with everything below."
        />
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  count,
  tone,
  tools,
  emptyHint,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  tone: 'success' | 'accent' | 'muted';
  tools: ToolLite[];
  emptyHint: string;
}) {
  return (
    <section>
      <header className="flex items-center gap-3">
        <span
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md border',
            tone === 'success' && 'border-success/40 bg-success/10',
            tone === 'accent' && 'border-accent/40 bg-accent/10',
            tone === 'muted' && 'border-line-2 bg-surface-2',
          )}
        >
          {icon}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
        <span
          className={cn(
            'rounded-md border px-2 py-0.5 text-xs font-medium',
            tone === 'success' && 'border-success/30 bg-success/10 text-success',
            tone === 'accent' && 'border-accent/30 bg-accent/10 text-accent',
            tone === 'muted' && 'border-line-2 bg-surface-2 text-ink-mute',
          )}
        >
          {count}
        </span>
      </header>

      {tools.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-line-2 bg-surface-1 p-6 text-center text-sm text-ink-mute">
          {emptyHint}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface-1">
          {tools.map((tool) => (
            <li
              key={tool.slug}
              className="flex flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block truncate text-sm font-semibold text-ink transition-colors hover:text-accent"
                >
                  {tool.title}
                </Link>
                {tool.tagline && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-mute">
                    {tool.tagline}
                  </p>
                )}
              </div>
              <TrackerButton slug={tool.slug} variant="pill" size="md" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
