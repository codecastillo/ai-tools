import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { isAdmin } from '@/lib/admin-auth';
import { ensureMigrations, getPool, rowToTool, TOOL_COLS } from '@/lib/db';
import type { Tool } from '@/lib/types';
import AdminLoginForm from '@/components/admin-login-form';
import AdminQueue from '@/components/admin-queue';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <div className="mx-auto max-w-md px-6 pb-20 pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <div className="mt-8 rounded-xl border border-white/[0.10] bg-[--color-surface] p-7">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Lock className="h-4 w-4 text-accent" />
            Curator access
          </div>
          <p className="mt-2 text-sm text-ink-dim">
            Enter the curator password to review submissions.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    );
  }

  await ensureMigrations();
  const pool = getPool();
  const res = await pool.query<Record<string, unknown>>(
    `SELECT ${TOOL_COLS} FROM tools ORDER BY (status='pending') DESC, created_at DESC LIMIT 200`,
  );
  const tools: Tool[] = res.rows.map(rowToTool);
  const pending = tools.filter((t) => t.status === 'pending');
  const approved = tools.filter((t) => t.status === 'approved');
  const rejected = tools.filter((t) => t.status === 'rejected');

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="text-sm text-ink-mute transition-colors hover:text-ink-dim"
          >
            Sign out
          </button>
        </form>
      </div>

      <header className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Curator
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Review submissions
        </h1>
        <div className="mt-5 flex gap-4 text-sm">
          <span>
            <span className="font-medium text-ink">{pending.length}</span>{' '}
            <span className="text-ink-faint">pending</span>
          </span>
          <span>
            <span className="font-medium text-ink">{approved.length}</span>{' '}
            <span className="text-ink-faint">approved</span>
          </span>
          <span>
            <span className="font-medium text-ink">{rejected.length}</span>{' '}
            <span className="text-ink-faint">rejected</span>
          </span>
        </div>
      </header>

      <div className="mt-10 space-y-10">
        <AdminSection title="Pending" tools={pending} emptyText="No pending submissions." />
        <AdminSection title="Approved" tools={approved.slice(0, 30)} emptyText="" />
      </div>
    </div>
  );
}

function AdminSection({
  title,
  tools,
  emptyText,
}: {
  title: string;
  tools: Tool[];
  emptyText: string;
}) {
  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-[0.10em] text-ink-faint">{title}</h2>
      {tools.length === 0 ? (
        <p className="mt-3 text-sm text-ink-mute">{emptyText}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {tools.map((tool) => (
            <li key={tool.id}>
              <AdminQueue tool={tool} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
