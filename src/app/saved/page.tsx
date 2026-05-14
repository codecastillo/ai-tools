import SavedToolsClient from '@/components/saved-tools-client';

export const metadata = {
  title: 'Saved tools · ai.tools',
  description: 'Your starred AI tools, stored locally.',
};

export default function SavedPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Saved tools</h1>
        <p className="mt-3 text-lg text-ink-dim">Your local collection of starred tools. Stored in your browser, never sent to a server.</p>
      </header>
      <section className="mt-12">
        <SavedToolsClient />
      </section>
    </div>
  );
}
