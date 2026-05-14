// Use-case catalog: maps a concrete "I want to..." intent to the recommended
// tool, prompt, recipe, and glossary term. Used by /use-cases to give visitors
// a fast scenario-based entry point into the rest of the site.

export type UseCaseCategory = 'code' | 'write' | 'research' | 'data' | 'ship' | 'learn';

export const USE_CASE_CATEGORY_LABEL: Record<UseCaseCategory, string> = {
  code: 'Code',
  write: 'Write',
  research: 'Research',
  data: 'Data',
  ship: 'Ship',
  learn: 'Learn',
};

export interface UseCase {
  slug: string;
  intent: string;
  category: UseCaseCategory;
  tool_slug?: string;
  prompt_slug?: string;
  recipe_slug?: string;
  glossary_slug?: string;
  body: string;
}

export const USE_CASES: UseCase[] = [
  // ── code (5) ────────────────────────────────────────────────────────────
  {
    slug: 'refactor-class-to-hooks',
    category: 'code',
    intent: 'I want to refactor a giant class component',
    tool_slug: 'claude-code',
    prompt_slug: 'refactor-class-to-hooks',
    body: 'Mechanical migrations are where a terminal-resident agent earns its keep. Paste the file into Claude Code and use the refactor prompt to get a clean diff plus a callout for any subtle behavior changes.',
  },
  {
    slug: 'debug-from-stack-trace',
    category: 'code',
    intent: 'I want to debug a confusing stack trace',
    tool_slug: 'cursor',
    prompt_slug: 'find-the-bug',
    body: 'Cursor indexes your repo so the model can walk the full call stack, not just the line that threw. Pair it with the find-the-bug prompt to get the smallest fix plus a test that would have caught it.',
  },
  {
    slug: 'self-review-a-pr',
    category: 'code',
    intent: 'I want to review my own pull request before sending it',
    tool_slug: 'claude-code',
    prompt_slug: 'pr-self-review',
    body: 'A second pass from a model catches the stuff you stop seeing after the third commit. Run the PR self-review prompt against the diff to surface risky changes, missing tests, and naming issues.',
  },
  {
    slug: 'write-unit-tests',
    category: 'code',
    intent: 'I want to write unit tests for a function',
    tool_slug: 'aider',
    prompt_slug: 'unit-tests-edge-cases',
    body: 'Aider edits files in place and runs your test command in a loop, so tests land next to the code they cover. Hand it the unit-tests-edge-cases prompt to fan out happy paths, edge cases, and failure modes.',
  },
  {
    slug: 'scaffold-a-monorepo',
    category: 'code',
    intent: 'I want to scaffold a new module or monorepo',
    tool_slug: 'claude-code',
    prompt_slug: 'monorepo-bootstrap',
    recipe_slug: 'cli-power-flow',
    body: 'New-project scaffolding is faster from a terminal agent than from a chat UI because it can run the install steps itself. Pair the monorepo-bootstrap prompt with a CLI-first stack to get from zero to first commit in one session.',
  },

  // ── write (3) ───────────────────────────────────────────────────────────
  {
    slug: 'write-function-docs',
    category: 'write',
    intent: 'I want to document a function I just wrote',
    tool_slug: 'claude-code',
    prompt_slug: 'function-jsdoc',
    body: 'Inline doc generation is a tight loop best done in the editor. Use the function-jsdoc prompt to get param tables, examples, and edge-case notes without leaving the file.',
  },
  {
    slug: 'write-changelog',
    category: 'write',
    intent: 'I want to turn commits into a release changelog',
    tool_slug: 'claude-code',
    prompt_slug: 'changelog-from-commits',
    body: 'Hand a model a list of merged commits and it will group them into a readable changelog faster than you can write the headers. The changelog-from-commits prompt handles the grouping and tone for you.',
  },
  {
    slug: 'write-a-prd',
    category: 'write',
    intent: 'I want to turn rough notes into a PRD',
    tool_slug: 'chatgpt',
    prompt_slug: 'prd-from-rough-notes',
    body: 'Long-form structured writing is a chat-UI strength, with the canvas view giving you a side-by-side edit surface. Drop your raw notes into the prd-from-rough-notes prompt to get a goals, scope, and risks skeleton you can refine.',
  },

  // ── research (3) ────────────────────────────────────────────────────────
  {
    slug: 'summarize-a-paper',
    category: 'research',
    intent: 'I want to summarize a research paper',
    tool_slug: 'notebooklm',
    recipe_slug: 'research-workspace',
    body: 'NotebookLM grounds every sentence in the source PDF, which keeps summaries honest. Drop the paper in, ask for a structured summary, then export key claims into a research notebook for follow-up.',
  },
  {
    slug: 'compare-two-approaches',
    category: 'research',
    intent: 'I want to compare two technical approaches',
    tool_slug: 'perplexity',
    glossary_slug: 'long-context',
    body: 'Perplexity pulls fresh sources with citations, so trade-off answers reflect this quarter rather than last year. Ask for a side-by-side with weighted pros and cons, then verify the citations before you decide.',
  },
  {
    slug: 'deep-research-a-topic',
    category: 'research',
    intent: 'I want to do deep research on an unfamiliar topic',
    tool_slug: 'perplexity',
    recipe_slug: 'research-workspace',
    body: 'Use a deep-research mode to get an iterative, sourced report instead of a single answer. Pair it with the research-workspace stack so you can capture, tag, and revisit findings instead of losing them in a chat history.',
  },

  // ── data (3) ────────────────────────────────────────────────────────────
  {
    slug: 'sql-from-question',
    category: 'data',
    intent: 'I want to write SQL from a plain-English question',
    tool_slug: 'chatgpt',
    prompt_slug: 'sql-from-question',
    body: 'For ad-hoc analytics SQL, a chat UI with schema pasted in beats an in-editor agent. Use the sql-from-question prompt to constrain dialect, name conventions, and result shape before you run anything.',
  },
  {
    slug: 'build-a-rag-pipeline',
    category: 'data',
    intent: 'I want to build a RAG pipeline over my docs',
    tool_slug: 'llamaindex',
    recipe_slug: 'rag-app-stack',
    glossary_slug: 'rag',
    body: 'LlamaIndex gives you ingestion, chunking, and retrieval out of the box, so you can focus on eval and ranking. The rag-app-stack recipe wires it to embeddings, a vector store, and a gateway end-to-end.',
  },
  {
    slug: 'design-eval-harness',
    category: 'data',
    intent: 'I want to design an eval harness for a RAG system',
    tool_slug: 'langchain',
    prompt_slug: 'rag-eval-harness',
    recipe_slug: 'evals-first',
    body: 'Without evals, RAG changes are vibes. Use the rag-eval-harness prompt to define metrics and the evals-first recipe to lock CI gates around them before shipping retrieval changes.',
  },

  // ── ship (3) ────────────────────────────────────────────────────────────
  {
    slug: 'scaffold-nextjs-ai-app',
    category: 'ship',
    intent: 'I want to scaffold a Next.js app with an AI feature',
    tool_slug: 'vercel-ai-sdk',
    recipe_slug: 'ui-prototype',
    body: 'The Vercel AI SDK ships streaming, tool calls, and structured outputs as React-friendly primitives. Pair it with the ui-prototype stack to get from idea to a deployed preview URL in an afternoon.',
  },
  {
    slug: 'set-up-production-evals',
    category: 'ship',
    intent: 'I want to set up evals before I deploy',
    recipe_slug: 'evals-first',
    prompt_slug: 'rag-eval-harness',
    body: 'Evals are the seatbelt that lets you iterate without breaking production. The evals-first recipe sketches the metrics, datasets, and CI plumbing you need before your first paying user lands.',
  },
  {
    slug: 'route-and-failover-models',
    category: 'ship',
    intent: 'I want to route between providers and fail over safely',
    tool_slug: 'ai-gateway',
    glossary_slug: 'gateway',
    body: 'A gateway gives you one URL, retries, rate limits, and per-model usage tracking. Put one in front of your app so swapping models or providers is a config change, not a deploy.',
  },

  // ── learn (3) ───────────────────────────────────────────────────────────
  {
    slug: 'tutor-on-a-concept',
    category: 'learn',
    intent: 'I want a patient tutor on a tricky concept',
    tool_slug: 'chatgpt',
    prompt_slug: 'tutor-a-concept',
    body: 'A chat UI with voice and canvas modes makes back-and-forth tutoring feel natural. The tutor-a-concept prompt steers the model into Socratic mode so you actually learn instead of getting a wall of text.',
  },
  {
    slug: 'pair-on-an-algorithm',
    category: 'learn',
    intent: 'I want to pair on an algorithm problem',
    tool_slug: 'cursor',
    prompt_slug: 'pair-on-an-algorithm',
    body: 'Cursor sees your editor, so it can react to the partial solution instead of guessing what you typed. The pair-on-an-algorithm prompt asks the model to coach you toward the answer rather than dump it.',
  },
  {
    slug: 'decode-an-error',
    category: 'learn',
    intent: 'I want to decode a cryptic error message',
    tool_slug: 'claude-code',
    prompt_slug: 'explain-error-message',
    glossary_slug: 'hallucination',
    body: 'Error decoding is short, factual work where an agent with file access wins because it can read the surrounding code. The explain-error-message prompt gives you a plain-English cause plus the smallest fix to try first.',
  },
];
