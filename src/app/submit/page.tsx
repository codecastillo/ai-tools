import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SubmitForm from '@/components/submit-form';

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Home
      </Link>

      <header className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Submit a tool
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Found something we should add?
        </h1>
        <p className="mt-3 text-base text-ink-dim">
          Paste a URL. We'll fetch the title and description, you fill in the rest, and a
          curator publishes after a quick review.
        </p>
      </header>

      <div className="mt-12">
        <SubmitForm />
      </div>
    </div>
  );
}
