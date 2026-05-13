import { listApprovedTools } from '@/lib/db';
import StackBuilderClient from './StackBuilderClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Stack builder · ai.tools',
  description: 'Build and share your own AI dev tooling stack.',
};

export default async function StackBuilderPage() {
  const { tools } = await listApprovedTools({ limit: 200 });
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-10">
      <header className="border-b border-white/[0.10] pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          Build a stack
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Make it your own.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-dim">
          Pick the tools that fit your workflow, share the link with your team or class.
        </p>
      </header>
      <StackBuilderClient catalog={tools} />
    </div>
  );
}
