import { Pool } from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Tool, Stack, ToolDetail, StackWithTools } from './types';

let _pool: Pool | null = null;
let _migrationsPromise: Promise<void> | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  _pool = new Pool({
    connectionString: url,
    ssl: url.includes('localhost') ? false : { rejectUnauthorized: false },
  });
  return _pool;
}

/**
 * Runs migrations once per process. Safe to call from any request handler;
 * subsequent calls await the first one. Idempotent: each migration file is
 * recorded in `schema_migrations` and skipped on later boots.
 */
export function ensureMigrations(): Promise<void> {
  if (!_migrationsPromise) {
    _migrationsPromise = runMigrations().catch((err) => {
      _migrationsPromise = null; // allow retry on next request
      throw err;
    });
  }
  return _migrationsPromise;
}

async function runMigrations(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    const dir = path.resolve(process.cwd(), 'migrations');
    const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
    for (const file of files) {
      const exists = await client.query(
        'SELECT 1 FROM schema_migrations WHERE name = $1',
        [file],
      );
      if (exists.rowCount && exists.rowCount > 0) continue;
      const sql = await readFile(path.join(dir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations(name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[migrate] applied ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
  }
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toIso(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'string') return v;
  return null;
}

function rowToTool(row: Record<string, unknown>): Tool {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    url: row.url as string,
    tagline: (row.tagline as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    category: (row.category as Tool['category']) ?? null,
    tags: (row.tags as string[] | null) ?? [],
    install_md: (row.install_md as string | null) ?? null,
    usage_md: (row.usage_md as string | null) ?? null,
    cheatsheet_md: (row.cheatsheet_md as string | null) ?? null,
    pricing_md: (row.pricing_md as string | null) ?? null,
    resources_md: (row.resources_md as string | null) ?? null,
    asciinema_id: (row.asciinema_id as string | null) ?? null,
    pricing: (row.pricing as Tool['pricing']) ?? null,
    difficulty: (row.difficulty as Tool['difficulty']) ?? null,
    time_to_value: (row.time_to_value as string | null) ?? null,
    status: row.status as Tool['status'],
    submitter: (row.submitter as string | null) ?? null,
    is_curated: Boolean(row.is_curated),
    last_verified: toIso(row.last_verified),
    created_at: toIso(row.created_at) ?? new Date(0).toISOString(),
    approved_at: toIso(row.approved_at),
  };
}

function rowToStack(row: Record<string, unknown>): Stack {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: (row.name as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    tool_ids: (row.tool_ids as string[] | null) ?? [],
    is_curated: Boolean(row.is_curated),
    created_at: toIso(row.created_at) ?? new Date(0).toISOString(),
  };
}

const TOOL_COLS = `
  id, slug, title, url, tagline, description, category, tags,
  install_md, usage_md, cheatsheet_md, pricing_md, resources_md, asciinema_id,
  pricing, difficulty, time_to_value, status, submitter, is_curated,
  last_verified, created_at, approved_at
`;

// ─── Queries used by server components and API routes ────────────────────────

export async function listApprovedTools(opts: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ tools: Tool[]; total: number }> {
  await ensureMigrations();
  const pool = getPool();
  const where: string[] = [`status = 'approved'`];
  const params: unknown[] = [];
  if (opts.category) {
    params.push(opts.category);
    where.push(`category = $${params.length}`);
  }
  if (opts.q) {
    params.push(`%${opts.q}%`);
    const i = params.length;
    where.push(
      `(title ILIKE $${i} OR description ILIKE $${i} OR EXISTS (SELECT 1 FROM unnest(tags) t WHERE t ILIKE $${i}))`,
    );
  }
  const whereSql = where.join(' AND ');
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);
  const offset = Math.max(opts.offset ?? 0, 0);

  const [countRes, rowsRes] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS count FROM tools WHERE ${whereSql}`, params),
    pool.query(
      `SELECT ${TOOL_COLS} FROM tools WHERE ${whereSql} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params,
    ),
  ]);
  return {
    tools: rowsRes.rows.map(rowToTool),
    total: (countRes.rows[0] as { count: number }).count,
  };
}

/**
 * Returns counts of approved tools per category in a single query.
 * Used by the homepage tab bar.
 */
export async function getCategoryCounts(): Promise<{
  total: number;
  byCategory: Record<string, number>;
}> {
  await ensureMigrations();
  const pool = getPool();
  const res = await pool.query<{ category: string | null; count: string }>(
    `SELECT category, COUNT(*)::int AS count
       FROM tools
      WHERE status = 'approved'
      GROUP BY category`,
  );
  const byCategory: Record<string, number> = {};
  let total = 0;
  for (const row of res.rows) {
    const n = Number(row.count) || 0;
    total += n;
    if (row.category) byCategory[row.category] = n;
  }
  return { total, byCategory };
}

export async function getToolBySlug(slug: string): Promise<ToolDetail | null> {
  await ensureMigrations();
  const pool = getPool();
  const res = await pool.query(
    `SELECT ${TOOL_COLS},
            COALESCE(
              (SELECT json_agg(s_row ORDER BY s_row.created_at DESC)
                 FROM (
                   SELECT s.id, s.slug, s.name, s.description, s.tool_ids,
                          s.is_curated, s.created_at
                     FROM stacks s
                    WHERE s.is_curated = TRUE
                      AND tools.id = ANY(s.tool_ids)
                 ) AS s_row),
              '[]'::json
            ) AS used_in_stacks
       FROM tools
      WHERE slug = $1 AND status = 'approved'
      LIMIT 1`,
    [slug],
  );
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  const tool = rowToTool(row);
  const rawStacks = row.used_in_stacks as Array<Record<string, unknown>> | null;
  const stacks = Array.isArray(rawStacks) ? rawStacks.map(rowToStack) : [];
  return { ...tool, used_in_stacks: stacks };
}

export async function listCuratedStacks(): Promise<Stack[]> {
  await ensureMigrations();
  const pool = getPool();
  const res = await pool.query(
    `SELECT id, slug, name, description, tool_ids, is_curated, created_at
       FROM stacks WHERE is_curated = TRUE ORDER BY created_at DESC`,
  );
  return res.rows.map(rowToStack);
}

export async function getStackBySlug(slug: string): Promise<StackWithTools | null> {
  await ensureMigrations();
  const pool = getPool();
  const stackRes = await pool.query(
    `SELECT id, slug, name, description, tool_ids, is_curated, created_at
       FROM stacks WHERE slug = $1 LIMIT 1`,
    [slug],
  );
  if (stackRes.rowCount === 0) return null;
  const stack = rowToStack(stackRes.rows[0]);
  if (stack.tool_ids.length === 0) return { ...stack, tools: [] };
  const toolsRes = await pool.query(
    `SELECT ${TOOL_COLS} FROM tools WHERE id = ANY($1::uuid[]) AND status = 'approved'`,
    [stack.tool_ids],
  );
  const byId = new Map(toolsRes.rows.map((r) => [r.id as string, rowToTool(r)]));
  const tools = stack.tool_ids.map((id) => byId.get(id)).filter((t): t is Tool => Boolean(t));
  return { ...stack, tools };
}

export { rowToTool, rowToStack, TOOL_COLS };
