import { listApprovedTools } from '@/lib/db';
import NotesEditor from '@/components/notes-editor';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Notes · ai.tools',
  description: 'Take study notes on each tool. Stored locally, never sent anywhere.',
};

export default async function NotesPage() {
  const { tools } = await listApprovedTools({ limit: 100 });
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Notes</h1>
        <p className="mt-3 text-lg text-ink-dim">Take notes on each tool while you study. Saved in your browser only.</p>
      </header>
      <section className="mt-12">
        <NotesEditor tools={tools.map((t) => ({ slug: t.slug, title: t.title }))} />
      </section>
    </div>
  );
}
