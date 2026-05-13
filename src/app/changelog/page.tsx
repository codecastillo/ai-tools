import { CHANGELOG, relativeTime, type ChangelogKind } from '@/lib/changelog';
import { Sparkles, Palette, Bug, FileText } from 'lucide-react';

const KIND_ICON: Record<ChangelogKind, { icon: React.ComponentType<{className?: string}>; label: string; color: string }> = {
  feature: { icon: Sparkles,  label: 'Feature', color: 'text-accent' },
  design:  { icon: Palette,   label: 'Design',  color: 'text-accent-2' },
  fix:     { icon: Bug,       label: 'Fix',     color: 'text-success' },
  content: { icon: FileText,  label: 'Content', color: 'text-ink-dim' },
};

export const metadata = {
  title: 'Changelog · ai.tools',
  description: 'Every shipped change to the site, newest first.',
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Changelog</h1>
        <p className="mt-3 text-lg text-ink-dim">Every shipped change, newest first.</p>
      </header>

      <ol className="mt-12 relative border-l border-white/[0.08] pl-8 space-y-10">
        {CHANGELOG.map((entry, i) => {
          const meta = KIND_ICON[entry.kind];
          const Icon = meta.icon;
          return (
            <li key={i} id={`entry-${entry.date}-${i}`} className="relative">
              <span className={`absolute -left-[2.4rem] flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.10] bg-[#0e0a08] ${meta.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-wrap items-baseline gap-2 text-xs">
                <time dateTime={entry.date} className="text-ink-faint">{entry.date}</time>
                <span className="text-ink-faint">·</span>
                <span className="text-ink-faint">{relativeTime(entry.date)}</span>
                <span className="text-ink-faint">·</span>
                <span className={`uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
              </div>
              <h2 className="mt-2 text-xl font-medium text-ink">{entry.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{entry.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
