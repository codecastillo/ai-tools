import PromptBuilder from '@/components/prompt-builder';

export const metadata = {
  title: 'Prompt builder · ai.tools',
  description: 'Build structured prompts in 4 short steps.',
};

export default function PromptBuilderPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Prompt builder</h1>
        <p className="mt-3 text-lg text-ink-dim">Four short steps to a well-structured prompt. Save the last five builds locally.</p>
      </header>
      <section className="mt-12">
        <PromptBuilder />
      </section>
    </div>
  );
}
