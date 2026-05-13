import { cookies } from 'next/headers';
import { sha256, safeEqual } from './cookies-safe';

const COOKIE = 'aitools_admin';

function expectedHash(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256(pw);
}

export async function isAdmin(): Promise<boolean> {
  const expected = expectedHash();
  if (!expected) return false;
  const c = await cookies();
  const got = c.get(COOKIE)?.value;
  if (!got) return false;
  return safeEqual(got, expected);
}

export async function setAdminCookie(password: string): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const expected = sha256(pw);
  const provided = sha256(password);
  if (!safeEqual(expected, provided)) return false;
  const c = await cookies();
  c.set(COOKIE, expected, {
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
