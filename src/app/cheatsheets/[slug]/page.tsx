import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getToolBySlug } from '@/lib/db';
import Markdown from '@/components/markdown';
import PrintButton from '@/components/print-button';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let tool;
  try {
    tool = await getToolBySlug(slug);
  } catch {
    return { title: 'Not found' };
  }
  if (!tool) return { title: 'Not found' };
  return {
    title: `${tool.title} cheatsheet · ai.tools`,
    description: `Quick reference for ${tool.title}.`,
  };
}

export default async function CheatsheetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool || !tool.cheatsheet_md) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10 print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/cheatsheets"
          className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All cheatsheets
        </Link>
        <PrintButton />
      </div>

      <header className="mt-6 text-center print:text-left">
        <h1 className="text-3xl font-medium tracking-tight text-ink">
          {tool.title} cheatsheet
        </h1>
        {tool.tagline && <p className="mt-2 text-ink-dim">{tool.tagline}</p>}
      </header>

      <article className="mt-8">
        <Markdown source={tool.cheatsheet_md} />
      </article>
    </div>
  );
}
