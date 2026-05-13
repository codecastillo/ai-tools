// Hand-curated AI ecosystem news for the homepage ticker. Dates are when
// the announcement actually happened. Refresh when shipping a new round.

export type NewsKind = 'release' | 'paper' | 'industry' | 'tool';

export interface NewsItem {
  date: string;
  kind: NewsKind;
  title: string;
  summary: string;
  url: string;
}

export const NEWS: NewsItem[] = [
  {
    date: '2026-01-22',
    kind: 'release',
    title: 'Qwen 3 ships with strongest open-weights multilingual scores',
    summary: 'Alibaba released Qwen 3 with 128K context and improvements across 30+ languages.',
    url: 'https://qwenlm.github.io/blog/',
  },
  {
    date: '2025-12-18',
    kind: 'release',
    title: 'DeepSeek V3 drops with aggressive pricing',
    summary: 'Per-million-token rates roughly 1/10th of comparable proprietary models, with strong coding scores.',
    url: 'https://platform.deepseek.com/pricing',
  },
  {
    date: '2025-12-04',
    kind: 'release',
    title: 'Gemini 2.5 Flash arrives with sub-cent input pricing',
    summary: 'Google\'s smaller Gemini lands at $0.15 per million input tokens, $0.60 output. RAG pipelines just got cheaper.',
    url: 'https://ai.google.dev/pricing',
  },
  {
    date: '2025-11-29',
    kind: 'release',
    title: 'Claude Sonnet 4 expands context to 1 million tokens',
    summary: 'Anthropic\'s default workhorse jumps from 200K to 1M context. Long codebases become single-prompt territory.',
    url: 'https://www.anthropic.com/news',
  },
  {
    date: '2025-11-12',
    kind: 'tool',
    title: 'Vercel AI Gateway hits GA',
    summary: 'One key, dozens of models, automatic failover and per-team budgets. The gateway pattern goes mainstream.',
    url: 'https://vercel.com/docs/ai-gateway',
  },
  {
    date: '2025-10-22',
    kind: 'paper',
    title: 'Anthropic publishes Claude 4 evaluation report',
    summary: 'Detailed benchmarks across reasoning, coding, refusal, and long-horizon agentic tasks.',
    url: 'https://www.anthropic.com/research',
  },
  {
    date: '2025-10-08',
    kind: 'tool',
    title: 'MCP turns 1, ecosystem doubles',
    summary: 'Model Context Protocol crosses 1000+ public servers. Filesystem, Slack, Postgres, GitHub all standardized.',
    url: 'https://modelcontextprotocol.io',
  },
  {
    date: '2025-09-30',
    kind: 'release',
    title: 'Claude Opus 4 ships with extended thinking',
    summary: 'Opus 4 can think up to 64K tokens before answering. Big quality jump on math and reasoning, at a latency cost.',
    url: 'https://www.anthropic.com/news',
  },
  {
    date: '2025-09-14',
    kind: 'industry',
    title: 'Cursor announces composer mode for agentic edits',
    summary: 'Cursor\'s composer rewrites multi-file features from a single instruction.',
    url: 'https://cursor.com/blog',
  },
  {
    date: '2025-08-21',
    kind: 'release',
    title: 'GPT-5 launches with 400K context window',
    summary: 'OpenAI\'s flagship lands with strong multimodal, native tool use, and a $5/M input rate.',
    url: 'https://openai.com/blog',
  },
  {
    date: '2025-08-04',
    kind: 'tool',
    title: 'Aider passes 60% on SWE-Bench Lite with sonnet',
    summary: 'The open-source pair coding CLI hits a new high on the real-GitHub-issues benchmark.',
    url: 'https://aider.chat',
  },
  {
    date: '2025-07-15',
    kind: 'paper',
    title: 'Prompt caching cuts agent costs 90% in production deployments',
    summary: 'Joint case study from Anthropic and a Fortune 500 user shows real cache hit rates above 80%.',
    url: 'https://www.anthropic.com/research',
  },
  {
    date: '2025-07-02',
    kind: 'industry',
    title: 'Codex CLI joins the agent CLI lineup',
    summary: 'OpenAI ships a first-party CLI that matches Claude Code\'s shape but speaks OpenAI tool format.',
    url: 'https://github.com/openai/codex',
  },
  {
    date: '2025-06-10',
    kind: 'release',
    title: 'Llama 4 Maverick released under permissive license',
    summary: 'Meta\'s open-weights model is competitive with closed top-tier on most benchmarks.',
    url: 'https://ai.meta.com/llama',
  },
];

export function newsByKind(): Record<NewsKind, NewsItem[]> {
  const out = {} as Record<NewsKind, NewsItem[]>;
  for (const n of NEWS) {
    (out[n.kind] ??= []).push(n);
  }
  return out;
}

export const KIND_LABEL: Record<NewsKind, string> = {
  release: 'Release',
  paper: 'Paper',
  industry: 'Industry',
  tool: 'Tool update',
};
