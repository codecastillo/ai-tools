import type { Tool } from './types';

/**
 * Deterministic "tool of the day". Same tool everywhere for everyone on the
 * same UTC date. Picks from curated tools first; falls back to any approved.
 */
export function pickToolOfTheDay(tools: Tool[], date: Date = new Date()): Tool | null {
  const pool = tools.filter((t) => t.is_curated);
  const list = pool.length > 0 ? pool : tools;
  if (list.length === 0) return null;
  // YYYY-MM-DD UTC → simple FNV-ish hash → index
  const key = date.toISOString().slice(0, 10);
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const idx = Math.abs(hash) % list.length;
  return list[idx];
}
