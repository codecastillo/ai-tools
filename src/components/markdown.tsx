import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { codeToHtml } from 'shiki';
import { cn } from '@/lib/cn';

interface MarkdownProps {
  source: string | null;
  className?: string;
}

// Strip our custom :::os directive lines so the inner code reads cleanly.
// We render the full markdown server-side; if you want OS tabs they can be
// added later — for now, leading directives are dropped and each block is
// shown stacked.
function stripDirectives(md: string): string {
  return md.replace(/^:::[^\n]*$/gm, '');
}

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
}

async function highlightServerSide(
  code: string,
  lang: string,
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang,
      theme: 'github-dark-default',
    });
  } catch {
    // Unknown language — render as plain text.
    return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Markdown is rendered as a server component — no client JS, no Vite.
 * Code fences are highlighted server-side by Shiki. We pre-process the
 * markdown into a tree of nodes with embedded HTML for code blocks.
 */
export default async function Markdown({ source, className }: MarkdownProps) {
  if (!source) {
    return <p className="text-sm text-ink-faint italic">— nothing here yet —</p>;
  }

  const cleaned = stripDirectives(source);

  // Pre-highlight every fenced code block.
  const codeBlocks = new Map<string, string>();
  const fenceRe = /```(\w+)?\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  const matches: Array<{ key: string; lang: string; code: string }> = [];
  while ((m = fenceRe.exec(cleaned))) {
    matches.push({
      key: `__CODE_${matches.length}__`,
      lang: m[1] || 'text',
      code: m[2],
    });
  }
  await Promise.all(
    matches.map(async (m) => {
      codeBlocks.set(m.key, await highlightServerSide(m.code, m.lang));
    }),
  );

  // Replace each fence with a placeholder, then render markdown,
  // then post-replace placeholders with the pre-highlighted HTML.
  let idx = 0;
  const placeheld = cleaned.replace(/```(\w+)?\n([\s\S]*?)```/g, () => {
    return `\n\n<<CODE${idx++}>>\n\n`;
  });

  return (
    <div
      className={cn(
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
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            // Detect a CODE placeholder and emit its highlighted HTML.
            if (
              typeof children === 'string' &&
              /^<<CODE\d+>>$/.test(children.trim())
            ) {
              const k = `__CODE_${parseInt(
                children.trim().match(/\d+/)![0],
                10,
              )}__`;
              const html = codeBlocks.get(k);
              if (html) {
                return (
                  <div
                    className="my-4 overflow-x-auto rounded-lg border border-white/[0.06] bg-black/40 text-[13px] [&_pre]:!bg-transparent [&_pre]:p-4"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }
            }
            return <p>{children}</p>;
          },
          code(props: CodeProps) {
            // Inline code (not fenced — fences are handled above).
            return <code className={props.className}>{props.children}</code>;
          },
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
        {placeheld}
      </ReactMarkdown>
    </div>
  );
}
