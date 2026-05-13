'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitTool, checkDuplicate, lookupMetadata } from '@/app/actions';
import { CATEGORIES } from '@/lib/types';
import { cn } from '@/lib/cn';

interface DupMatch {
  slug: string;
  title: string;
  score: number;
}

export default function SubmitForm() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [submitter, setSubmitter] = useState('');

  const [prefilled, setPrefilled] = useState<Set<string>>(new Set());
  const [dupes, setDupes] = useState<DupMatch[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Auto-fetch metadata on URL blur.
  async function tryMetadata(u: string) {
    if (!u) return;
    try {
      new URL(u);
    } catch {
      return;
    }
    const meta = await lookupMetadata(u);
    if (meta.error) return;
    setPrefilled((cur) => {
      const next = new Set(cur);
      setTitle((t) => {
        if (!t && meta.title) {
          next.add('title');
          return meta.title;
        }
        return t;
      });
      setDescription((d) => {
        if (!d && meta.description) {
          next.add('description');
          return meta.description;
        }
        return d;
      });
      return next;
    });
  }

  // Debounced duplicate check on title.
  useEffect(() => {
    if (title.trim().length < 3) {
      setDupes([]);
      return;
    }
    const t = window.setTimeout(async () => {
      const result = await checkDuplicate(title.trim(), url.trim());
      setDupes(result.matches);
    }, 300);
    return () => window.clearTimeout(t);
  }, [title, url]);

  function unmarkPrefilled(field: string) {
    setPrefilled((cur) => {
      if (!cur.has(field)) return cur;
      const next = new Set(cur);
      next.delete(field);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitTool(null, fd);
      if (result.errors) {
        setErrors(result.errors);
      } else if (result.ok) {
        setTitle('');
        setUrl('');
        setDescription('');
        setCategory('');
        setTags('');
        setSubmitter('');
        setPrefilled(new Set());
        setDupes([]);
        setToast("Got it! 🎉 We'll review and add it soon.");
        window.setTimeout(() => setToast(null), 4500);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {toast && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      )}
      {errors._ && (
        <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4" />
          {errors._}
        </div>
      )}

      <Field
        label="URL"
        name="url"
        required
        error={errors.url}
        hint="Paste a URL — we'll fetch the title and description."
      >
        <input
          id="url"
          type="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={(e) => tryMetadata(e.target.value.trim())}
          placeholder="https://example.com/tool"
          required
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? 'url-err' : undefined}
          className={inputClass(!!errors.url)}
        />
      </Field>

      <Field
        label="Title"
        name="title"
        required
        error={errors.title}
        hint={prefilled.has('title') ? '✦ pre-filled from the page' : undefined}
      >
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            unmarkPrefilled('title');
          }}
          placeholder="e.g. Cursor"
          required
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-err' : undefined}
          className={inputClass(!!errors.title)}
        />
      </Field>

      {dupes.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
          <div className="font-medium text-warning">Did you mean…</div>
          <ul className="mt-2 space-y-1.5">
            {dupes.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/tools/${m.slug}`}
                  className="text-ink underline decoration-warning/40 hover:decoration-warning"
                >
                  {m.title}
                </Link>
                <span className="ml-2 text-[11px] text-ink-faint">
                  ({Math.round(m.score * 100)}% match)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Field
        label="Description"
        name="description"
        error={errors.description}
        hint={prefilled.has('description') ? '✦ pre-filled from the page' : 'Optional'}
      >
        <textarea
          id="description"
          name="description"
          rows={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            unmarkPrefilled('description');
          }}
          placeholder="What does it do?"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-err' : undefined}
          className={cn(inputClass(!!errors.description), 'resize-y leading-relaxed')}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" name="category" error={errors.category} hint="Optional">
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? 'category-err' : undefined}
            className={inputClass(!!errors.category)}
          >
            <option value="">— Choose —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tags" name="tags" error={errors.tags} hint="Comma-separated">
          <input
            id="tags"
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="cli, anthropic, terminal"
            aria-invalid={!!errors.tags}
            aria-describedby={errors.tags ? 'tags-err' : undefined}
            className={inputClass(!!errors.tags)}
          />
        </Field>
      </div>

      <Field label="Submitter name" name="submitter" error={errors.submitter} hint="Optional">
        <input
          id="submitter"
          type="text"
          name="submitter"
          value={submitter}
          onChange={(e) => setSubmitter(e.target.value)}
          placeholder="Your name (optional)"
          aria-invalid={!!errors.submitter}
          aria-describedby={errors.submitter ? 'submitter-err' : undefined}
          className={inputClass(!!errors.submitter)}
        />
      </Field>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-ink-faint">
          <Sparkles className="-mt-0.5 mr-1 inline h-3 w-3 text-accent" />
          We review submissions and add install / usage guides before publishing.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-bright disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Submitting…' : 'Submit tool'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </span>
        {hint && !error && <span className="text-[11px] text-ink-faint">{hint}</span>}
      </div>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${name}-err`} className="mt-1.5 text-[12px] text-danger">
          {error}
        </p>
      )}
    </label>
  );
}

function inputClass(invalid: boolean): string {
  return cn(
    'w-full rounded-md border bg-white/[0.02] px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none transition-colors',
    invalid
      ? 'border-danger/50 focus:border-danger'
      : 'border-white/[0.10] focus:border-accent/60 focus:bg-white/[0.04]',
  );
}
