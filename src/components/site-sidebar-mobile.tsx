'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { SIDEBAR_NAV } from './site-sidebar';

export default function SiteSidebarMobile() {
  const [open, setOpen] = useState(false);

  // Close the sheet on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed left-4 top-4 z-40 rounded-md border border-white/[0.10] bg-[#0e0a08]/80 p-2 backdrop-blur-sm lg:hidden"
      >
        <Menu className="h-4 w-4 text-ink" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-white/[0.08] bg-[#0e0a08] p-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 rounded-md p-1 hover:bg-white/[0.04]"
            >
              <X className="h-5 w-5 text-ink" />
            </button>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-ink"
            >
              ai.tools
            </Link>
            <div className="mt-1 text-xs text-ink-faint">tools for AI dev</div>

            <nav className="mt-8 flex flex-col gap-1">
              {SIDEBAR_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-dim transition hover:bg-white/[0.04] hover:text-ink"
                  >
                    <Icon className="h-4 w-4 text-ink-faint" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
