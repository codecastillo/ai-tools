// Frontier LLM benchmark scores. Hand-curated, treat with skepticism.
// Benchmarks measure what they measure, real workloads vary.

export type BenchmarkAxis =
  | 'mmlu'
  | 'humaneval'
  | 'math'
  | 'gpqa'
  | 'swebench'
  | 'mtbench';

export interface BenchmarkScore {
  axis: BenchmarkAxis;
  score: number;
}

export interface BenchmarkRow {
  model_id: string;
  model: string;
  vendor: string;
  release: string;
  scores: BenchmarkScore[];
  notes: string;
}

export const BENCHMARK_LABEL: Record<BenchmarkAxis, string> = {
  mmlu: 'MMLU',
  humaneval: 'HumanEval',
  math: 'MATH',
  gpqa: 'GPQA',
  swebench: 'SWE-Bench',
  mtbench: 'MT-Bench',
};

export const BENCHMARK_TOOLTIP: Record<BenchmarkAxis, string> = {
  mmlu: 'Multitask Language Understanding, 57 academic subjects.',
  humaneval: 'Pass@1 on HumanEval coding tasks.',
  math: 'Competition math problems, hard reasoning.',
  gpqa: 'Graduate-level science questions, very hard.',
  swebench: 'Real GitHub issues, end-to-end agentic coding score.',
  mtbench: 'Multi-turn instruction following, judged by GPT-5.',
};

