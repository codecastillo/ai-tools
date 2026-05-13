import { cookies } from 'next/headers';

const COOKIE = 'aitools_admin';

export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const c = await cookies();
  return c.get(COOKIE)?.value === expected;
}

export async function setAdminCookie(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) return false;
  const c = await cookies();
  c.set(COOKIE, password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return true;
}

export async function clearAdminCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE);
}
