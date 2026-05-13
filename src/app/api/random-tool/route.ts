import { NextResponse } from 'next/server';
import { listApprovedTools } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const { tools } = await listApprovedTools({ limit: 200 });
    if (tools.length === 0) {
      return NextResponse.json({ slug: null }, { status: 200 });
    }
    const pick = tools[Math.floor(Math.random() * tools.length)];
    return NextResponse.json({ slug: pick.slug }, { status: 200 });
  } catch {
    return NextResponse.json({ slug: null }, { status: 500 });
  }
}
