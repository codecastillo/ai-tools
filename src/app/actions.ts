'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ensureMigrations, getPool, rowToTool, TOOL_COLS } from '@/lib/db';
import { toSlug, insertWithSlugRetry } from '@/lib/slug';
import { findDuplicates } from '@/lib/duplicate';
import { fetchMetadata, UnsafeUrlError, FetchSizeError } from '@/lib/metadata';
import type { Tool } from '@/lib/types';

const CATEGORIES = ['claude', 'clis', 'frameworks', 'productivity'] as const;

const httpUrl = z
  .string()
  .trim()
  .min(1, 'URL is required')
  .max(2048)
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Must be a valid http(s) URL');

const submissionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  url: httpUrl,
  description: z.string().trim().max(2000).optional(),
  category: z.enum(CATEGORIES).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  submitter: z.string().trim().max(120).optional(),
});

export interface SubmissionState {
  ok?: true;
  errors?: Record<string, string>;
  tool?: Tool;
}

export async function submitTool(
  _prev: SubmissionState | null,
  formData: FormData,
): Promise<SubmissionState> {
  await ensureMigrations();

  const raw = {
    title: String(formData.get('title') ?? ''),
    url: String(formData.get('url') ?? ''),
    description: String(formData.get('description') ?? ''),
    category: String(formData.get('category') ?? ''),
    tags: String(formData.get('tags') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    submitter: String(formData.get('submitter') ?? ''),
  };

  const cleaned = {
    title: raw.title,
    url: raw.url,
    ...(raw.description ? { description: raw.description } : {}),
    ...(raw.category && (CATEGORIES as readonly string[]).includes(raw.category)
      ? { category: raw.category as (typeof CATEGORIES)[number] }
      : {}),
    ...(raw.tags.length ? { tags: raw.tags } : {}),
    ...(raw.submitter ? { submitter: raw.submitter } : {}),
  };

  const parsed = submissionSchema.safeParse(cleaned);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path.join('.') || '_';
      if (!errors[k]) errors[k] = issue.message;
    }
    return { errors };
  }

  const pool = getPool();
  const base = toSlug(parsed.data.title);
  try {
    const row = await insertWithSlugRetry(base, async (slug) => {
      const res = await pool.query(
        `INSERT INTO tools (slug, title, url, description, category, tags, submitter, status, is_curated)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',FALSE)
         RETURNING ${TOOL_COLS}`,
        [
          slug,
          parsed.data.title,
          parsed.data.url,
          parsed.data.description ?? null,
          parsed.data.category ?? null,
          parsed.data.tags ?? [],
          parsed.data.submitter ?? null,
        ],
      );
      return res.rows[0];
    });
    revalidatePath('/');
    return { ok: true, tool: rowToTool(row) };
  } catch (err) {
    console.error('[submit] insert failed', err);
    return { errors: { _: 'Database error. Please try again.' } };
  }
}

export async function checkDuplicate(
  title: string,
  url: string,
): Promise<{ matches: Array<{ slug: string; title: string; score: number }> }> {
  if (!title.trim() && !url.trim()) return { matches: [] };
  await ensureMigrations();
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT slug, title, url FROM tools WHERE status IN ('approved','pending')`,
  );
  return findDuplicates({ title, url }, rows as Array<{ slug: string; title: string; url: string }>);
}

export async function lookupMetadata(
  url: string,
): Promise<{ title?: string | null; description?: string | null; error?: string }> {
  if (!url.trim()) return { error: 'URL required' };
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 8000); // outer ceiling
  try {
    const meta = await Promise.race([
      fetchMetadata(url.trim()),
      new Promise<never>((_, reject) => {
        ac.signal.addEventListener('abort', () =>
          reject(new Error('Metadata lookup timed out')),
        );
      }),
    ]);
    return { title: meta.title, description: meta.description };
  } catch (err) {
    if (err instanceof UnsafeUrlError) return { error: err.message };
    if (err instanceof FetchSizeError) return { error: 'Page too large' };
    if (err instanceof Error && /timed out/i.test(err.message)) {
      return { error: 'Metadata lookup timed out' };
    }
    return { error: 'Could not fetch metadata' };
  } finally {
    clearTimeout(timer);
  }
}
