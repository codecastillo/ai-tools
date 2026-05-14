import QuizGame from '@/components/quiz-game';

export const metadata = {
  title: 'Quiz · ai.tools',
  description: 'Test your AI tooling knowledge. 10 random questions per session.',
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-10">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Quiz</h1>
        <p className="mt-3 text-lg text-ink-dim">Ten questions on AI dev tooling. Pick the best answer.</p>
      </header>
      <section className="mt-12">
        <QuizGame />
      </section>
    </div>
  );
}
