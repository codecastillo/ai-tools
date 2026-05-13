import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/admin-auth';

export async function POST(req: Request) {
  await clearAdminCookie();
  const url = new URL('/admin', req.url);
  return NextResponse.redirect(url, { status: 303 });
}
