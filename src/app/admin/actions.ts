'use server';

import { revalidatePath } from 'next/cache';
import { ensureMigrations, getPool } from '@/lib/db';
import { isAdmin, setAdminCookie, clearAdminCookie } from '@/lib/admin-auth';

export async function loginAdmin(_: unknown, formData: FormData): Promise<{ error?: string } | { ok: true }> {
  const pw = String(formData.get('password') ?? '');
  const ok = await setAdminCookie(pw);
  if (!ok) return { error: 'Invalid password' };
  revalidatePath('/admin');
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminCookie();
  revalidatePath('/admin');
}

export async function approveTool(id: string): Promise<{ ok?: true; error?: string }> {
  if (!(await isAdmin())) return { error: 'Not authorized' };
  await ensureMigrations();
  const pool = getPool();
  await pool.query(
    `UPDATE tools SET status='approved', approved_at = NOW() WHERE id = $1 AND status='pending'`,
    [id],
  );
  revalidatePath('/admin');
  revalidatePath('/');
  return { ok: true };
}

export async function rejectTool(id: string): Promise<{ ok?: true; error?: string }> {
  if (!(await isAdmin())) return { error: 'Not authorized' };
  await ensureMigrations();
  const pool = getPool();
  await pool.query(`UPDATE tools SET status='rejected' WHERE id = $1`, [id]);
  revalidatePath('/admin');
  return { ok: true };
}

export async function deleteTool(id: string): Promise<{ ok?: true; error?: string }> {
  if (!(await isAdmin())) return { error: 'Not authorized' };
  await ensureMigrations();
  const pool = getPool();
  await pool.query(`DELETE FROM tools WHERE id = $1`, [id]);
  revalidatePath('/admin');
  return { ok: true };
}
