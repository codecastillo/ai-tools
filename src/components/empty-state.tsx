import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
}

export default function EmptyState({ icon: Icon, title, description, cta }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-line-2 bg-surface-1 p-12 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-3">
        <Icon className="h-5 w-5 text-ink-faint" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-ink">{title}</h3>
      {description && <p className="mt-2 text-sm text-ink-mute max-w-md mx-auto">{description}</p>}
      {cta && (
        <Link
          href={cta.href}
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-bright transition"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
