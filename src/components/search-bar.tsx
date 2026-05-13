'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search tools…' }: SearchBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [value, setValue] = useState(initial);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);

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
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => pushQuery(v), 200);
  }

  return (
    <div className="group relative flex w-full max-w-2xl items-center">
      <Search className="pointer-events-none absolute left-4 h-4 w-4 text-ink-faint transition-colors duration-200 group-focus-within:text-accent-bright" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="Search tools"
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3.5 pl-11 pr-14 text-[15px] text-ink placeholder:text-ink-faint shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 focus:border-accent/80 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_24px_-12px_var(--color-accent-glow),inset_0_1px_0_rgba(255,255,255,0.04)]"
      />
      <kbd className="pointer-events-none absolute right-4 rounded-md border border-white/[0.10] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-ink-faint transition-colors group-focus-within:border-accent/30 group-focus-within:text-accent-bright">
        /
      </kbd>
    </div>
  );
}
