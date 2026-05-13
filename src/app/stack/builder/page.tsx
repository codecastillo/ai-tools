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
      <header className="border-b border-white/[0.06] pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          Stack builder
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Compose your stack
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-dim">
          Reorder the tools you&rsquo;ve picked, give the stack a name, and share a public URL.
        </p>
      </header>
      <StackBuilderClient catalog={tools} />
    </div>
  );
}
