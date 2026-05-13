const KEY = 'aitools:recently-viewed';
const MAX = 5;
const EVENT = 'aitools:recents-changed';

export interface RecentEntry {
  slug: string;
  title: string;
  at: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function readRecents(): RecentEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: RecentEntry[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === 'object' &&
        typeof item.slug === 'string' &&
        typeof item.title === 'string' &&
        typeof item.at === 'number'
      ) {
        out.push({ slug: item.slug, title: item.title, at: item.at });
      }
    }
    return out.slice(0, MAX);
  } catch {
    return [];
  }
}

export function pushRecent(e: { slug: string; title: string }): void {
  if (!isBrowser()) return;
  if (!e.slug || !e.title) return;
  try {
    const current = readRecents();
    const filtered = current.filter((r) => r.slug !== e.slug);
    const next: RecentEntry[] = [
      { slug: e.slug, title: e.title, at: Date.now() },
      ...filtered,
    ].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // swallow
  }
}

export const RECENTS_EVENT = EVENT;
