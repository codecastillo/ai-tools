import { Newspaper, ExternalLink } from 'lucide-react';
import { NEWS, KIND_LABEL, type NewsKind } from '@/lib/news';

const KIND_COLOR: Record<NewsKind, string> = {
  release: 'text-accent',
  paper: 'text-amber-400',
  industry: 'text-success',
  tool: 'text-ink-dim',
};

export default function AiNewsTicker() {
  return (
    <section className="py-12">
      <div className="text-center">
        <Newspaper className="h-5 w-5 text-accent mx-auto" />
        <h2 className="mt-2 text-2xl md:text-3xl font-medium text-ink">AI ecosystem news</h2>
        <p className="mt-2 text-ink-mute">
          Recent releases, papers, and tool updates worth knowing.
        </p>
      </div>
      <div className="mt-8 overflow-x-auto rail-mask">
        <div className="flex gap-4 pb-3 px-1">
          {NEWS.slice(0, 12).map((n) => (
            <a
              key={n.date + n.title}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-none w-72 rounded-xl border border-line bg-surface-1 p-5 hover:bg-surface-2 transition"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-ink-faint">
                <time>{n.date}</time>
                <span>·</span>
                <span className={KIND_COLOR[n.kind]}>{KIND_LABEL[n.kind]}</span>
              </div>
              <h3 className="mt-2 text-base font-medium text-ink line-clamp-2">{n.title}</h3>
              <p className="mt-1.5 text-xs text-ink-mute line-clamp-3">{n.summary}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent group-hover:gap-2 transition-all">
                Read more <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
