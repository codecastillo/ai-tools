'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dices } from 'lucide-react';

export default function SurpriseMeButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/random-tool');
      if (!res.ok) throw new Error('bad');
      const data = (await res.json()) as { slug: string | null };
      if (data.slug) router.push(`/tools/${data.slug}`);
    } catch {
      // Silent fail — no-op
    } finally {
      setBusy(false);
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Surprise me with a random tool"
      title="Surprise me"
      disabled={busy}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-ink-mute transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent disabled:opacity-50"
    >
      <Dices className={`h-4 w-4 ${busy ? 'animate-spin' : 'transition-transform hover:rotate-12'}`} />
    </button>
  );
}
