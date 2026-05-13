// Pre-built AI tool stacks. Each recipe is a sequence of tool slugs plus
// a config snippet you can drop into your shell or repo to get going fast.

export interface Recipe {
  slug: string;
  title: string;
  tagline: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_minutes: number;
  tools: string[];
  config_lang: 'bash' | 'toml' | 'json' | 'yaml';
  config: string;
  steps: string[];
}

export const RECIPES: Recipe[] = [
  {
    slug: 'solo-student',
    title: 'Solo student starter',
    tagline: 'Free tools that get you productive in an afternoon.',
    difficulty: 'easy',
    estimated_minutes: 30,
    tools: ['chatgpt', 'claude-code', 'perplexity'],
    config_lang: 'bash',
    config: `# 1) Install Claude Code
brew install anthropics/anthropic/claude
claude auth login

# 2) Run from your project root
cd ~/your-project
claude

# 3) Bookmark these in your browser
# chat.openai.com
# claude.ai
# perplexity.ai`,
    steps: [
      'Sign up for free accounts on chat.openai.com, claude.ai, and perplexity.ai.',
      'Install Claude Code via brew and run claude auth login.',
      'Open your project and run claude in the terminal.',
      'Ask the same question on all three. Notice the differences in tone and citations.',
    ],
  },
  {
    slug: 'paid-power-user',
    title: 'Paid power user',
    tagline: 'Cursor + Claude Code together, with prompt caching turned on.',
    difficulty: 'medium',
    estimated_minutes: 60,
    tools: ['cursor', 'claude-code', 'claude-api', 'aider'],
    config_lang: 'bash',
    config: `# 1) Cursor: download + sign in for Pro
open https://cursor.com/download

# 2) Claude Code with API direct usage for caching
export ANTHROPIC_API_KEY=sk-ant-...
claude --model claude-sonnet-4-6 --enable-prompt-cache

# 3) Aider for surgical edits with git commits
pip install aider-chat
aider --model sonnet --map-tokens 8000`,
    steps: [
      'Subscribe to Cursor Pro for full codebase awareness.',
      'Set ANTHROPIC_API_KEY for direct API access from Claude Code, you get prompt caching.',
      'Install Aider for the cases where you want each change as its own git commit.',
      'Use Cursor for exploration, Claude Code for multi-file refactors, Aider for surgical patches.',
    ],
  },
  {
    slug: 'rag-app-stack',
    title: 'RAG app from scratch',
    tagline: 'A production-shaped retrieval pipeline you can extend.',
    difficulty: 'hard',
    estimated_minutes: 240,
    tools: ['llamaindex', 'vercel-ai-sdk', 'claude-api', 'ai-gateway'],
    config_lang: 'bash',
    config: `# 1) Bootstrap the app
pnpm create next-app rag-app
cd rag-app
pnpm add ai @ai-sdk/anthropic llamaindex @llamaindex/postgres

# 2) Postgres with pgvector
docker run -d --name pg -e POSTGRES_PASSWORD=devpass \\
  -p 5432:5432 pgvector/pgvector:pg16

# 3) Environment
cat > .env.local <<'EOF'
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgres://postgres:devpass@localhost:5432/postgres
AI_GATEWAY_KEY=...
EOF`,
    steps: [
      'Create a Next.js app and install LlamaIndex + the Vercel AI SDK.',
      'Run Postgres with pgvector via Docker for the vector store.',
      'Ingest your corpus with LlamaIndex chunking + embedding pipeline.',
      'Wire the retriever into a Claude Sonnet generator via the Vercel AI Gateway.',
      'Set up an eval harness before iterating on prompts.',
    ],
  },
  {
    slug: 'agent-builder',
    title: 'Agent that uses tools',
    tagline: 'Claude Agent SDK plus MCP servers for filesystem, GitHub, and shell.',
    difficulty: 'hard',
    estimated_minutes: 180,
    tools: ['claude-agent-sdk', 'mcp-servers', 'claude-api'],
    config_lang: 'toml',
    config: `# claude-agent.toml
model = "claude-opus-4"
max_iterations = 12

[[mcp_servers]]
name = "filesystem"
command = "npx -y @modelcontextprotocol/server-filesystem /tmp/workspace"

[[mcp_servers]]
name = "github"
command = "docker run -i --rm mcp/github"
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_..." }

[[mcp_servers]]
name = "shell"
command = "uvx mcp-server-shell --workdir /tmp/workspace"`,
    steps: [
      'Install the Claude Agent SDK and choose 2 to 3 MCP servers.',
      'Define your task as a system prompt with explicit success criteria.',
      'Run the agent in a sandboxed workdir, never on your real shell on day one.',
      'Iterate by inspecting the transcript and tightening the system prompt.',
    ],
  },
  {
    slug: 'oss-only',
    title: 'Open source only',
    tagline: 'Local-first AI dev with zero paid SaaS dependencies.',
    difficulty: 'medium',
    estimated_minutes: 90,
    tools: ['continue-dev', 'aider', 'mcp-servers', 'codex-cli'],
    config_lang: 'json',
    config: `{
  "models": [
    {
      "title": "Llama 4 via Ollama",
      "provider": "ollama",
      "model": "llama4:70b"
    },
    {
      "title": "DeepSeek V3",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://api.deepseek.com/v1",
      "apiKey": "sk-..."
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen Coder",
    "provider": "ollama",
    "model": "qwen2.5-coder:7b"
  }
}`,
    steps: [
      'Install Ollama and pull llama4 + qwen2.5-coder for local inference.',
      'Configure Continue to use the local models for chat and autocomplete.',
      'Use Aider with --model deepseek-chat for cheap remote inference when the local box is too slow.',
      'Hook up MCP servers for any tool surfaces you need.',
    ],
  },
  {
    slug: 'team-stack',
    title: 'Small team production stack',
    tagline: 'For a 5 to 20 person team shipping AI features behind a gateway.',
    difficulty: 'hard',
    estimated_minutes: 360,
    tools: ['ai-gateway', 'vercel-ai-sdk', 'claude-api', 'langchain'],
    config_lang: 'yaml',
    config: `# vercel-ai-gateway.yml
default_provider: anthropic
fallback_chain:
  - anthropic/claude-sonnet-4-6
  - openai/gpt-5-mini
  - google/gemini-2.5-pro

budgets:
  by_team:
    growth: 500
    platform: 2000
    research: 10000

caching:
  enabled: true
  ttl_seconds: 3600

observability:
  log_prompts: true
  log_completions: true
  pii_redaction: strict`,
    steps: [
      'Stand up the Vercel AI Gateway with a default provider and fallback chain.',
      'Wire the AI SDK into the app, route every call through the gateway.',
      'Set per-team budgets and PII redaction policies before public traffic hits.',
      'Add LangChain for the cases where you need composable chains over a single model.',
    ],
  },
  {
    slug: 'research-workspace',
    title: 'Researcher\'s workspace',
    tagline: 'Read papers, run benchmarks, write notes, ship a paper repo.',
    difficulty: 'medium',
    estimated_minutes: 120,
    tools: ['notebooklm', 'perplexity', 'claude-api', 'claude-code'],
    config_lang: 'bash',
    config: `# Daily flow
# 1) Read: paste PDFs into NotebookLM, ask questions of the corpus
open https://notebooklm.google.com

# 2) Search: Perplexity in academic focus mode
open https://www.perplexity.ai

# 3) Code: Claude Code on the repo with --extended-thinking
claude --model claude-opus-4 --extended-thinking-budget 32000

# 4) API for eval pipelines
export ANTHROPIC_API_KEY=sk-ant-...
python -m experiments.eval --provider anthropic --model claude-opus-4`,
    steps: [
      'Drop PDFs into NotebookLM to query a curated corpus.',
      'Use Perplexity\'s academic focus when you need fresh citations.',
      'Run Claude Code with extended thinking for tricky derivations.',
      'Drive eval pipelines directly from the Anthropic API for full control.',
    ],
  },
  {
    slug: 'ui-prototype',
    title: 'Prototype a UI in one sitting',
    tagline: 'v0 for the first draft, Cursor to clean it up.',
    difficulty: 'easy',
    estimated_minutes: 90,
    tools: ['v0', 'cursor', 'vercel-ai-sdk'],
    config_lang: 'bash',
    config: `# 1) Describe the UI to v0 in natural language
open https://v0.app

# 2) Export the generated project
v0 export my-app

# 3) Open in Cursor for cleanup
cursor my-app
# In Cursor: cmd-K to refactor, cmd-L for chat-style cleanup`,
    steps: [
      'Sketch the UI in v0 with a few descriptive turns.',
      'Export the project to your local machine.',
      'Open in Cursor and refactor the AI-generated code into your team\'s conventions.',
      'Wire real data with the Vercel AI SDK if the UI needs streaming AI output.',
    ],
  },
  {
    slug: 'cli-power-flow',
    title: 'Terminal-only power flow',
    tagline: 'For folks who live in tmux, vim, and ssh.',
    difficulty: 'medium',
    estimated_minutes: 60,
    tools: ['claude-code', 'aider', 'codex-cli', 'gemini-cli'],
    config_lang: 'bash',
    config: `# ~/.zshrc additions
alias c='claude'
alias ai='aider --model sonnet --no-suggest-shell-commands'
alias g='gemini'
alias x='codex'

# Quick prompt of all four against the same question
alias askall='claude -p "$1" & aider --message "$1" & gemini -p "$1" & codex -p "$1" & wait'`,
    steps: [
      'Install all four CLIs.',
      'Add short aliases to your shell.',
      'Use claude for big refactors, aider for incremental commits, codex for OpenAI-flavored answers, gemini for huge context.',
      'When stuck, fan out the same question to all four and compare.',
    ],
  },
  {
    slug: 'evals-first',
    title: 'Evals before production',
    tagline: 'Lock in quality before shipping any prompt or model change.',
    difficulty: 'hard',
    estimated_minutes: 180,
    tools: ['llamaindex', 'claude-api', 'ai-gateway', 'langchain'],
    config_lang: 'bash',
    config: `# 1) Install the eval harness
pip install promptfoo
npx promptfoo init

# 2) Define eval cases
# promptfooconfig.yaml
# providers: [anthropic:claude-sonnet-4-6, openai:gpt-5-mini]
# prompts: ['file://prompts/system.md']
# tests: [...]

# 3) Run on every prompt change
promptfoo eval --output evals.json
promptfoo view`,
    steps: [
      'Build a small eval set of ground truth examples (50 to 200 cases).',
      'Pick 2 to 3 candidate models to evaluate.',
      'Define metrics, factuality, latency, cost per call.',
      'Run the eval on every prompt change and gate prod deploys on the score not dropping.',
    ],
  },
];

export const DIFFICULTY_LABEL: Record<Recipe['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function findRecipe(slug: string): Recipe | null {
  return RECIPES.find((r) => r.slug === slug) ?? null;
}
