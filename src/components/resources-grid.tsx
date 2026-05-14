import {
  ArrowUpRight,
  Github,
  BookOpen,
  MessageCircle,
  Video,
  Globe,
  Rss,
  Newspaper,
  HelpCircle,
  Smartphone,
  Coins,
  Code,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props {
  markdown: string | null;
}

interface ResourceLink {
  label: string;
  href: string;
  kind: ResourceKind;
}

type ResourceKind =
  | 'github'
  | 'docs'
  | 'discord'
  | 'video'
  | 'blog'
  | 'pricing'
  | 'help'
  | 'mobile'
  | 'code'
  | 'website';

const KIND_META: Record<ResourceKind, { icon: LucideIcon; label: string; color: string }> = {
  github:   { icon: Github,        label: 'Code',     color: 'text-ink' },
  docs:     { icon: BookOpen,      label: 'Docs',     color: 'text-accent' },
  discord:  { icon: MessageCircle, label: 'Community',color: 'text-accent-2' },
  video:    { icon: Video,         label: 'Video',    color: 'text-success' },
  blog:     { icon: Newspaper,     label: 'Blog',     color: 'text-ink-mute' },
  pricing:  { icon: Coins,         label: 'Pricing',  color: 'text-accent-2' },
  help:     { icon: HelpCircle,    label: 'Help',     color: 'text-accent' },
  mobile:   { icon: Smartphone,    label: 'Mobile',   color: 'text-ink-mute' },
  code:     { icon: Code,          label: 'Code',     color: 'text-ink' },
  website:  { icon: Globe,         label: 'Website',  color: 'text-ink-dim' },
};

/** Infer the link kind from the label and URL. */
function classify(label: string, href: string): ResourceKind {
  const l = label.toLowerCase();
  const u = href.toLowerCase();
  if (u.includes('github.com') || /github|repo/.test(l)) return 'github';
  if (u.includes('discord') || /discord|community|slack/.test(l)) return 'discord';
  if (/youtu\.be|youtube\.com|vimeo/.test(u) || /video|talk|tutorial/.test(l)) return 'video';
  if (/blog|medium\.com|substack/.test(u) || /blog|article|post/.test(l)) return 'blog';
  if (/pricing|plan/.test(l) || /pricing/.test(u)) return 'pricing';
  if (/help|faq|support/.test(l)) return 'help';
  if (/mobile|ios|android|app store|play store/.test(l)) return 'mobile';
  if (/docs?|quickstart|guide|reference|api docs/.test(l)) return 'docs';
  if (/sdk|api/.test(l)) return 'code';
  return 'website';
}

/**
 * Parse a markdown bullet list of links into structured ResourceLink objects.
 * Expects lines like `- [Label](https://...)`. Lines that don't match are
 * skipped silently.
 */
function parseResources(md: string): ResourceLink[] {
  const out: ResourceLink[] = [];
  const linkRe = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const lines = md.split('\n');
  for (const line of lines) {
    linkRe.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(line)) !== null) {
      const label = m[1].trim();
      const href = m[2].trim();
      if (!label || !href) continue;
      out.push({ label, href, kind: classify(label, href) });
    }
  }
  return out;
}

export default function ResourcesGrid({ markdown }: Props) {
  if (!markdown) return null;
  const items = parseResources(markdown);
  if (items.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const meta = KIND_META[item.kind];
        const Icon = meta.icon;
        const external = /^https?:\/\//.test(item.href);
        return (
          <a
            key={`${item.href}-${i}`}
            href={item.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-xl border border-line bg-surface-1 px-4 py-3.5',
              'transition-all hover:border-line-2 hover:bg-surface-2',
            )}
          >
            <span className={cn(
              'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2',
              meta.color,
            )}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink">{item.label}</span>
              <span className="block text-[11px] uppercase tracking-wider text-ink-faint">
                {meta.label}
              </span>
            </span>
            <ArrowUpRight
              className="h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </a>
        );
      })}
    </div>
  );
}
