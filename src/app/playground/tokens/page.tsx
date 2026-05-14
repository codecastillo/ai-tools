import TokenizerPlayground from '@/components/tokenizer-playground';

export const metadata = {
  title: 'Tokenizer playground · ai.tools',
  description:
    'See how LLMs tokenize your text and estimate the cost across major providers.',
};

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">
          Tokenizer playground
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          Paste text, see how an LLM might tokenize it, and estimate the cost
          across 13 frontier models.
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          This is a heuristic tokenizer. Real provider tokenizers will give
          slightly different counts.
        </p>
      </header>
      <section className="mt-12">
        <TokenizerPlayground />
      </section>
    </div>
  );
}
