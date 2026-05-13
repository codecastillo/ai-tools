import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { codeToHtml } from 'shiki';
import { cn } from '@/lib/cn';
import { sanitizeShikiHtml } from '@/lib/sanitize';
import CodeBlock from '@/components/code-block';
import OSTabs, { type OSId } from '@/components/os-tabs';

interface MarkdownProps {
  source: string | null;
  className?: string;
}

type TextSegment = { kind: 'text'; value: string };
type CodeSegment = {
  kind: 'code';
  lang: string;
  code: string;
};
type OSBlock = {
  os: OSId;
  lang: string;
  code: string;
};
type OSGroupSegment = {
  kind: 'os';
  blocks: OSBlock[];
};

type Segment = TextSegment | CodeSegment | OSGroupSegment;

const OS_BLOCK_RE = /^:::os\s+(mac|linux|windows)\s*\n([\s\S]*?)\n:::\s*(?=\n|$)/m;
const FENCE_RE = /^```([\w+-]*)\s*\n([\s\S]*?)\n```\s*(?=\n|$)/m;

function normalizeOS(token: string): OSId {
  const t = token.toLowerCase();
  if (t === 'mac' || t === 'macos' || t === 'darwin') return 'mac';
  if (t === 'windows' || t === 'win') return 'windows';
  return 'linux';
}

function extractFirstFence(
  body: string,
): { lang: string; code: string } | null {
  const m = body.match(/```([\w+-]*)\s*\n([\s\S]*?)\n```/);
  if (!m) {
    // Bare body — treat as plain text snippet
    const trimmed = body.trim();
    if (!trimmed) return null;
    return { lang: 'text', code: trimmed };
  }
  return { lang: m[1] || 'text', code: m[2] };
}

/**
 * Walk source linearly, peeling off the next directive/fence/text chunk each
 * iteration. Consecutive :::os blocks collapse into one OSGroupSegment.
 */
function parseSegments(source: string): Segment[] {
  const segments: Segment[] = [];
  let remaining = source;

  // Find earliest directive index or fence index from `remaining`.
  const findNext = (
    s: string,
  ): { type: 'os' | 'code'; index: number; match: RegExpMatchArray } | null => {
    let best: { type: 'os' | 'code'; index: number; match: RegExpMatchArray } | null = null;
    const osMatch = s.match(OS_BLOCK_RE);
    if (osMatch && typeof osMatch.index === 'number') {
      best = { type: 'os', index: osMatch.index, match: osMatch };
    }
    const fenceMatch = s.match(FENCE_RE);
    if (fenceMatch && typeof fenceMatch.index === 'number') {
      if (!best || fenceMatch.index < best.index) {
        best = { type: 'code', index: fenceMatch.index, match: fenceMatch };
      }
    }
    return best;
  };

  while (remaining.length > 0) {
    const next = findNext(remaining);
    if (!next) {
      if (remaining.trim().length > 0) {
        segments.push({ kind: 'text', value: remaining });
      }
      break;
    }

    const leading = remaining.slice(0, next.index);
    if (leading.trim().length > 0) {
      segments.push({ kind: 'text', value: leading });
    }

    if (next.type === 'code') {
      const lang = next.match[1] || 'text';
      const code = next.match[2];
      segments.push({ kind: 'code', lang, code });
      remaining = remaining.slice(next.index + next.match[0].length);
      continue;
    }

    // OS directive — collect consecutive :::os blocks
    const blocks: OSBlock[] = [];
    const collect = (m: RegExpMatchArray) => {
      const os = normalizeOS(m[1]);
      const fence = extractFirstFence(m[2]);
      if (fence) {
        blocks.push({ os, lang: fence.lang, code: fence.code });
      }
    };
    collect(next.match);
    remaining = remaining.slice(next.index + next.match[0].length);

    // Look at what follows — skip pure whitespace between :::os blocks
    while (true) {
      const wsMatch = remaining.match(/^\s*/);
      const afterWs = wsMatch ? remaining.slice(wsMatch[0].length) : remaining;
      const nextOs = afterWs.match(/^:::os\s+(mac|linux|windows)\s*\n([\s\S]*?)\n:::\s*(?=\n|$)/);
      if (!nextOs) break;
      collect(nextOs);
      remaining = afterWs.slice(nextOs[0].length);
    }

    if (blocks.length > 0) {
      segments.push({ kind: 'os', blocks });
    }
  }

  return segments;
}

