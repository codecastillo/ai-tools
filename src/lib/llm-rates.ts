// Per-million-token rates for frontier LLMs, hand curated as of early 2026.
// Used by /pricing page and the <TokenCalculator>.
// Rates are USD per 1M tokens. Always link out to the provider's pricing page
// before quoting these in production decisions, they shift faster than we ship.

export type LLMFamily =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'meta'
  | 'mistral'
  | 'deepseek'
  | 'alibaba'
  | 'xai';

export interface LLMRate {
  id: string;
  family: LLMFamily;
  vendor: string;
  model: string;
  input: number;
  output: number;
  cached_input?: number;
  context_window: number;
  notes: string;
  url: string;
}

export const LLM_RATES: LLMRate[] = [
  {
    id: 'claude-opus-4',
    family: 'anthropic',
    vendor: 'Anthropic',
    model: 'Claude Opus 4',
    input: 15,
    output: 75,
    cached_input: 1.5,
    context_window: 200_000,
    notes: 'Top reasoning, agentic work, long horizon tasks.',
    url: 'https://www.anthropic.com/pricing',
  },
  {
    id: 'claude-sonnet-4',
    family: 'anthropic',
    vendor: 'Anthropic',
    model: 'Claude Sonnet 4',
    input: 3,
    output: 15,
    cached_input: 0.3,
    context_window: 1_000_000,
    notes: 'Default workhorse, 1M context window, strong code.',
    url: 'https://www.anthropic.com/pricing',
  },
  {
    id: 'claude-haiku-4',
    family: 'anthropic',
    vendor: 'Anthropic',
    model: 'Claude Haiku 4.5',
    input: 0.8,
    output: 4,
    cached_input: 0.08,
    context_window: 200_000,
    notes: 'Fast, cheap, ideal for classification and short tasks.',
    url: 'https://www.anthropic.com/pricing',
  },
  {
    id: 'gpt-5',
    family: 'openai',
    vendor: 'OpenAI',
    model: 'GPT-5',
    input: 5,
    output: 20,
    cached_input: 0.5,
    context_window: 400_000,
    notes: 'Best-in-class general reasoning, multimodal.',
    url: 'https://openai.com/pricing',
  },
  {
    id: 'gpt-5-mini',
    family: 'openai',
    vendor: 'OpenAI',
    model: 'GPT-5 mini',
    input: 0.6,
    output: 2.4,
    cached_input: 0.06,
    context_window: 200_000,
    notes: 'Cost balanced, great for chat and tool use.',
    url: 'https://openai.com/pricing',
  },
  {
    id: 'gpt-5-nano',
    family: 'openai',
    vendor: 'OpenAI',
    model: 'GPT-5 nano',
    input: 0.1,
    output: 0.4,
    context_window: 128_000,
    notes: 'Cheapest, edge deployments and bulk classification.',
    url: 'https://openai.com/pricing',
  },
  {
    id: 'gemini-2-5-pro',
    family: 'google',
    vendor: 'Google',
    model: 'Gemini 2.5 Pro',
    input: 1.25,
    output: 5,
    cached_input: 0.31,
    context_window: 2_000_000,
    notes: '2M context, strong on huge documents and codebases.',
    url: 'https://ai.google.dev/pricing',
  },
  {
    id: 'gemini-2-5-flash',
    family: 'google',
    vendor: 'Google',
    model: 'Gemini 2.5 Flash',
    input: 0.15,
    output: 0.6,
    context_window: 1_000_000,
    notes: 'Cheap and fast, good for high volume RAG pipelines.',
    url: 'https://ai.google.dev/pricing',
  },
  {
    id: 'llama-4-maverick',
    family: 'meta',
    vendor: 'Meta (via Groq)',
    model: 'Llama 4 Maverick',
    input: 0.5,
    output: 0.7,
    context_window: 256_000,
    notes: 'Open weights, fastest hosted inference on Groq.',
    url: 'https://groq.com/pricing',
  },
  {
    id: 'mistral-large-2',
    family: 'mistral',
    vendor: 'Mistral',
    model: 'Mistral Large 2',
    input: 2,
    output: 6,
    context_window: 128_000,
    notes: 'European data residency option, solid tool use.',
    url: 'https://mistral.ai/pricing',
  },
  {
    id: 'deepseek-v3',
    family: 'deepseek',
    vendor: 'DeepSeek',
    model: 'DeepSeek V3',
    input: 0.27,
    output: 1.1,
    cached_input: 0.07,
    context_window: 128_000,
    notes: 'Aggressive pricing, strong reasoning and code.',
    url: 'https://platform.deepseek.com/pricing',
  },
  {
    id: 'qwen-3',
    family: 'alibaba',
    vendor: 'Alibaba',
    model: 'Qwen 3',
    input: 0.4,
    output: 1.2,
    context_window: 128_000,
    notes: 'Open weights, strong multilingual coverage.',
    url: 'https://dashscope.console.aliyun.com/',
  },
  {
    id: 'grok-4',
    family: 'xai',
    vendor: 'xAI',
    model: 'Grok 4',
    input: 5,
    output: 15,
    context_window: 256_000,
    notes: 'Tight X/Twitter integration, real time data.',
    url: 'https://x.ai/pricing',
  },
];

export const FAMILY_LABEL: Record<LLMFamily, string> = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  google: 'Google',
  meta: 'Meta',
  mistral: 'Mistral',
  deepseek: 'DeepSeek',
  alibaba: 'Alibaba',
  xai: 'xAI',
};

export function estimateMonthlyCost(opts: {
  rate: LLMRate;
  inputTokensPerDay: number;
  outputTokensPerDay: number;
  cacheHitRate?: number;
}): number {
  const days = 30;
  const inputMillions = (opts.inputTokensPerDay * days) / 1_000_000;
  const outputMillions = (opts.outputTokensPerDay * days) / 1_000_000;
  const cacheHit = Math.max(0, Math.min(1, opts.cacheHitRate ?? 0));
  const cached = opts.rate.cached_input ?? opts.rate.input;
  const effectiveInput =
    cacheHit > 0 && opts.rate.cached_input != null
      ? cached * cacheHit + opts.rate.input * (1 - cacheHit)
      : opts.rate.input;
  return inputMillions * effectiveInput + outputMillions * opts.rate.output;
}
