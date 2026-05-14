import type { Tool } from '@/lib/types';
import { Sparkles, Target, ShieldX, User, Star } from 'lucide-react';

interface Props {
  tool: Tool;
}

export default function ToolDna({ tool }: Props) {
  if (!tool.tool_dna) return null;

  const dna = tool.tool_dna;

  return (
    <section className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8 text-center">
      <Sparkles className="h-5 w-5 text-accent mx-auto" />
      <h2 className="mt-2 text-xl font-medium text-ink">Tool DNA</h2>
      <p className="mt-1 text-sm text-ink-mute">Personality at a glance.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Vibe
          </p>
          <p className="mt-2 text-lg italic text-ink-dim">{dna.vibe}</p>
        </div>

        <div>
          <p className="inline-flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            <Target className="h-3 w-3 text-accent" />
            Best for
          </p>
          <div className="mt-3 space-y-2 text-sm text-ink-dim">
            {dna.best_for.map((item) => (
              <p key={item} className="text-center">
                <span className="mr-1.5 text-accent">+</span>
                {item}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="inline-flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            <ShieldX className="h-3 w-3 text-ink-faint" />
            Not for
          </p>
          <div className="mt-3 space-y-2 text-sm text-ink-dim">
            {dna.not_for.map((item) => (
              <p key={item} className="text-center">
                <span className="mr-1.5 text-ink-faint">-</span>
                {item}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="inline-flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            <User className="h-3 w-3 text-ink-mute" />
            Typical user
          </p>
          <p className="mt-2 text-sm text-ink-dim">{dna.typical_user}</p>
        </div>

        <div className="md:col-span-2">
          <p className="inline-flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            <Star className="h-3 w-3 text-accent-2" />
            Signature move
          </p>
          <p className="mt-2 text-sm text-ink-dim">{dna.signature_move}</p>
        </div>
      </div>
    </section>
  );
}
