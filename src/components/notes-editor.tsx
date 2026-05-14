'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Save, Trash2, Download, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ToolStub {
  slug: string;
  title: string;
}

interface Props {
  tools: ToolStub[];
}

interface NoteEntry {
  body: string;
  updated_at: string;
}

type NotesMap = Record<string, NoteEntry>;

const STORAGE_KEY = 'aitools_notes';

function readNotes(): NotesMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: NotesMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!v || typeof v !== 'object') continue;
      const entry = v as Record<string, unknown>;
      const body = typeof entry.body === 'string' ? entry.body : '';
      const updated_at = typeof entry.updated_at === 'string' ? entry.updated_at : new Date(0).toISOString();
      out[k] = { body, updated_at };
    }
    return out;
  } catch {
    return {};
  }
}

function writeNotes(notes: NotesMap) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore quota errors
  }
}

function formatTimestamp(iso: string | undefined): string {
  if (!iso) return 'Never saved';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || d.getTime() === 0) return 'Never saved';
  const now = Date.now();
  const diff = Math.max(0, now - d.getTime());
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return 'Saved just now';
  if (sec < 60) return `Saved ${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `Saved ${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `Saved ${hr}h ago`;
  return `Saved ${d.toLocaleDateString()}`;
}

export default function NotesEditor({ tools }: Props) {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<NotesMap>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>('');
  const [savedTick, setSavedTick] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justSavedRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const loaded = readNotes();
    setNotes(loaded);
    if (tools.length > 0) {
      setSelected(tools[0].slug);
      setDraft(loaded[tools[0].slug]?.body ?? '');
    }
  }, [tools]);

  // Refresh "X ago" text every 30s
  useEffect(() => {
    const id = window.setInterval(() => setSavedTick((t) => t + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Sync draft when selecting a different tool
  useEffect(() => {
    if (!mounted || !selected) return;
    setDraft(notes[selected]?.body ?? '');
    // We intentionally only react to selected change, not notes (avoid clobbering edits)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, mounted]);

  // Debounced autosave
  useEffect(() => {
    if (!mounted || !selected) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const current = notes[selected]?.body ?? '';
    if (draft === current) return;
    debounceRef.current = setTimeout(() => {
      const next: NotesMap = { ...notes };
      if (draft.length === 0) {
        delete next[selected];
      } else {
        next[selected] = { body: draft, updated_at: new Date().toISOString() };
      }
      setNotes(next);
      writeNotes(next);
      setJustSaved(true);
      if (justSavedRef.current) clearTimeout(justSavedRef.current);
      justSavedRef.current = setTimeout(() => setJustSaved(false), 1500);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [draft, selected, mounted, notes]);

  const selectedTool = useMemo(
    () => tools.find((t) => t.slug === selected) ?? null,
    [tools, selected],
  );

  const charCount = draft.length;
  const lastSaved = selected ? notes[selected]?.updated_at : undefined;
  void savedTick; // reference to trigger re-render

  const handleSaveNow = () => {
    if (!selected) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const next: NotesMap = { ...notes };
    if (draft.length === 0) {
      delete next[selected];
    } else {
      next[selected] = { body: draft, updated_at: new Date().toISOString() };
    }
    setNotes(next);
    writeNotes(next);
    setJustSaved(true);
    if (justSavedRef.current) clearTimeout(justSavedRef.current);
    justSavedRef.current = setTimeout(() => setJustSaved(false), 1500);
  };

  const handleExport = () => {
    if (!selected || !selectedTool) return;
    const body = draft;
    const md = `# ${selectedTool.title} notes\n\n${body}\n`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${selected}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (!selected) return;
    const ok = window.confirm('Delete the note for this tool? This cannot be undone.');
    if (!ok) return;
    const next: NotesMap = { ...notes };
    delete next[selected];
    setNotes(next);
    writeNotes(next);
    setDraft('');
  };

  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <div className="h-[480px] rounded-2xl border border-line bg-surface-1" aria-hidden />
        </div>
        <div className="h-[520px] rounded-2xl border border-line bg-surface-1" aria-hidden />
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface-1 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line-2 bg-surface-2">
          <FileText className="h-5 w-5 text-ink-faint" />
        </div>
        <p className="mt-4 text-base text-ink">No tools available yet.</p>
        <p className="mt-1 text-sm text-ink-mute">Come back once tools are published to start taking notes.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-bright"
        >
          Browse tools
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <div className="rounded-2xl border border-line bg-surface-1 lg:h-full lg:overflow-y-auto">
          <div className="border-b border-line px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Tools</p>
            <p className="mt-1 text-xs text-ink-mute">{tools.length} available</p>
          </div>
          <ul className="divide-y divide-line">
            {tools.map((t) => {
              const note = notes[t.slug];
              const hasNote = !!note && note.body.length > 0;
              const active = selected === t.slug;
              return (
                <li key={t.slug}>
                  <button
                    type="button"
                    onClick={() => setSelected(t.slug)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition-colors',
                      'hover:bg-surface-2',
                      'focus:outline-none focus-visible:bg-surface-2',
                      active ? 'bg-surface-2 text-ink' : 'text-ink-dim',
                    )}
                    aria-current={active ? 'true' : undefined}
                  >
                    <span className="truncate font-medium">{t.title}</span>
                    {hasNote && (
                      <span
                        className={cn(
                          'inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                          active
                            ? 'border-line-2 bg-surface-1 text-ink-dim'
                            : 'border-line bg-surface-1 text-ink-mute',
                        )}
                        title={`${note!.body.length} characters`}
                      >
                        {note!.body.length} chars
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div>
        {selectedTool ? (
          <div className="rounded-2xl border border-line bg-surface-1">
            <div className="flex flex-col gap-4 border-b border-line px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-medium text-ink">{selectedTool.title}</h2>
                <p className="mt-0.5 text-sm text-ink-mute">Notes</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveNow}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border border-line-2 bg-surface-1 px-3 py-1.5 text-xs font-medium text-ink-dim transition-colors',
                    'hover:border-line-2 hover:bg-surface-2 hover:text-ink',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                  )}
                >
                  {justSaved ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={draft.length === 0}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border border-line-2 bg-surface-1 px-3 py-1.5 text-xs font-medium text-ink-dim transition-colors',
                    'hover:border-line-2 hover:bg-surface-2 hover:text-ink',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                    'disabled:opacity-50 disabled:hover:bg-surface-1 disabled:hover:text-ink-dim disabled:cursor-not-allowed',
                  )}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!notes[selected!] || notes[selected!].body.length === 0}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border border-line-2 bg-surface-1 px-3 py-1.5 text-xs font-medium text-ink-mute transition-colors',
                    'hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40',
                    'disabled:opacity-50 disabled:hover:bg-surface-1 disabled:hover:text-ink-mute disabled:hover:border-line-2 disabled:cursor-not-allowed',
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>

            <div className="px-5 py-4">
              <label htmlFor="notes-textarea" className="sr-only">
                Notes for {selectedTool.title}
              </label>
              <textarea
                id="notes-textarea"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={18}
                placeholder={`Jot down what matters about ${selectedTool.title}. Markdown is welcome.`}
                spellCheck
                className={cn(
                  'block w-full resize-y rounded-lg border border-line-2 bg-surface-2 px-4 py-3 font-mono text-sm leading-relaxed text-ink',
                  'placeholder:text-ink-faint',
                  'focus:border-line-2 focus:outline-none focus:ring-2 focus:ring-accent/30',
                )}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3 text-xs text-ink-mute">
              <span>
                {charCount.toLocaleString()} {charCount === 1 ? 'character' : 'characters'}
              </span>
              <span>{formatTimestamp(lastSaved)}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface-1 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line-2 bg-surface-2">
              <FileText className="h-5 w-5 text-ink-faint" />
            </div>
            <p className="mt-4 text-base text-ink">Pick a tool from the list to start taking notes.</p>
            <p className="mt-1 text-sm text-ink-mute">Your notes stay in this browser.</p>
          </div>
        )}
      </div>
    </div>
  );
}
