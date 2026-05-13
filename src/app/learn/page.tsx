import Link from 'next/link';
import { Bot, Code, GraduationCap, Microscope, type LucideIcon } from 'lucide-react';
import { LEARNING_PATHS, type LearningPath, type LearningStep } from '@/lib/learning-paths';
import { GLOSSARY, type GlossaryTerm } from '@/lib/glossary';
import { listApprovedTools } from '@/lib/db';
import type { Tool } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Learning paths · ai.tools',
  description: 'Four curated routes through AI tools and concepts.',
};

const PATH_ICONS: Record<string, LucideIcon> = {
  beginner: GraduationCap,
  'student-dev': Code,
  'agent-builder': Bot,
  researcher: Microscope,
};

function stepHref(step: LearningStep): string {
  if (step.kind === 'tool') return `/tools/${step.ref}`;
  return `/glossary#term-${step.ref}`;
}

function stepLabel(
  step: LearningStep,
  toolMap: Map<string, Tool>,
  termMap: Map<string, GlossaryTerm>,
): string {
  if (step.kind === 'tool') {
    return toolMap.get(step.ref)?.title ?? step.ref;
  }
  return termMap.get(step.ref)?.term ?? step.ref;
}

export default async function LearnPage() {
  const { tools } = await listApprovedTools({ limit: 100 });

  const toolMap = new Map<string, Tool>();
  for (const tool of tools) toolMap.set(tool.slug, tool);

  const termMap = new Map<string, GlossaryTerm>();
  for (const term of GLOSSARY) termMap.set(term.slug, term);

  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink text-center">
          Learning paths
        </h1>
        <p className="mt-4 text-base text-ink-dim">
          Four curated routes from total beginner to research engineer. Each path is a sequence of
          tools and concepts to learn in order.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEARNING_PATHS.map((path: LearningPath) => {
          const Icon = PATH_ICONS[path.slug] ?? GraduationCap;
          const firstStep = path.steps[0];
          const startHref = firstStep ? stepHref(firstStep) : '#';
          return (
            <article
              key={path.slug}
              className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8 text-center"
            >
              <Icon className="h-5 w-5 text-accent mx-auto" aria-hidden="true" />
              <h2 className="mt-3 text-2xl md:text-3xl font-medium text-ink">{path.title}</h2>
              <p className="mt-2 text-[15px] text-ink-dim">{path.tagline}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center rounded-md border border-line px-2 py-0.5 text-xs text-ink-faint">
                  Audience: {path.audience}
                </span>
                <span className="inline-flex items-center rounded-md border border-line px-2 py-0.5 text-xs text-ink-faint">
                  Est. {path.estimated_hours}h
                </span>
              </div>

              <ol className="mt-6 space-y-3 text-left max-w-md mx-auto">
                {path.steps.map((step, idx) => {
                  const label = stepLabel(step, toolMap, termMap);
                  const href = stepHref(step);
                  return (
                    <li
                      key={`${path.slug}-${idx}-${step.ref}`}
                      className="flex gap-3 items-start"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line text-xs text-ink-faint"
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={href}
                          className="text-[15px] text-ink transition-colors hover:text-accent"
                        >
                          {label}
                          <span aria-hidden="true" className="ml-1 text-ink-faint">
                            &rarr;
                          </span>
                          {step.kind === 'concept' ? (
                            <span className="ml-2 text-xs text-ink-faint italic">(concept)</span>
                          ) : null}
                        </Link>
                        <p className="mt-0.5 text-sm text-ink-dim">{step.why}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-6">
                <Link
                  href={startHref}
                  className="inline-flex items-center gap-1 text-sm text-accent transition-colors hover:text-accent-bright"
                >
                  Start this path
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
