/**
 * localStorage-backed draft stack of tool IDs.
 * Mutations dispatch a 'aitools:draft-stack-changed' CustomEvent so subscribers
 * (e.g. the floating <StackPill>, the +/✓ button on each card) can re-render.
 *
 * SSR-safe: every function guards against `window` being undefined.
 */

const KEY = 'aitools:draft-stack';
const EVT = 'aitools:draft-stack-changed';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function dispatch(ids: string[]): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent<string[]>(EVT, { detail: ids }));
}

function readRaw(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

function writeRaw(ids: string[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // quota or privacy mode. Swallow.
  }
}

export function getDraft(): string[] {
  return readRaw();
}

export function setDraft(ids: string[]): void {
  // de-dupe while preserving order
  const seen = new Set<string>();
  const clean = ids.filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  writeRaw(clean);
  dispatch(clean);
}

export function addToDraft(id: string): void {
  const current = readRaw();
  if (current.includes(id)) return;
  const next = [...current, id];
  writeRaw(next);
  dispatch(next);
}

export function removeFromDraft(id: string): void {
  const current = readRaw();
  if (!current.includes(id)) return;
  const next = current.filter((x) => x !== id);
  writeRaw(next);
  dispatch(next);
}

export function clearDraft(): void {
  writeRaw([]);
  dispatch([]);
}

export function reorderDraft(from: number, to: number): void {
  const current = readRaw();
  if (from < 0 || from >= current.length) return;
  if (to < 0 || to >= current.length) return;
  if (from === to) return;
  const next = current.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  writeRaw(next);
  dispatch(next);
}

/**
 * Subscribe to draft changes. Returns an unsubscribe function.
 * Also listens to `storage` events so changes in another tab propagate.
 */
export function onDraftChange(cb: (ids: string[]) => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<string[]>).detail;
    cb(Array.isArray(detail) ? detail : readRaw());
  };
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY) cb(readRaw());
  };
  window.addEventListener(EVT, handler);
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}
