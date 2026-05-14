import GlossaryFlashcards from '@/components/glossary-flashcards';

export const metadata = {
  title: 'Flashcards · ai.tools',
  description: 'Flip through AI glossary terms. Built for studying.',
};

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Flashcards</h1>
        <p className="mt-3 text-lg text-ink-dim">60 AI glossary terms. Flip with Space, navigate with arrows or J/K.</p>
      </header>
      <section className="mt-12">
        <GlossaryFlashcards />
      </section>
    </div>
  );
}
