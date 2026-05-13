// Four curated learning paths from total beginner to research engineer.
// Each step references either a tool slug or a glossary slug. The /learn
// page composes these into linked cards.

export type StepKind = 'tool' | 'concept';

export interface LearningStep {
  kind: StepKind;
  ref: string;
  why: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  tagline: string;
  audience: string;
  estimated_hours: number;
  steps: LearningStep[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: 'beginner',
    title: 'Day one with AI tools',
    tagline: 'From zero to sending your first useful prompt.',
    audience: 'You have heard about AI but never used a coding agent.',
    estimated_hours: 2,
    steps: [
      { kind: 'concept', ref: 'llm', why: 'Understand what a model actually does.' },
      { kind: 'concept', ref: 'prompt', why: 'How to ask the model effectively.' },
      { kind: 'tool', ref: 'chatgpt', why: 'Free chat to get a feel for back and forth.' },
      { kind: 'tool', ref: 'perplexity', why: 'Search style answers grounded in citations.' },
      { kind: 'concept', ref: 'hallucination', why: 'Know when to trust the answer.' },
      { kind: 'tool', ref: 'claude-code', why: 'Try a coding agent in your terminal.' },
    ],
  },
  {
    slug: 'student-dev',
    title: 'Student developer',
    tagline: 'Build with AI in your editor without breaking your codebase.',
    audience: 'You write code, want AI to speed up real work.',
    estimated_hours: 6,
    steps: [
      { kind: 'concept', ref: 'context-window', why: 'Why long prompts cost more and how to trim them.' },
      { kind: 'tool', ref: 'cursor', why: 'AI native editor with codebase awareness.' },
      { kind: 'tool', ref: 'claude-code', why: 'Terminal agent that edits files via instructions.' },
      { kind: 'tool', ref: 'aider', why: 'Open source pair coding with git commits per change.' },
      { kind: 'concept', ref: 'prompt-cache', why: 'Cache long prompts to cut API bills 90 percent.' },
      { kind: 'tool', ref: 'continue-dev', why: 'Self hosted IDE assistant when you want to BYO model.' },
      { kind: 'concept', ref: 'sandbox', why: 'Run agent code without giving it your shell.' },
    ],
  },
  {
    slug: 'agent-builder',
    title: 'Agent builder',
    tagline: 'Wire up a real agent that uses tools and reads docs.',
    audience: 'You have shipped with an LLM, ready to build agentic features.',
    estimated_hours: 12,
    steps: [
      { kind: 'concept', ref: 'agent', why: 'Definition before architecture.' },
      { kind: 'concept', ref: 'tool-use', why: 'Function calling is the load bearing primitive.' },
      { kind: 'tool', ref: 'claude-agent-sdk', why: 'Official Anthropic SDK for agent loops.' },
      { kind: 'concept', ref: 'mcp', why: 'Reusable tool servers across all clients.' },
      { kind: 'tool', ref: 'mcp-servers', why: 'Catalog of MCP servers to drop into your agent.' },
      { kind: 'tool', ref: 'vercel-ai-sdk', why: 'Streaming UI, multi provider, edge deploys.' },
      { kind: 'tool', ref: 'ai-gateway', why: 'Route between providers with one key.' },
      { kind: 'concept', ref: 'prompt-injection', why: 'Lock down untrusted input before it hits your tools.' },
    ],
  },
  {
    slug: 'researcher',
    title: 'Research engineer',
    tagline: 'Squeeze accuracy and cost out of frontier models.',
    audience: 'You ship LLM features at scale, optimizing for evals.',
    estimated_hours: 20,
    steps: [
      { kind: 'concept', ref: 'eval', why: 'You cannot improve what you do not measure.' },
      { kind: 'concept', ref: 'chain-of-thought', why: 'When extended thinking is worth the latency.' },
      { kind: 'concept', ref: 'long-context', why: 'Tradeoffs above 200K input tokens.' },
      { kind: 'concept', ref: 'batch-api', why: '50 percent off for offline pipelines.' },
      { kind: 'tool', ref: 'claude-api', why: 'Direct API with caching and batching.' },
      { kind: 'tool', ref: 'langchain', why: 'Composable building blocks for RAG and chains.' },
      { kind: 'tool', ref: 'llamaindex', why: 'Production grade data framework for RAG.' },
      { kind: 'concept', ref: 'open-weights', why: 'Self host when latency or compliance demand it.' },
    ],
  },
];

export function findPath(slug: string): LearningPath | null {
  return LEARNING_PATHS.find((p) => p.slug === slug) ?? null;
}
