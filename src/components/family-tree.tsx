import { FAMILY_LABEL, FAMILY_NODES, type FamilyNode } from '@/lib/families';

const FAMILY_COLOR: Record<FamilyNode['family'], string> = {
  gpt: '#10A37F',
  claude: '#D97757',
  llama: '#4A8FE7',
  gemini: '#8B5CF6',
  mistral: '#FF8C42',
  deepseek: '#2563EB',
  qwen: '#A855F7',
  grok: '#E5E5E5',
};

const FAMILY_ORDER: FamilyNode['family'][] = [
  'gpt',
  'claude',
  'gemini',
  'llama',
  'mistral',
  'grok',
  'qwen',
  'deepseek',
];

function sortLineage(nodes: FamilyNode[]): FamilyNode[] {
  // Walk from root (no parent) down each child link. Falls back to release date
  // for ties so we always render oldest at the top.
  const byParent = new Map<string | undefined, FamilyNode[]>();
  for (const node of nodes) {
    const key = node.parent;
    const bucket = byParent.get(key);
    if (bucket) {
      bucket.push(node);
    } else {
      byParent.set(key, [node]);
    }
  }
  for (const bucket of byParent.values()) {
    bucket.sort((a, b) => a.release.localeCompare(b.release));
  }

  const ordered: FamilyNode[] = [];
  const visit = (parent: string | undefined) => {
    const children = byParent.get(parent) ?? [];
    for (const child of children) {
      ordered.push(child);
      visit(child.id);
    }
  };
  visit(undefined);
  return ordered;
}

export default function FamilyTree() {
  const grouped = FAMILY_ORDER.map((family) => {
    const lineage = sortLineage(FAMILY_NODES.filter((n) => n.family === family));
    return { family, lineage };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {grouped.map(({ family, lineage }) => {
        const color = FAMILY_COLOR[family];
        return (
          <div
            key={family}
            className="rounded-2xl border border-line bg-surface-1 p-5"
          >
            <div className="flex items-center gap-2.5 pb-4">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <h2 className="text-sm font-medium uppercase tracking-wider text-ink">
                {FAMILY_LABEL[family]}
              </h2>
            </div>

            <ol className="relative">
              {lineage.map((node, idx) => {
                const isLast = idx === lineage.length - 1;
                return (
                  <li key={node.id} className="relative pb-5 last:pb-0">
                    {!isLast ? (
                      <span
                        aria-hidden
                        className="absolute left-4 top-[2.25rem] bottom-0 w-px"
                        style={{
                          backgroundColor: color,
                          opacity: 0.35,
                        }}
                      />
                    ) : null}

                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="relative z-10 mt-1.5 inline-flex h-2 w-2 flex-none rounded-full ring-4 ring-bg"
                        style={{ backgroundColor: color }}
                      />

                      <div className="min-w-0 flex-1 rounded-lg border border-line bg-surface-2 px-3.5 py-2.5 transition-colors hover:border-line-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-sm font-medium text-ink truncate">
                            {node.label}
                          </h3>
                          <time
                            dateTime={node.release}
                            className="text-[11px] font-mono text-ink-faint flex-none"
                          >
                            {node.release}
                          </time>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-ink-dim">
                          {node.notes}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
