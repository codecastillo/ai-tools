'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export type OSId = 'mac' | 'linux' | 'windows';

interface OSBlock {
  os: OSId;
  lang?: string;
  code: string;
  html: string;
}

interface OSTabsProps {
  blocks: OSBlock[];
}

const OS_LABEL: Record<OSId, string> = {
  mac: 'macOS',
  linux: 'Linux',
  windows: 'Windows',
};

const OS_ORDER: OSId[] = ['mac', 'linux', 'windows'];

const STORAGE_KEY = 'aitools:os-pref';

function detectOS(): OSId {
  if (typeof navigator === 'undefined') return 'mac';
  const ua = navigator.userAgent || '';
  if (/Mac/i.test(ua)) return 'mac';
  if (/Win/i.test(ua)) return 'windows';
  return 'linux';
}

function readStoredPref(): OSId | null {
  try {
    if (typeof window === 'undefined') return null;
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === 'mac' || v === 'linux' || v === 'windows') return v;
    return null;
  } catch {
    return null;
  }
}

export default function OSTabs({ blocks }: OSTabsProps) {
  const tablistId = useId();

  const ordered = useMemo(() => {
    return [...blocks].sort(
      (a, b) => OS_ORDER.indexOf(a.os) - OS_ORDER.indexOf(b.os),
    );
  }, [blocks]);

  const availableOS = useMemo(
    () => new Set(ordered.map((b) => b.os)),
    [ordered],
  );

  // SSR-safe initial selection: pick the first block; sync to user pref / UA on mount.
  const [selected, setSelected] = useState<OSId>(
    () => ordered[0]?.os ?? 'mac',
  );

  useEffect(() => {
    const stored = readStoredPref();
    const preferred = stored && availableOS.has(stored) ? stored : null;
    if (preferred) {
      setSelected(preferred);
      return;
    }
    const detected = detectOS();
    if (availableOS.has(detected)) {
      setSelected(detected);
    } else if (ordered[0]) {
      setSelected(ordered[0].os);
    }
  }, [availableOS, ordered]);

  const handleSelect = (os: OSId) => {
    setSelected(os);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, os);
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

  const active = ordered.find((b) => b.os === selected) ?? ordered[0];
  const isSingle = ordered.length === 1;

  return (
    <div className="group my-4 overflow-hidden rounded-lg border border-white/[0.10] bg-[--color-bg-elevated,#0a0a0a] text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-2 py-1.5">
        <div
          role="tablist"
          id={tablistId}
          aria-label="Operating system"
          className="flex items-center gap-1"
        >
          {ordered.map((b) => {
            const isActive = b.os === active.os;
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
                  key={b.os}
                  role="tab"
                  aria-selected="true"
                  aria-disabled="true"
                  className={cn(commonClass, 'cursor-default')}
                >
                  {OS_LABEL[b.os]}
                </span>
              );
            }
            return (
              <button
                key={b.os}
                role="tab"
                type="button"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleSelect(b.os)}
                className={commonClass}
              >
                {OS_LABEL[b.os]}
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
