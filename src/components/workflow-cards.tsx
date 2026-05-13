import { Check, ChevronDown } from 'lucide-react';
import type { Workflow } from '@/lib/types';

interface Props {
  workflows: Workflow[] | null;
}

export default function WorkflowCards({ workflows }: Props) {
  if (!workflows || workflows.length === 0) return null;

  return (
    <section>
      <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-4">
        Workflow examples
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((workflow, idx) => (
          <details
            key={`${workflow.title}-${idx}`}
            className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center open:bg-white/[0.04] transition"
          >
            <summary className="cursor-pointer list-none">
              <span className="text-lg font-medium text-ink">{workflow.title}</span>
              <ChevronDown className="h-4 w-4 text-ink-faint mx-auto mt-2 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-4">
              <code className="block rounded-md bg-white/[0.05] p-3 text-left text-xs font-mono text-ink whitespace-pre-wrap">
                {workflow.prompt}
              </code>
              <ol className="mt-4 list-decimal text-left max-w-md mx-auto space-y-1.5 pl-5 text-sm text-ink-mute">
                {workflow.steps.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ol>
              <div className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-success/10 px-3 py-1.5 text-xs text-success">
                <Check className="h-3 w-3" /> {workflow.outcome}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