async function highlight(code: string, lang: string): Promise<string> {
  try {
    const html = await codeToHtml(code, {
      lang,
      theme: 'github-dark-default',
    });
    return sanitizeShikiHtml(html);
  } catch {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return sanitizeShikiHtml(
      `<pre class="shiki"><code>${escaped}</code></pre>`,
    );
  }
}

const proseClasses = cn(
  'prose-md max-w-none text-[15px] leading-relaxed text-ink-dim',
  '[&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-medium [&_h1]:text-ink',
  '[&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-ink',
  '[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-ink',
  '[&_p]:my-3',
  '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5',
  '[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5',
  '[&_li]:my-1',
  '[&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a:hover]:decoration-accent',
  '[&_code]:font-mono [&_code]:text-[13px] [&_code]:rounded [&_code]:bg-white/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-ink',
  '[&_table]:my-4 [&_table]:w-full [&_table]:text-sm',
  '[&_th]:border-b [&_th]:border-white/[0.10] [&_th]:py-2 [&_th]:px-3 [&_th]:text-left [&_th]:font-medium [&_th]:text-ink',
  '[&_td]:border-b [&_td]:border-white/[0.04] [&_td]:py-2 [&_td]:px-3',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:text-ink-mute [&_blockquote]:italic',
);

function TextSpan({ value }: { value: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a({ href, children }) {
          const isExternal = href?.startsWith('http');
          return (
            <a
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {value}
    </ReactMarkdown>
  );
}

/**
 * Server component. Parses markdown into text / code-fence / :::os segments
 * and renders each segment directly as React elements — text spans through
 * react-markdown, code fences through <CodeBlock>, OS groups through <OSTabs>.
 * No placeholder round-tripping.
 */
export default async function Markdown({ source, className }: MarkdownProps) {
  if (!source || !source.trim()) {
    return (
      <p className="text-sm text-ink-faint italic">— nothing here yet —</p>
    );
  }

  const segments = parseSegments(source);

  // Pre-highlight every code block (own segments + OS-group children) in parallel.
  const codeJobs: Array<Promise<void>> = [];
  type RenderedCode = { html: string };
  type RenderedOSBlock = OSBlock & { html: string };

  const codeRendered: Array<RenderedCode | null> = segments.map((s) =>
    s.kind === 'code' ? { html: '' } : null,
  );
  const osRendered: Array<RenderedOSBlock[] | null> = segments.map((s) =>
    s.kind === 'os' ? s.blocks.map((b) => ({ ...b, html: '' })) : null,
  );

  segments.forEach((seg, i) => {
    if (seg.kind === 'code') {
      codeJobs.push(
        highlight(seg.code, seg.lang).then((html) => {
          codeRendered[i] = { html };
        }),
      );
    } else if (seg.kind === 'os') {
      seg.blocks.forEach((b, j) => {
        codeJobs.push(
          highlight(b.code, b.lang).then((html) => {
            osRendered[i]![j].html = html;
          }),
        );
      });
    }
  });

  await Promise.all(codeJobs);

  return (
    <div className={cn(proseClasses, className)}>
      {segments.map((seg, i) => {
        if (seg.kind === 'text') {
          return <TextSpan key={i} value={seg.value} />;
        }
        if (seg.kind === 'code') {
          const r = codeRendered[i]!;
          return (
            <CodeBlock
              key={i}
              html={r.html}
              code={seg.code}
              lang={seg.lang}
            />
          );
        }
        // OS group
        const blocks = osRendered[i]!;
        return <OSTabs key={i} blocks={blocks} />;
      })}
    </div>
  );
}
