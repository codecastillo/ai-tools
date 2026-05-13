'use server';
import { getPool, ensureMigrations } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().max(200),
  source: z.string().max(50).optional(),
});

export type SubscribeState = {
  status: 'idle' | 'success' | 'duplicate' | 'error';
  message?: string;
};

export async function subscribeNewsletter(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = schema.safeParse({
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    source: String(formData.get('source') ?? 'homepage'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Please enter a valid email.' };
  }

  try {
    await ensureMigrations();
    const pool = getPool();
    const res = await pool.query(
      `INSERT INTO newsletter_subscriptions (email, source)
         VALUES ($1, $2)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
      [parsed.data.email, parsed.data.source ?? 'homepage'],
    );
    if (res.rowCount === 0) {
      return { status: 'duplicate', message: 'You are already subscribed.' };
    }
    return { status: 'success', message: 'Thanks, we will keep you posted.' };
  } catch (err) {
    console.error('[newsletter] subscribe failed', err);
    return { status: 'error', message: 'Something went wrong. Try again in a minute.' };
  }
}
