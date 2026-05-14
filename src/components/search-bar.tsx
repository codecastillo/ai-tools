'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
}

const HISTORY_KEY = 'aitools_search_history';
const MAX_HISTORY = 20;
const VISIBLE_HISTORY = 6;

function readHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

function writeHistory(history: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export default function SearchBar({ placeholder = 'Search tools…' }: SearchBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [value, setValue] = useState(initial);
  const [history, setHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const recordRef = useRef<number | null>(null);

  // Load history from localStorage on mount.
  useEffect(() => {
    setHistory(readHistory());
  }, []);

  // Focus on "/" anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '/') return;
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (inField) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Hide the dropdown on outside click.
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const node = containerRef.current;
      if (!node) return;
      if (e.target instanceof Node && !node.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const recordHistory = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const filtered = prev.filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      writeHistory(next);
      return next;
    });
  }, []);

  function pushQuery(q: string) {
    const next = new URLSearchParams(params.toString());
    if (q) next.set('q', q);
    else next.delete('q');
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : '/', { scroll: false });
    });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    // User started typing: hide the recent-searches dropdown so live
    // results can take over.
    if (showDropdown) setShowDropdown(false);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => pushQuery(v), 200);
    if (recordRef.current) window.clearTimeout(recordRef.current);
    if (v.trim()) {
      recordRef.current = window.setTimeout(() => recordHistory(v), 900);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (recordRef.current) window.clearTimeout(recordRef.current);
    recordHistory(value);
    pushQuery(value);
    setShowDropdown(false);
  }

  function onFocus() {
    setShowDropdown(true);
  }

  function runHistoryEntry(entry: string) {
    setValue(entry);
    recordHistory(entry);
    pushQuery(entry);
    setShowDropdown(false);
    inputRef.current?.blur();
  }

  function removeHistoryEntry(entry: string) {
    setHistory((prev) => {
      const next = prev.filter((q) => q !== entry);
      writeHistory(next);
      return next;
    });
  }

  const visibleHistory = history.slice(0, VISIBLE_HISTORY);
  const dropdownOpen = showDropdown && value.trim().length === 0;

  return (
    <div ref={containerRef} className="group relative flex w-full max-w-2xl items-center">
      <form onSubmit={onSubmit} className="relative w-full">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint transition-colors duration-200 group-focus-within:text-accent-bright" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          aria-label="Search tools"
          className="w-full rounded-xl border border-line-2 bg-surface-1 py-3.5 pl-11 pr-14 text-[15px] text-ink placeholder:text-ink-faint shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 focus:border-accent/80 focus:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_24px_-12px_var(--color-accent-glow),inset_0_1px_0_rgba(255,255,255,0.04)]"
        />
        <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-line-2 bg-surface-1 px-1.5 py-0.5 font-mono text-[11px] text-ink-faint transition-colors group-focus-within:border-accent/30 group-focus-within:text-accent-bright">
          /
        </kbd>
      </form>

      {dropdownOpen ? (
        <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-lg border border-line bg-surface-1 p-2 shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-ink-faint px-2 py-1">
            Recent searches
          </div>
          {visibleHistory.length === 0 ? (
            <div className="px-2 py-2 text-sm text-ink-faint">No recent searches</div>
          ) : (
            <ul className="flex flex-col">
              {visibleHistory.map((entry) => (
                <li key={entry} className="group/item flex items-center">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      runHistoryEntry(entry);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-ink hover:bg-surface-2"
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                    <span className="truncate">{entry}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${entry} from recent searches`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeHistoryEntry(entry);
                    }}
                    className="ml-1 mr-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink-faint hover:bg-surface-2 hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
