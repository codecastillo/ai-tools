'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Plus,
  Menu,
  X,
  Wrench,
  Layers,
  GitCompare,
  DollarSign,
  BarChart3,
  Hash,
  Wand2,
  Maximize2,
  GitBranch,
  Target,
  Printer,
  BookOpen,
  GraduationCap,
  Newspaper,
  Sparkles,
  HelpCircle,
  FileText,
  Bookmark,
  Brain,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CommandPaletteTrigger from './command-palette-trigger';
import { cn } from '@/lib/cn';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  detail: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const DISCOVER: NavGroup = {
  label: 'Discover',
  items: [
    { href: '/',                label: 'All tools',     icon: Wrench,     detail: 'Browse 33 hand-picked AI tools' },
    { href: '/stacks',          label: 'Stacks',        icon: Layers,     detail: '10 ready-to-ship combinations' },
    { href: '/compare',         label: 'Compare',       icon: GitCompare, detail: 'Side-by-side head-to-head' },
    { href: '/use-cases',       label: 'Use cases',     icon: Target,     detail: '20 "I want to..." scenarios' },
    { href: '/saved',           label: 'Saved',         icon: Star,       detail: 'Your starred tools' },
  ],
};

const BUILD: NavGroup = {
  label: 'Build',
  items: [
    { href: '/pricing',                   label: 'LLM pricing',     icon: DollarSign, detail: 'Per-token rates and a cost calculator' },
    { href: '/benchmarks',                label: 'Benchmarks',      icon: BarChart3,  detail: 'Frontier model scores compared' },
    { href: '/context-windows',           label: 'Context windows', icon: Maximize2,  detail: '8K to 2M side-by-side' },
    { href: '/families',                  label: 'Model families',  icon: GitBranch,  detail: 'How major LLM lineages evolved' },
    { href: '/playground/tokens',         label: 'Tokenizer',       icon: Hash,       detail: 'See how text becomes tokens' },
    { href: '/playground/prompt-builder', label: 'Prompt builder',  icon: Wand2,      detail: 'A 4-step prompt wizard' },
    { href: '/prompts',                   label: 'Prompt library',  icon: FileText,   detail: '30+ ready-to-copy prompts' },
    { href: '/recipes',                   label: 'Stack recipes',   icon: Printer,    detail: 'Drop-in starter configs' },
  ],
};

const LEARN: NavGroup = {
  label: 'Learn',
  items: [
    { href: '/glossary',   label: 'Glossary',    icon: BookOpen,       detail: '60 terms decoded' },
    { href: '/learn',      label: 'Paths',       icon: GraduationCap,  detail: '4 curated learning routes' },
    { href: '/flashcards', label: 'Flashcards',  icon: Sparkles,       detail: 'Flip through every glossary term' },
    { href: '/quiz',       label: 'Quiz',        icon: HelpCircle,     detail: 'Ten questions, instant score' },
    { href: '/notes',      label: 'Notes',       icon: FileText,       detail: 'Per-tool study notes, kept local' },
    { href: '/tracker',    label: 'Tracker',     icon: Bookmark,       detail: 'Tried, want, using' },
    { href: '/study',      label: 'Study mode',  icon: Brain,          detail: 'Pomodoro plus path progress' },
    { href: '/cheatsheets',label: 'Cheatsheets', icon: Printer,        detail: 'Printable quick references' },
    { href: '/changelog',  label: 'Changelog',   icon: Newspaper,      detail: "What's new on the site" },
  ],
};

const GROUPS: NavGroup[] = [DISCOVER, BUILD, LEARN];

export default function SiteHeader() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  // Sticky scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          'sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all duration-200',
          scrolled
            ? 'border-line-2 bg-bg/85 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]'
            : 'border-transparent bg-bg/60',
        )}
      >
        {/* Top hairline: faint gradient that brightens on hover for a pro feel */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-60"
        />

        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-6 px-6 py-3.5 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5"
            onClick={() => setOpenGroup(null)}
          >
            <span className="relative inline-grid h-7 w-7 place-items-center rounded-lg border border-line-2 bg-surface-1 transition-colors group-hover:border-accent/50">
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent-glow)]"
              />
              <span
                aria-hidden
                className="absolute inset-0 rounded-lg bg-accent/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
            <span className="text-display text-base font-semibold tracking-tight text-ink">
              ai<span className="text-accent">.</span>tools
            </span>
          </Link>

          {/* Desktop nav: centered between logo and right rail */}
          <nav className="hidden items-center gap-6 lg:flex">
            {GROUPS.map((group) => (
              <NavDropdown
                key={group.label}
                group={group}
                open={openGroup === group.label}
                onOpen={() => setOpenGroup(group.label)}
                onClose={() => setOpenGroup(null)}
                pathname={pathname}
              />
            ))}
          </nav>

          {/* Right rail */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <CommandPaletteTrigger />
            </div>
            <Link
              href="/submit"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-line-2 bg-surface-1 px-3 py-1.5 text-sm font-medium text-ink-dim transition-all duration-150 hover:-translate-y-px hover:border-accent/40 hover:bg-accent/10 hover:text-ink"
            >
              <Plus className="h-3.5 w-3.5" />
              Submit
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-2 bg-surface-1 text-ink-dim hover:text-ink lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto border-l border-line-2 bg-bg px-6 py-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-line-2 bg-surface-1">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="text-display text-base font-semibold text-ink">
                  ai<span className="text-accent">.</span>tools
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-2 bg-surface-1 text-ink-dim hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                    {group.label}
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                            active
                              ? 'bg-accent/10 text-accent'
                              : 'text-ink-dim hover:bg-surface-2 hover:text-ink',
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-ink-faint" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="border-t border-line-2 pt-6">
                <Link
                  href="/submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg shadow-[0_0_24px_-8px_var(--color-accent-glow)]"
                >
                  <Plus className="h-4 w-4" />
                  Submit a tool
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

interface NavDropdownProps {
  group: NavGroup;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  pathname: string;
}

function NavDropdown({ group, open, onOpen, onClose, pathname }: NavDropdownProps) {
  const hasActive = group.items.some((i) => i.href === pathname);
  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={onOpen}
        onClick={() => (open ? onClose() : onOpen())}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-150',
          open || hasActive
            ? 'bg-surface-2 text-ink'
            : 'text-ink-dim hover:bg-surface-2 hover:text-ink',
        )}
      >
        {group.label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-ink-faint transition-transform duration-150',
            open && 'rotate-180 text-ink',
          )}
        />
      </button>

      {open && (
        <div
          /* Tiny invisible bridge so the cursor doesn't pass through dead space
           * between the button and the panel and trigger an early close. */
          className="absolute left-1/2 top-full z-50 w-[min(680px,90vw)] -translate-x-1/2 pt-2"
        >
          <div className="overflow-hidden rounded-xl border border-line-2 bg-surface-1 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.50)]">
          <div className="grid grid-cols-1 gap-1 p-3 md:grid-cols-2">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                    active
                      ? 'bg-accent/10'
                      : 'hover:bg-surface-2',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line-2 bg-bg transition-colors',
                      active
                        ? 'border-accent/30 text-accent'
                        : 'text-ink-dim group-hover:text-ink',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        active ? 'text-accent' : 'text-ink',
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="block truncate text-[12px] text-ink-mute">
                      {item.detail}
                    </span>
                  </span>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
