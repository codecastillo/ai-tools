import Pomodoro from '@/components/pomodoro';
import PathProgress from '@/components/path-progress';

export const metadata = {
  title: 'Study · ai.tools',
  description: 'Pomodoro timer plus learning path progress, side by side.',
};

export default function StudyPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">Study mode</h1>
        <p className="mt-3 text-lg text-ink-dim">
          Set a pomodoro, work through a path, track what you finish.
        </p>
      </header>
      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <Pomodoro />
        <PathProgress />
      </section>
    </div>
  );
}
