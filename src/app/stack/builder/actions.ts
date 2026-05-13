'use server';

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { ensureMigrations, getPool } from '@/lib/db';

const schema = z.object({
  tool_ids: z.array(z.string().uuid()).min(1).max(50),
  name: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export async function shareStack(
  input: unknown,
): Promise<{ slug?: string; error?: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: 'Invalid input' };

  await ensureMigrations();
  const pool = getPool();

  // Validate all tool_ids are approved & exist.
  const check = await pool.query<{ id: string }>(
    `SELECT id FROM tools WHERE id = ANY($1::uuid[]) AND status = 'approved'`,
    [parsed.data.tool_ids],
  );
  const valid = new Set(check.rows.map((r) => r.id));
  const missing = parsed.data.tool_ids.filter((id) => !valid.has(id));
  if (missing.length) return { error: 'Some tools are no longer available' };

  // Insert with nanoid(8) slug; retry up to 3 times on unique-violation collision.
  for (let i = 0; i < 3; i++) {
    const slug = nanoid(8);
    try {
      await pool.query(
        `INSERT INTO stacks (slug, name, description, tool_ids, is_curated)
         VALUES ($1, $2, $3, $4::uuid[], FALSE)`,
        [
          slug,
          parsed.data.name ?? null,
          parsed.data.description ?? null,
          parsed.data.tool_ids,
        ],
      );
      return { slug };
    } catch (err) {
      // 23505 = unique_violation; retry. Anything else, rethrow.
      const code = (err as { code?: string } | null)?.code;
      if (code !== '23505') throw err;
    }
  }
  return { error: 'Could not allocate a unique slug. Try again.' };
}
