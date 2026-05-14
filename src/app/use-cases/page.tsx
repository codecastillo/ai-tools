import UseCaseGrid from '@/components/use-case-grid';

export const metadata = {
  title: 'Use cases · ai.tools',
  description:
    'Twenty "I want to..." scenarios with the right tool, prompt, and recipe for each.',
};

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Use cases</h1>
        <p className="mt-3 text-lg text-ink-dim">
          Pick the scenario closest to yours. Each one points at the recommended tool, prompt, and recipe.
        </p>
      </header>
      <section className="mt-12">
        <UseCaseGrid />
      </section>
    </div>
  );
}
