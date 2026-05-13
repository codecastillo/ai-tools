import { PROMPTS } from '@/lib/prompts';
import PromptLibrary from '@/components/prompt-library';

export const metadata = {
  title: 'Prompt library · ai.tools',
  description: '30+ ready-to-copy prompts for common dev tasks: refactor, debug, RAG, agents, tests, and more.',
};

export default function PromptsPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Prompt library</h1>
        <p className="mt-3 text-lg text-ink-dim">A growing collection of ready-to-copy prompts for the work devs do every week. Filter by category, copy in one click, tune as you go.</p>
      </header>

      <section className="mt-12">
        <PromptLibrary prompts={PROMPTS} />
      </section>

      <section className="mt-16 text-center text-sm text-ink-faint">
        <p>Missing a prompt? Submit one via the <a href="/submit" className="text-accent hover:underline">submit page</a>.</p>
      </section>
    </div>
  );
}
