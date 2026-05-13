'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { cn } from '@/lib/cn';

interface CompareBuilderProps {
  tools: Tool[];
}

export default function CompareBuilder({ tools }: CompareBuilderProps) {
  const router = useRouter();
  const [a, setA] = useState<string>('claude-code');
  const [b, setB] = useState<string>(() => tools.find((t) => t.slug !== 'claude-code')?.slug ?? '');

  function go() {
    if (!a || !b || a === b) return;
    router.push(`/compare/${a}/vs/${b}`);
  }

  return (
    <div className="rounded-xl border border-white/[0.10] bg-[--color-surface] p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <Picker label="Tool A" value={a} onChange={setA} tools={tools} exclude={b} />
        <div className="hidden items-center justify-center text-ink-faint sm:flex">vs</div>
        <Picker label="Tool B" value={b} onChange={setB} tools={tools} exclude={a} />
      </div>
      <button
        type="button"
        onClick={go}
        disabled={!a || !b || a === b}
        className={cn(
          'mt-5 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-bright',
          (!a || !b || a === b) && 'cursor-not-allowed opacity-50 hover:bg-accent',
        )}
      >
        Compare
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
  tools,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  tools: Tool[];
  exclude?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-[0.10em] text-ink-faint">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-white/[0.14] bg-white/[0.02] px-3 py-2.5 text-sm text-ink focus:border-accent/60 focus:outline-none"
      >
        <option value="">Choose a tool…</option>
        {tools
          .filter((t) => t.slug !== exclude)
          .map((t) => (
            <option key={t.id} value={t.slug}>
              {t.title}
            </option>
          ))}
      </select>
    </label>
  );
}
