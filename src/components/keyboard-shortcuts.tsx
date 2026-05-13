'use client';

import { useEffect } from 'react';
import { useCommandPalette } from './command-palette-provider';
import { useKeyboardOverlay } from './keyboard-overlay';

const TOOL_LINK_SELECTOR = 'a[href^="/tools/"]';

function isEditable(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

function focusableToolLinks(): HTMLAnchorElement[] {
  if (typeof document === 'undefined') return [];
  const nodes = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(TOOL_LINK_SELECTOR),
  );
  // Only those that are visible (have a layout box).
  return nodes.filter((n) => n.offsetParent !== null || n === document.activeElement);
}

export default function KeyboardShortcuts() {
  const { open, setOpen, toggle } = useCommandPalette();
  const {
    open: overlayOpen,
    setOpen: setOverlayOpen,
    toggle: toggleOverlay,
  } = useKeyboardOverlay();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      // Prioritize closing the keyboard-shortcut overlay if it's open.
      if (overlayOpen && e.key === 'Escape') {
        e.preventDefault();
        setOverlayOpen(false);
        return;
      }

      // Cmd/Ctrl + K toggles palette regardless of focus context.
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        toggle();
        return;
      }

      // If the palette is open, let it handle its own keys (Esc, arrows, Enter).
      if (open) return;

      const active = document.activeElement;
      const inField = isEditable(active);

      // `?` toggles the keyboard-shortcut overlay, unless typing.
      if (e.key === '?' && !inField && !meta && !e.altKey) {
        e.preventDefault();
        toggleOverlay();
        return;
      }

      // If the overlay is open, swallow other shortcuts (Esc handled above).
      if (overlayOpen) return;

      // `/` focuses the first search input on the page, unless typing.
      if (e.key === '/' && !inField && !meta && !e.altKey && !e.shiftKey) {
        const search = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[name="q"]',
        );
        if (search) {
          e.preventDefault();
          search.focus();
          search.select?.();
        }
        return;
      }

      // Esc closes the palette (palette also closes itself, but no harm).
      if (e.key === 'Escape' && open) {
        setOpen(false);
        return;
      }

      // j / k traversal across visible tool links — only when not typing.
      if ((e.key === 'j' || e.key === 'k') && !inField && !meta && !e.altKey) {
        const links = focusableToolLinks();
        if (links.length === 0) return;
        e.preventDefault();
        const current = document.activeElement as HTMLElement | null;
        const idx = current ? links.indexOf(current as HTMLAnchorElement) : -1;
        let nextIdx: number;
        if (e.key === 'j') {
          nextIdx = idx === -1 ? 0 : Math.min(idx + 1, links.length - 1);
        } else {
          nextIdx = idx === -1 ? 0 : Math.max(idx - 1, 0);
        }
        const target = links[nextIdx];
        target.focus();
        target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen, toggle, overlayOpen, setOverlayOpen, toggleOverlay]);

  return null;
}
