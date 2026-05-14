import FamilyTree from '@/components/family-tree';

export const metadata = {
  title: 'Model families · ai.tools',
  description: 'How major LLM families evolved over time.',
};

export default function FamiliesPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Model families</h1>
        <p className="mt-3 text-lg text-ink-dim">A look at how major LLM lineages evolved, from base models to today&apos;s frontier.</p>
      </header>
      <section className="mt-12">
        <FamilyTree />
      </section>
    </div>
  );
}
