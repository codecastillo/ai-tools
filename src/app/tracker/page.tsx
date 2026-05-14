import { listApprovedTools } from '@/lib/db';
import TrackerView from '@/components/tracker-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tracker · ai.tools',
  description:
    'Track which AI tools you have tried, want to try, and use regularly.',
};

export default async function TrackerPage() {
  const { tools } = await listApprovedTools({ limit: 100 });
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">
          Tool tracker
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          Mark each tool as Untried, Want to try, or Using. Stored locally,
          never synced.
        </p>
      </header>
      <section className="mt-12">
        <TrackerView
          tools={tools.map((t) => ({
            slug: t.slug,
            title: t.title,
            tagline: t.tagline,
          }))}
        />
      </section>
    </div>
  );
}
