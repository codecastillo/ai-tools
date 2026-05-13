import { Check, Minus } from 'lucide-react';
import type { Tool } from '@/lib/types';

interface Props {
  tool: Tool;
}

interface Feature {
  id: string;
  label: string;
  predicate: (t: Tool) => boolean;
}

const FEATURES: Feature[] = [
  {
    id: 'free-tier',
    label: 'Free tier',
    predicate: (t) => t.pricing === 'free' || t.pricing === 'freemium' || t.pricing === 'oss',
  },
  {
    id: 'oss',
    label: 'Open source',
    predicate: (t) => t.pricing === 'oss',
  },
  {
    id: 'cli',
    label: 'Command line',
    predicate: (t) => t.category === 'clis' || t.tags.some((s) => /cli|terminal/i.test(s)),
  },
  {
    id: 'ide',
    label: 'IDE integration',
    predicate: (t) => t.tags.some((s) => /ide|editor|vscode|cursor|jetbrains/i.test(s)),
  },
  {
    id: 'api',
    label: 'API access',
    predicate: (t) => t.tags.some((s) => /api|sdk/i.test(s)) || t.category === 'frameworks',
  },
  {
    id: 'agent',
    label: 'Agent / tool use',
    predicate: (t) => t.tags.some((s) => /agent|tool|mcp/i.test(s)),
  },
  {
    id: 'streaming',
    label: 'Streaming responses',
    predicate: (t) => t.category === 'frameworks' || t.tags.some((s) => /stream/i.test(s)),
  },
  {
    id: 'easy',
    label: 'Beginner friendly',
    predicate: (t) => t.difficulty === 'easy',
  },
];

export function FeatureMatrix({ tool }: Props) {
  return (
    <div>
      <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-3">
        At a glance
      </h3>
      <div className="rounded-xl border border-line bg-surface-1 divide-y divide-white/[0.04]">
        {FEATURES.map((f) => {
          const has = f.predicate(tool);
          return (
            <div key={f.id} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-ink-dim">{f.label}</span>
              {has ? (
                <Check className="h-4 w-4 text-success" aria-label="Yes" />
              ) : (
                <Minus className="h-4 w-4 text-ink-faint" aria-label="No" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeatureMatrix;
