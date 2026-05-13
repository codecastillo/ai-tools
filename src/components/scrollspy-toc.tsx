'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

interface ScrollSpyTOCProps {
  sections: Array<{ id: string; label: string }>;
}

export default function ScrollSpyTOC({ sections }: ScrollSpyTOCProps) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    // Track each section's intersection ratio; pick the most-visible one.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);

  // Fallback for bottom-of-page sections that fall inside the
  // IntersectionObserver's dead zone (rootMargin's -40% bottom). When the
  // viewport is near the page bottom, explicitly force the last section
  // active. The IO above still owns the mid-page case; this layer only
  // wins at the very bottom.
  useEffect(() => {
    if (sections.length === 0) return;
    if (typeof window === 'undefined') return;

    function onScroll() {
      const scrollY = window.scrollY;
      const innerH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const nearBottom = scrollY + innerH >= docH - 80;
      if (nearBottom) {
        const last = sections[sections.length - 1];
        if (last) setActiveId(last.id);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  if (sections.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveId(id);
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav
      aria-label="On this page"
      className="hidden lg:block sticky top-24 self-start"
    >
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        On this page
      </p>
      <ul className="space-y-0.5">
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                className={cn(
                  'block border-l-2 py-1 pl-3 text-sm transition-colors',
                  isActive
                    ? 'border-accent text-accent-bright'
                    : 'border-transparent text-ink-mute hover:text-ink-dim',
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
