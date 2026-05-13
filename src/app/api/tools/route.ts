import { listApprovedTools } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const { tools } = await listApprovedTools({ limit: 100 });
    return Response.json({ tools });
  } catch (err) {
    console.error('[api/tools] error', err);
    return Response.json({ tools: [] }, { status: 500 });
  }
}
