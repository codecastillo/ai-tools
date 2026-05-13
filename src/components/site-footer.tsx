import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/[0.10]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-8 text-sm text-ink-faint sm:flex-row sm:items-center">
        <p>
          A reference site for the AI tools real devs love.{' '}
          <Link
            href="/submit"
            className="text-ink-dim transition-colors hover:text-accent"
          >
            Help us grow it →
          </Link>
        </p>
        <nav className="flex items-center gap-5">
          <Link href="/" className="hover:text-ink-dim transition-colors">
            Browse
          </Link>
          <Link href="/stacks" className="hover:text-ink-dim transition-colors">
            Stacks
          </Link>
          <Link href="/submit" className="hover:text-ink-dim transition-colors">
            Submit
          </Link>
        </nav>
      </div>
    </footer>
  );
}
