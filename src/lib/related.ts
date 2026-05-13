import type { Tool } from './types';

/**
 * Pick up to `limit` tools related to `current`, drawn from `all`.
 *
 * Strategy, in order of preference:
 *   1. Same-category tools ranked by tag overlap + curated bonus.
 *   2. Any other curated tools ranked the same way.
 *   3. Fallback: any remaining candidates, same ranking.
 *
 * Used by `<OftenCompared>` (limit=1) and `<ToolRelated>` (limit=3).
 */
export function pickRelatedTools(current: Tool, all: Tool[], limit = 3): Tool[] {
  const candidates = all.filter((t) => t.id !== current.id);
  if (candidates.length === 0) return [];

  const sameCat = candidates.filter(
    (t) => t.category === current.category && current.category !== null,
  );
  const score = (t: Tool) =>
    t.tags.filter((tag) => current.tags.includes(tag)).length +
    (t.is_curated ? 1 : 0);

  const ranked = (pool: Tool[]) =>
    [...pool].sort((a, b) => score(b) - score(a));

  const out: Tool[] = [];
  for (const t of ranked(sameCat)) {
    if (out.length >= limit) break;
    out.push(t);
  }
  if (out.length < limit) {
    const otherCurated = ranked(
      candidates.filter((t) => t.is_curated && !out.includes(t)),
    );
    for (const t of otherCurated) {
      if (out.length >= limit) break;
      out.push(t);
    }
  }
  if (out.length < limit) {
    for (const t of ranked(candidates).filter((t) => !out.includes(t))) {
      if (out.length >= limit) break;
      out.push(t);
    }
  }
  return out;
}
