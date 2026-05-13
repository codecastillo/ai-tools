'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CodeBlockProps {
  html: string;
  code: string;
  lang?: string;
  /**
   * Optional override label for the language pill. Falls back to `lang`.
   */
  label?: string;
  /**
   * Hide the header row entirely (used by parent containers — e.g. OSTabs —
   * that supply their own header / tab strip).
   */
  hideHeader?: boolean;
  className?: string;
}

/**
 * Renders pre-sanitized Shiki HTML inside a styled surface with a
 * language pill and a copy-to-clipboard button.
 */
export default function CodeBlock({
  html,
  code,
  lang,
  label,
  hideHeader = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers / non-secure contexts.
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
      // Silently fail — clipboard permission denied, etc.
    }
  }, [code]);

  const displayLabel = (label ?? lang ?? 'text').toLowerCase();

  return (
    <div
      className={cn(
        'group my-4 overflow-hidden rounded-lg border border-white/[0.10] bg-[--color-bg-elevated,#0a0a0a] text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.4)]',
        className,
      )}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
            {displayLabel}
          </span>
          <button
            type="button"
            onClick={handleCopy}
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
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
      <div
        className="overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:!bg-transparent [&_code]:!px-0 [&_code]:!py-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
