'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * PkgId is intentionally a loose string so future package managers can be
 * added in seed data without a code change. The label map below provides
 * the display strings for the well-known managers.
 */
export type PkgId = string;

export interface PkgBlock {
  pkg: PkgId;
  lang?: string;
  code: string;
  html: string;
}

export interface PkgTabsProps {
  blocks: PkgBlock[];
  /**
   * Label map: short manager id → display label. Defaults to the package
   * manager set; pass `OS_LABELS` to render legacy `:::os` blocks with
   * macOS / Linux / Windows labels.
   */
  labelMap?: Record<string, string>;
  /**
   * Ordering hint for the tab strip. Blocks whose id appears in this list
   * are sorted by their index; everything else is appended in source order.
   */
  order?: string[];
  /**
   * ARIA label for the tablist (e.g. "Package manager" or "Operating system").
   */
  ariaLabel?: string;
  /**
   * localStorage key used to persist the user's manual selection between
   * tab groups of the same kind.
   */
  storageKey?: string;
  /**
   * Preferred default when no stored preference is present. Falls back to
   * the first available block.
   */
  defaultPref?: string;
}

export const PKG_LABELS: Record<string, string> = {
  npm: 'npm',
  pnpm: 'pnpm',
  yarn: 'Yarn',
  bun: 'Bun',
  brew: 'Homebrew',
  winget: 'winget',
  scoop: 'Scoop',
  choco: 'Chocolatey',
  pip: 'pip',
  uv: 'uv',
  conda: 'conda',
  cargo: 'Cargo',
  go: 'go',
  apt: 'apt',
  dnf: 'dnf',
  pacman: 'pacman',
  cli: 'CLI',
  curl: 'curl',
  docker: 'Docker',
};

export const PKG_ORDER: string[] = [
  'npm',
  'pnpm',
  'yarn',
  'bun',
  'pip',
  'uv',
  'conda',
  'brew',
  'winget',
  'scoop',
  'choco',
  'apt',
  'dnf',
  'pacman',
  'cargo',
  'go',
  'docker',
  'curl',
  'cli',
];

export const OS_LABELS: Record<string, string> = {
  mac: 'macOS',
  linux: 'Linux',
  windows: 'Windows',
};

export const OS_ORDER: string[] = ['mac', 'linux', 'windows'];

function labelFor(id: string, labelMap: Record<string, string>): string {
  return labelMap[id] ?? id;
}

function readStoredPref(key: string, allowed: Set<string>): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const v = window.localStorage.getItem(key);
    if (v && allowed.has(v)) return v;
    return null;
  } catch {
    return null;
  }
}

export default function PkgTabs({
  blocks,
  labelMap = PKG_LABELS,
  order = PKG_ORDER,
  ariaLabel = 'Package manager',
  storageKey = 'aitools:pkg-pref',
  defaultPref = 'npm',
}: PkgTabsProps) {
  const tablistId = useId();

  const ordered = useMemo(() => {
    const byOrder = (id: string) => {
      const i = order.indexOf(id);
      return i === -1 ? order.length + 1 : i;
    };
    return [...blocks].sort((a, b) => byOrder(a.pkg) - byOrder(b.pkg));
  }, [blocks, order]);

  const availableIds = useMemo(
    () => new Set(ordered.map((b) => b.pkg)),
    [ordered],
  );

  // SSR-safe initial selection: pick the first block; sync to user pref on mount.
  const [selected, setSelected] = useState<string>(
    () => ordered[0]?.pkg ?? '',
  );

  useEffect(() => {
    const stored = readStoredPref(storageKey, availableIds);
    if (stored) {
      setSelected(stored);
      return;
    }
    if (availableIds.has(defaultPref)) {
      setSelected(defaultPref);
      return;
    }
    if (ordered[0]) setSelected(ordered[0].pkg);
  }, [availableIds, ordered, storageKey, defaultPref]);

  const handleSelect = (id: string) => {
    setSelected(id);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, id);
      }
    } catch {
      // ignore quota / privacy mode errors
    }
  };

  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async (code: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, []);

  if (ordered.length === 0) return null;

  const active = ordered.find((b) => b.pkg === selected) ?? ordered[0];
  const isSingle = ordered.length === 1;

  return (
    <div className="group my-4 overflow-hidden rounded-lg border border-white/[0.10] bg-[--color-bg-elevated,#0a0a0a] text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-2 py-1.5">
        <div
          role="tablist"
          id={tablistId}
          aria-label={ariaLabel}
          className="flex items-center gap-1"
        >
          {ordered.map((b) => {
            const isActive = b.pkg === active.pkg;
            const commonClass = cn(
              'rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide',
              'transition-colors motion-reduce:transition-none',
              isActive
                ? 'text-accent border border-accent/40 bg-accent/[0.08]'
                : 'text-ink-mute hover:text-ink hover:bg-white/[0.04] border border-transparent',
            );
            if (isSingle) {
              return (
                <span
                  key={b.pkg}
                  role="tab"
                  aria-selected="true"
                  aria-disabled="true"
                  className={cn(commonClass, 'cursor-default')}
                >
                  {labelFor(b.pkg, labelMap)}
                </span>
              );
            }
            return (
              <button
                key={b.pkg}
                role="tab"
                type="button"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleSelect(b.pkg)}
                className={commonClass}
              >
                {labelFor(b.pkg, labelMap)}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
            {(active.lang ?? 'text').toLowerCase()}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(active.code)}
            aria-label={copied ? 'Copied' : 'Copy code'}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-[11px] font-medium text-ink-mute',
              'transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-ink',
              'motion-reduce:transition-none',
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
      <div
        role="tabpanel"
        className="overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:!bg-transparent [&_code]:!px-0 [&_code]:!py-0"
        dangerouslySetInnerHTML={{ __html: active.html }}
      />
    </div>
  );
}
