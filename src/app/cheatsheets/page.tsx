import { listApprovedTools } from '@/lib/db';
import CheatsheetCard from '@/components/cheatsheet-card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cheatsheets · ai.tools',
  description: 'Printable cheat sheets for the AI tools we track.',
};

export default async function CheatsheetsIndexPage() {
  const { tools } = await listApprovedTools({ limit: 100 });
  const withCheatsheet = tools.filter(
    (t) => t.cheatsheet_md && t.cheatsheet_md.trim().length > 0,
  );

  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-medium tracking-tight text-ink md:text-5xl">
          Cheatsheets
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          Quick reference cards for the tools we track. Designed to print clean.
        </p>
      </header>

      {withCheatsheet.length === 0 ? (
        <p className="mt-12 text-center text-sm text-ink-faint italic">
          No cheatsheets available yet.
        </p>
      ) : (
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withCheatsheet.map((t) => (
            <CheatsheetCard key={t.id} tool={t} />
          ))}
        </section>
      )}
    </div>
  );
}
