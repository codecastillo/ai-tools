import Link from 'next/link';
import {
  Home,
  Layers,
  GitCompare,
  DollarSign,
  GraduationCap,
  BookOpen,
  Newspaper,
  Send,
} from 'lucide-react';

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Shared nav list (consumed by mobile sheet too).
export const SIDEBAR_NAV: SidebarNavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/stacks', label: 'Stacks', icon: Layers },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/glossary', label: 'Glossary', icon: BookOpen },
  { href: '/changelog', label: 'Changelog', icon: Newspaper },
  { href: '/submit', label: 'Submit', icon: Send },
];

export default function SiteSidebar() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-56 lg:flex-col border-r border-white/[0.06] bg-[#0e0a08]/80 backdrop-blur-sm">
      <div className="px-6 py-6">
        <Link href="/" className="text-lg font-medium text-ink">
          ai.tools
        </Link>
        <div className="mt-1 text-xs text-ink-faint">tools for AI dev</div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {SIDEBAR_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-dim transition hover:bg-white/[0.04] hover:text-ink"
            >
              <Icon className="h-4 w-4 text-ink-faint" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-6 text-xs text-ink-faint">
        Press{' '}
        <kbd className="rounded border border-white/[0.10] bg-white/[0.04] px-1.5 py-0.5 text-[10px]">
          K
        </kbd>{' '}
        to search.
      </div>
    </aside>
  );
}
