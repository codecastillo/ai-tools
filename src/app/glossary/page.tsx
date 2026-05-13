import Link from 'next/link';
import { GLOSSARY, type GlossaryTerm } from '@/lib/glossary';

export const metadata = {
  title: 'Glossary · ai.tools',
  description: 'Plain-language definitions for the AI jargon.',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function groupByLetter(terms: GlossaryTerm[]): Map<string, GlossaryTerm[]> {
  const groups = new Map<string, GlossaryTerm[]>();
  for (const term of terms) {
    const letter = term.term.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : '#';
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(term);
    } else {
      groups.set(key, [term]);
    }
  }
  for (const bucket of groups.values()) {
    bucket.sort((a, b) => a.term.localeCompare(b.term));
  }
  return groups;
}

export default function GlossaryPage() {
  const groups = groupByLetter(GLOSSARY);
  const orderedLetters = ALPHABET.filter((letter) => groups.has(letter));

  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          AI glossary
        </h1>
        <p className="mt-4 text-base text-ink-dim">
          Plain-language definitions for the jargon that shows up when you start using AI tools.
        </p>
      </header>

      <nav
        aria-label="Jump to letter"
        className="mt-10 flex flex-wrap justify-center gap-2"
      >
        {ALPHABET.map((letter) => {
          const has = groups.has(letter);
          if (!has) {
            return (
              <span
                key={letter}
                aria-disabled="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.05] text-sm text-ink-faint/60"
              >
                {letter}
              </span>
            );
          }
          return (
            <Link
              key={letter}
              href={`#letter-${letter}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] text-sm text-ink-dim transition-colors hover:border-accent/40 hover:text-accent"
            >
              {letter}
            </Link>
          );
        })}
      </nav>

      {orderedLetters.map((letter) => {
        const terms = groups.get(letter) ?? [];
        return (
          <section
            key={letter}
            id={`letter-${letter}`}
            className="scroll-mt-24 mt-12"
          >
            <h2 className="text-3xl font-medium text-ink mb-6">{letter}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((term) => (
                <article
                  key={`${term.slug}-${term.term}`}
                  id={`term-${term.slug}`}
                  className="scroll-mt-24 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 text-center"
                >
                  <h3 className="text-xl font-medium text-ink">{term.term}</h3>
                  <div className="mt-1 text-sm text-ink-faint italic">
                    {term.short}
                  </div>
                  <p className="mt-3 text-[15px] text-ink-dim leading-relaxed">
                    {term.long}
                  </p>
                  {term.related && term.related.length > 0 ? (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {term.related.map((r) => (
                        <Link
                          key={r}
                          href={`#term-${r}`}
                          className="rounded-md border border-white/[0.08] px-2 py-0.5 text-xs text-ink-faint transition-colors hover:text-accent"
                        >
                          {r}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