// Scores are out of 100. Numbers are best-effort as of early 2026.
export const BENCHMARKS: BenchmarkRow[] = [
  {
    model_id: 'claude-opus-4-7',
    model: 'Claude Opus 4.7',
    vendor: 'Anthropic',
    release: '2026-04',
    notes: 'Latest Opus generation. Top scorer on SWE-Bench, strongest agentic coder.',
    scores: [
      { axis: 'mmlu', score: 92 },
      { axis: 'humaneval', score: 96 },
      { axis: 'math', score: 86 },
      { axis: 'gpqa', score: 73 },
      { axis: 'swebench', score: 76 },
      { axis: 'mtbench', score: 9.4 * 10 },
    ],
  },
  {
    model_id: 'claude-sonnet-4-6',
    model: 'Claude Sonnet 4.6',
    vendor: 'Anthropic',
    release: '2026-03',
    notes: 'Default for everyday use. 1M context, big code wins, ships in Claude Code.',
    scores: [
      { axis: 'mmlu', score: 89 },
      { axis: 'humaneval', score: 93 },
      { axis: 'math', score: 81 },
      { axis: 'gpqa', score: 67 },
      { axis: 'swebench', score: 69 },
      { axis: 'mtbench', score: 9.1 * 10 },
    ],
  },
  {
    model_id: 'claude-haiku-4-5',
    model: 'Claude Haiku 4.5',
    vendor: 'Anthropic',
    release: '2025-10',
    notes: 'Cheap and fast, surprisingly strong on coding tasks.',
    scores: [
      { axis: 'mmlu', score: 80 },
      { axis: 'humaneval', score: 85 },
      { axis: 'math', score: 64 },
      { axis: 'gpqa', score: 52 },
      { axis: 'swebench', score: 48 },
      { axis: 'mtbench', score: 8.4 * 10 },
    ],
  },
  {
    model_id: 'gpt-5',
    model: 'GPT-5',
    vendor: 'OpenAI',
    release: '2025-08',
    notes: 'Best general reasoning, multimodal native.',
    scores: [
      { axis: 'mmlu', score: 92 },
      { axis: 'humaneval', score: 93 },
      { axis: 'math', score: 88 },
      { axis: 'gpqa', score: 74 },
      { axis: 'swebench', score: 68 },
      { axis: 'mtbench', score: 9.2 * 10 },
    ],
  },
  {
    model_id: 'gpt-5-mini',
    model: 'GPT-5 mini',
    vendor: 'OpenAI',
    release: '2025-09',
    notes: 'Strong cost-balanced model for chat and tool use.',
    scores: [
      { axis: 'mmlu', score: 84 },
      { axis: 'humaneval', score: 87 },
      { axis: 'math', score: 72 },
      { axis: 'gpqa', score: 58 },
      { axis: 'swebench', score: 52 },
      { axis: 'mtbench', score: 8.7 * 10 },
    ],
  },
  {
    model_id: 'gemini-2-5-pro',
    model: 'Gemini 2.5 Pro',
    vendor: 'Google',
    release: '2025-11',
    notes: '2M context, best at long-document understanding.',
    scores: [
      { axis: 'mmlu', score: 89 },
      { axis: 'humaneval', score: 88 },
      { axis: 'math', score: 82 },
      { axis: 'gpqa', score: 68 },
      { axis: 'swebench', score: 55 },
      { axis: 'mtbench', score: 9.0 * 10 },
    ],
  },
  {
    model_id: 'gemini-2-5-flash',
    model: 'Gemini 2.5 Flash',
    vendor: 'Google',
    release: '2025-12',
    notes: 'Fast and cheap, ideal for RAG and bulk tasks.',
    scores: [
      { axis: 'mmlu', score: 78 },
      { axis: 'humaneval', score: 81 },
      { axis: 'math', score: 62 },
      { axis: 'gpqa', score: 51 },
      { axis: 'swebench', score: 38 },
      { axis: 'mtbench', score: 8.3 * 10 },
    ],
  },
  {
    model_id: 'llama-4-maverick',
    model: 'Llama 4 Maverick',
    vendor: 'Meta',
    release: '2025-10',
    notes: 'Best open-weights model, runs fastest on Groq.',
    scores: [
      { axis: 'mmlu', score: 86 },
      { axis: 'humaneval', score: 84 },
      { axis: 'math', score: 75 },
      { axis: 'gpqa', score: 62 },
      { axis: 'swebench', score: 49 },
      { axis: 'mtbench', score: 8.6 * 10 },
    ],
  },
  {
    model_id: 'deepseek-v3',
    model: 'DeepSeek V3',
    vendor: 'DeepSeek',
    release: '2025-12',
    notes: 'Punches above its price class, strong coding model.',
    scores: [
      { axis: 'mmlu', score: 83 },
      { axis: 'humaneval', score: 89 },
      { axis: 'math', score: 78 },
      { axis: 'gpqa', score: 60 },
      { axis: 'swebench', score: 54 },
      { axis: 'mtbench', score: 8.5 * 10 },
    ],
  },
  {
    model_id: 'mistral-large-2',
    model: 'Mistral Large 2',
    vendor: 'Mistral',
    release: '2025-07',
    notes: 'European hosting option, solid tool use.',
    scores: [
      { axis: 'mmlu', score: 81 },
      { axis: 'humaneval', score: 80 },
      { axis: 'math', score: 65 },
      { axis: 'gpqa', score: 54 },
      { axis: 'swebench', score: 36 },
      { axis: 'mtbench', score: 8.4 * 10 },
    ],
  },
  {
    model_id: 'qwen-3',
    model: 'Qwen 3',
    vendor: 'Alibaba',
    release: '2026-01',
    notes: 'Strongest multilingual scores, also open weights.',
    scores: [
      { axis: 'mmlu', score: 82 },
      { axis: 'humaneval', score: 83 },
      { axis: 'math', score: 70 },
      { axis: 'gpqa', score: 56 },
      { axis: 'swebench', score: 42 },
      { axis: 'mtbench', score: 8.5 * 10 },
    ],
  },
  {
    model_id: 'grok-4',
    model: 'Grok 4',
    vendor: 'xAI',
    release: '2025-11',
    notes: 'Real-time data access via X integration.',
    scores: [
      { axis: 'mmlu', score: 84 },
      { axis: 'humaneval', score: 82 },
      { axis: 'math', score: 73 },
      { axis: 'gpqa', score: 59 },
      { axis: 'swebench', score: 41 },
      { axis: 'mtbench', score: 8.5 * 10 },
    ],
  },
];

export function getScore(row: BenchmarkRow, axis: BenchmarkAxis): number {
  return row.scores.find((s) => s.axis === axis)?.score ?? 0;
}

export function leaderByAxis(axis: BenchmarkAxis): BenchmarkRow | null {
  let best: BenchmarkRow | null = null;
  let bestScore = -Infinity;
  for (const row of BENCHMARKS) {
    const s = getScore(row, axis);
    if (s > bestScore) {
      bestScore = s;
      best = row;
    }
  }
  return best;
}
