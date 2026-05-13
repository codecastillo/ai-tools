-- Migration 008: seed pricing_tiers, strengths, workflows, popularity for all curated tools.
-- Uses Postgres dollar quoting so apostrophes inside the JSON do not need escaping.
-- Idempotent: UPDATE statements are safe to re-run.

-- ── Claude family ────────────────────────────────────────────────────────────

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Sign in with any Claude account",
        "Limited daily Claude Code sessions on Sonnet",
        "Basic context window",
        "Single active session"
      ]
    },
    {
      "name": "Pro",
      "price": "$20",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Regular Claude Code sessions",
        "Access to Opus and extended thinking",
        "Higher usage caps than Free",
        "Priority during normal hours"
      ],
      "cta": { "label": "Start Pro", "href": "https://www.anthropic.com/pricing" }
    },
    {
      "name": "Max",
      "price": "$100",
      "period": "/mo",
      "features": [
        "5x to 20x Pro usage caps",
        "Multi-session, parallel work",
        "Priority access at peak hours",
        "Longest context windows on Max 20x"
      ]
    },
    {
      "name": "API direct",
      "price": "Pay as you go",
      "features": [
        "Opus 4: $15 input, $75 output per 1M tokens",
        "Sonnet 4: $3 input, $15 output per 1M tokens",
        "Haiku 4: $0.80 input, $4 output per 1M tokens",
        "Prompt caching cuts cached input by up to 90%",
        "Batch API discounts input and output by 50%"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 9 },
    { "axis": "price", "score": 6 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 8 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Refactor a React component",
      "prompt": "Refactor src/components/Header.tsx to extract the nav into its own component and add a sticky behavior on scroll.",
      "steps": [
        "Claude maps the file and its imports",
        "Proposes a diff and waits for approval",
        "Applies the edit and runs the dev server",
        "Reports the new file tree and any type errors"
      ],
      "outcome": "Header is split, sticky on scroll, types pass."
    },
    {
      "title": "Fix a failing test",
      "prompt": "The test suite/auth.spec.ts is failing on the login redirect case. Investigate and fix.",
      "steps": [
        "Runs the failing test and reads the stack trace",
        "Inspects the auth middleware and route handler",
        "Patches the redirect logic and re-runs the test",
        "Summarises the root cause in plain English"
      ],
      "outcome": "Green test, with a short write-up of what broke."
    },
    {
      "title": "Add a new database column with migration",
      "prompt": "Add a 'last_seen' timestamp to the users table, create a migration, and update the ORM model and tests.",
      "steps": [
        "Generates a new SQL migration",
        "Updates the ORM model and TypeScript types",
        "Adjusts seed data and existing tests",
        "Runs the migration locally and re-runs the test suite"
      ],
      "outcome": "Column added end to end, all tests green."
    }
  ]$$::jsonb,
  popularity = 98
WHERE slug = 'claude-code';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Pay per use",
      "price": "Token-based",
      "highlight": true,
      "features": [
        "SDK itself is free, MIT licensed",
        "Opus 4: $15 input, $75 output per 1M tokens",
        "Sonnet 4: $3 input, $15 output per 1M tokens",
        "Haiku 4: $0.80 input, $4 output per 1M tokens",
        "Prompt caching cuts cached input by up to 90%",
        "Works with any Anthropic-compatible provider"
      ],
      "cta": { "label": "Read SDK docs", "href": "https://docs.anthropic.com/en/api/agent-sdk" }
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 9 },
    { "axis": "price", "score": 6 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 6 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Build a custom coding agent",
      "prompt": "Wire up an agent that can read files, run shell commands, and commit to git, using the Agent SDK.",
      "steps": [
        "Define read_file, run_shell, and git_commit tools",
        "Compose them into an agent loop with a system prompt",
        "Stream events to a CLI or web UI",
        "Add cache_control to the system prompt for cost"
      ],
      "outcome": "A working terminal agent in around 150 lines of TypeScript."
    },
    {
      "title": "Add a tool to an existing agent",
      "prompt": "Register a search_docs tool that queries our internal vector store and pass it to the agent loop.",
      "steps": [
        "Use defineTool with a Zod input schema",
        "Implement the handler against the vector store client",
        "Pass the new tool into agent.run",
        "Verify the model calls it with sensible inputs"
      ],
      "outcome": "Agent can answer doc questions with citations."
    }
  ]$$::jsonb,
  popularity = 68
WHERE slug = 'claude-agent-sdk';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source",
      "price": "Free",
      "highlight": true,
      "features": [
        "MIT licensed protocol and SDKs",
        "Hundreds of community servers",
        "Self host or run locally",
        "No fee from Anthropic for using MCP",
        "Pay only for the upstream services your servers wrap"
      ],
      "cta": { "label": "Browse servers", "href": "https://github.com/modelcontextprotocol/servers" }
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 10 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 6 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Connect Claude Desktop to Postgres",
      "prompt": "Install the postgres MCP server and let Claude Desktop query my local dev database.",
      "steps": [
        "npx -y @modelcontextprotocol/server-postgres",
        "Add the server entry to claude_desktop_config.json",
        "Restart Claude Desktop and confirm tools appear",
        "Ask: 'list the tables in the public schema'"
      ],
      "outcome": "Claude can read your database, no glue code."
    },
    {
      "title": "Write a custom MCP server",
      "prompt": "Wrap our internal billing API as an MCP server so any AI client can call it.",
      "steps": [
        "Scaffold with npx create-server",
        "Define one tool per endpoint with input schemas",
        "Run over stdio or HTTP",
        "Register with Claude Desktop or Cursor"
      ],
      "outcome": "Your APIs become first-class AI tools."
    }
  ]$$::jsonb,
  popularity = 42
WHERE slug = 'mcp-servers';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Pay per use",
      "price": "Token-based",
      "highlight": true,
      "features": [
        "Opus 4: $15 input, $75 output per 1M tokens",
        "Sonnet 4: $3 input, $15 output per 1M tokens",
        "Haiku 4: $0.80 input, $4 output per 1M tokens",
        "Prompt caching: up to 90% off cached input",
        "Message Batches: 50% off input and output within 24h",
        "Free trial credit on signup"
      ],
      "cta": { "label": "Open Console", "href": "https://console.anthropic.com" }
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 8 },
    { "axis": "accuracy", "score": 10 },
    { "axis": "price", "score": 6 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 5 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Add streaming chat to a Next.js route",
      "prompt": "Create an /api/chat route that streams Claude responses to the client.",
      "steps": [
        "Install @anthropic-ai/sdk",
        "Create an Edge or Node route handler",
        "Call client.messages.create with stream: true",
        "Pipe the response back as text/event-stream"
      ],
      "outcome": "Token-by-token chat UI in production."
    },
    {
      "title": "Cache a long system prompt",
      "prompt": "Wrap our 5,000 token system prompt with cache_control so we stop paying full input cost on every call.",
      "steps": [
        "Mark the system block with cache_control: ephemeral",
        "Send a warmup request to populate the cache",
        "Monitor cache_read_input_tokens in the response",
        "Confirm the 90% discount on subsequent calls"
      ],
      "outcome": "Same prompt, a fraction of the input bill."
    },
    {
      "title": "Use tools for structured output",
      "prompt": "Make Claude extract { name, email, role } JSON from arbitrary HR documents.",
      "steps": [
        "Define an extract_person tool with a strict input schema",
        "Send the document with the tool attached",
        "Read the tool_use block from the response",
        "Validate with Zod or Pydantic"
      ],
      "outcome": "Reliable structured extraction with type safety."
    }
  ]$$::jsonb,
  popularity = 88
WHERE slug = 'claude-api';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source",
      "price": "Free",
      "highlight": true,
      "features": [
        "MIT licensed plugin pack",
        "Runs inside your existing Claude Code session",
        "No extra subscription, no telemetry",
        "Sponsor via GitHub Sponsors if you find it useful"
      ],
      "cta": { "label": "Install via Claude", "href": "https://github.com/obra/superpowers" }
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 6 },
    { "axis": "accuracy", "score": 9 },
    { "axis": "price", "score": 10 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 7 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Brainstorm before coding",
      "prompt": "Invoke superpowers:brainstorming to scope a new feature before any implementation.",
      "steps": [
        "Skill walks through user, intent, and constraints",
        "Surfaces unknowns and risky assumptions",
        "Produces a short written brief",
        "You approve the brief, then move to planning"
      ],
      "outcome": "Cheap clarity before expensive code."
    },
    {
      "title": "Test-driven development on autopilot",
      "prompt": "Use superpowers:test-driven-development to add a new endpoint with red-green-refactor discipline.",
      "steps": [
        "Write the failing test first",
        "Make the minimal change to pass",
        "Refactor with the test as the safety net",
        "Repeat until the feature is complete"
      ],
      "outcome": "Feature shipped with a real test suite, not after-the-fact."
    },
    {
      "title": "Systematic debugging",
      "prompt": "Invoke superpowers:systematic-debugging on a flaky CI failure.",
      "steps": [
        "Reproduce the failure locally",
        "Form a hypothesis and design a single experiment",
        "Verify before changing more than one thing",
        "Land a fix with a regression test"
      ],
      "outcome": "Root cause identified, not just symptoms patched."
    }
  ]$$::jsonb,
  popularity = 48
WHERE slug = 'superpowers';


-- ── Editors / coding CLIs ────────────────────────────────────────────────────

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Hobby",
      "price": "$0",
      "features": [
        "2,000 completions per month",
        "50 slow premium requests",
        "Basic tab model",
        "Single seat"
      ]
    },
    {
      "name": "Pro",
      "price": "$20",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Unlimited tab completions",
        "500 fast premium requests per month",
        "Agent and composer with Opus, Sonnet, GPT-5",
        "Codebase-aware refactors"
      ],
      "cta": { "label": "Try Pro", "href": "https://cursor.com/pricing" }
    },
    {
      "name": "Ultra",
      "price": "$200",
      "period": "/mo",
      "features": [
        "20x the Pro fast premium request quota",
        "Full agent throughput, no slow downgrades",
        "Priority routing on every model"
      ]
    },
    {
      "name": "Business",
      "price": "$40",
      "period": "/user/mo",
      "features": [
        "Everything in Pro",
        "SSO and org policies",
        "Audit log and central billing",
        "Privacy mode on by default"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 7 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Inline edit a selection",
      "prompt": "Highlight a function, press Cmd+K, and ask: 'rewrite this to use async iterators and add JSDoc'.",
      "steps": [
        "Select the code in the editor",
        "Press Cmd+K and describe the change",
        "Cursor shows the diff inline",
        "Accept or refine with a follow-up prompt"
      ],
      "outcome": "Targeted edit, no context switching."
    },
    {
      "title": "Multi-file agent edit with Composer",
      "prompt": "Composer, add a new /reports route end to end: API handler, page, sidebar link, and a basic empty state.",
      "steps": [
        "Composer plans across the affected files",
        "Generates a multi-file diff",
        "You review hunks one at a time",
        "Apply and run the dev server"
      ],
      "outcome": "Full feature scaffolded in minutes."
    },
    {
      "title": "Teach Cursor your conventions",
      "prompt": "Add a .cursorrules file that says 'use Zod for validation, ESM imports, no default exports'.",
      "steps": [
        "Drop a .cursorrules at repo root",
        "Describe project conventions in plain English",
        "Cursor includes it as context on every request",
        "New code follows your house style automatically"
      ],
      "outcome": "Consistent code without nagging the model each time."
    }
  ]$$::jsonb,
  popularity = 96
WHERE slug = 'cursor';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source",
      "price": "Free",
      "highlight": true,
      "features": [
        "Apache 2.0 licensed CLI",
        "Bring your own model key, any major provider",
        "Anthropic Sonnet: $3 input, $15 output per 1M tokens",
        "Local models via Ollama, free after hardware",
        "Use --cache-prompts to slash Anthropic costs"
      ],
      "cta": { "label": "Install Aider", "href": "https://aider.chat/docs/install.html" }
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 10 },
    { "axis": "ecosystem", "score": 6 },
    { "axis": "ease", "score": 6 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Pair-program against your git repo",
      "prompt": "cd into a repo, run 'aider --model sonnet', and ask: 'add a /health endpoint and a test for it'.",
      "steps": [
        "Aider maps the repo and picks relevant files",
        "Proposes an edit with the file diff",
        "Commits the change as a discrete git commit",
        "You can /undo if you do not like it"
      ],
      "outcome": "Code change with a clean git history."
    },
    {
      "title": "Migrate a file in place",
      "prompt": "/add src/legacy.js then 'rewrite this in TypeScript and keep the same public API'.",
      "steps": [
        "Pull only the file you care about into context",
        "Request the migration",
        "Aider edits and commits",
        "Drop the file with /drop when done"
      ],
      "outcome": "Tight, scoped migrations without context bloat."
    }
  ]$$::jsonb,
  popularity = 74
WHERE slug = 'aider';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source",
      "price": "Free",
      "highlight": true,
      "features": [
        "Apache 2.0 licensed CLI from OpenAI",
        "Sign in with ChatGPT Plus or Pro to use plan quota",
        "Or bring an OpenAI API key, pay per token",
        "Local execution, no per-seat fee for the CLI",
        "GPT-5 and o-series reasoning models supported"
      ],
      "cta": { "label": "Install Codex", "href": "https://github.com/openai/codex" }
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 8 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 7 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "One-shot a small fix",
      "prompt": "codex 'fix the off-by-one in pagination.ts and add a unit test'.",
      "steps": [
        "Codex reads the file and the surrounding tests",
        "Applies a minimal patch",
        "Runs the test suite",
        "Reports the outcome"
      ],
      "outcome": "Targeted bugfix with a test in under a minute."
    },
    {
      "title": "Sign in with ChatGPT and skip API keys",
      "prompt": "codex login, choose ChatGPT account, then start a session.",
      "steps": [
        "Run codex login",
        "Authorize the browser flow",
        "Codex draws from your Plus or Pro plan quota",
        "No API key management needed"
      ],
      "outcome": "Zero-config setup for ChatGPT subscribers."
    }
  ]$$::jsonb,
  popularity = 64
WHERE slug = 'codex-cli';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free tier",
      "price": "$0",
      "highlight": true,
      "features": [
        "60 requests per minute on Gemini 2.5 Pro",
        "1,000 requests per day",
        "Personal Google account login",
        "Most generous free tier of any major CLI"
      ],
      "cta": { "label": "Get started", "href": "https://github.com/google-gemini/gemini-cli" }
    },
    {
      "name": "Pay per token",
      "price": "Usage-based",
      "features": [
        "Gemini 2.5 Pro: $1.25 input, $10 output per 1M tokens",
        "Higher rates above 200k context",
        "Bring an AI Studio key",
        "1M+ token context window"
      ]
    },
    {
      "name": "Vertex AI",
      "price": "Enterprise",
      "features": [
        "Google Cloud billing and SSO",
        "Data residency controls",
        "Service account auth",
        "Committed-use discounts"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 8 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 9 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 8 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Ask questions over a whole repo",
      "prompt": "gemini 'explain how auth flows through this codebase, top to bottom'.",
      "steps": [
        "Drop the repo into the 1M+ context window",
        "Gemini answers without chunking",
        "Ask follow-ups in the same session",
        "Cite specific files and lines"
      ],
      "outcome": "Whole-codebase Q and A without RAG plumbing."
    },
    {
      "title": "Free daily coding companion",
      "prompt": "Use Gemini CLI inside the free quota for a day of casual coding.",
      "steps": [
        "Sign in with a personal Google account",
        "Stay under 60 RPM and 1,000/day",
        "No card on file required",
        "Upgrade to API billing only when you hit caps"
      ],
      "outcome": "Capable agent at zero cost for solo work."
    }
  ]$$::jsonb,
  popularity = 78
WHERE slug = 'gemini-cli';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source",
      "price": "Free",
      "highlight": true,
      "features": [
        "Apache 2.0 licensed extension",
        "VS Code and JetBrains support",
        "Bring your own key for any provider",
        "Local models via Ollama, no token bill",
        "No vendor lock-in, swap providers via config"
      ],
      "cta": { "label": "Install extension", "href": "https://continue.dev" }
    },
    {
      "name": "Continue Hub",
      "price": "Per-seat",
      "features": [
        "Hosted team product, free trial available",
        "Shared model configs",
        "Org policies and audit",
        "Usage analytics across the team"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 10 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 7 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Point Continue at a local model",
      "prompt": "Edit ~/.continue/config.json to use Ollama with llama 3 for offline coding.",
      "steps": [
        "Install Ollama and pull a coding model",
        "Add an Ollama provider block to config.json",
        "Reload the extension",
        "Run inline chat with zero token cost"
      ],
      "outcome": "Private, free coding assistant on your laptop."
    },
    {
      "title": "Inline edit in VS Code",
      "prompt": "Highlight a function, Cmd+I, 'add error handling and a JSDoc comment'.",
      "steps": [
        "Select code",
        "Trigger inline edit",
        "Continue diffs the change in place",
        "Accept or reject hunks"
      ],
      "outcome": "Cursor-like UX without leaving VS Code or paying a seat fee."
    }
  ]$$::jsonb,
  popularity = 55
WHERE slug = 'continue-dev';


-- ── Frameworks / SDKs ────────────────────────────────────────────────────────

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source SDK",
      "price": "Free",
      "highlight": true,
      "features": [
        "Apache 2.0 licensed",
        "Pay each provider directly for tokens",
        "30+ provider integrations",
        "First-class Next.js, React, Svelte, Vue support",
        "streamText, generateObject, tool calling, agents"
      ],
      "cta": { "label": "Read the docs", "href": "https://ai-sdk.dev/docs" }
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 9 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 8 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Stream a chat response",
      "prompt": "Add a /api/chat route that streams Claude responses to a useChat hook on the client.",
      "steps": [
        "Install ai and @ai-sdk/anthropic",
        "Wire streamText in a Next.js route handler",
        "Use useChat on the client",
        "Tokens appear word by word in the UI"
      ],
      "outcome": "Production-grade streaming chat in a few dozen lines."
    },
    {
      "title": "Generate structured output",
      "prompt": "Use generateObject with a Zod schema to extract { title, summary, tags } from a long article.",
      "steps": [
        "Define the Zod schema",
        "Call generateObject with the article as the prompt",
        "Get a typed, validated object back",
        "No JSON parsing or schema repair code"
      ],
      "outcome": "Reliable typed extraction across providers."
    },
    {
      "title": "Tool calling agent",
      "prompt": "Build an agent that can call a weather API and a calendar API based on the user message.",
      "steps": [
        "Define two tools with Zod input schemas",
        "Pass them to streamText with stopWhen",
        "The agent decides when to call which tool",
        "Stream the final answer back"
      ],
      "outcome": "Provider-agnostic agent loop with type safety."
    }
  ]$$::jsonb,
  popularity = 85
WHERE slug = 'vercel-ai-sdk';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free credits",
      "price": "$0",
      "features": [
        "Monthly Gateway credits for new accounts",
        "Hobby plan includes a small allowance",
        "Try every provider behind one key",
        "Zero data retention by default"
      ]
    },
    {
      "name": "Pay providers at list",
      "price": "No markup",
      "highlight": true,
      "features": [
        "No surcharge on top of provider rates",
        "Anthropic, OpenAI, Google, Groq, and more",
        "Automatic failover and load balancing included",
        "Per-team budgets and observability included",
        "Consolidated invoice through Vercel"
      ],
      "cta": { "label": "Try Gateway", "href": "https://vercel.com/ai-gateway" }
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "Committed-use discounts",
        "Higher monthly credit allowance",
        "SAML SSO, audit, role-based access",
        "Dedicated support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Swap models without code change",
      "prompt": "Set AI_GATEWAY_API_KEY and change the model string from 'anthropic/claude-sonnet-4-6' to 'openai/gpt-5'.",
      "steps": [
        "Add AI_GATEWAY_API_KEY to your env",
        "Use a provider/model string with the AI SDK",
        "Switch the string to compare models",
        "Watch routing and spend in the dashboard"
      ],
      "outcome": "A B model swap in one line."
    },
    {
      "title": "Automatic failover when a provider is down",
      "prompt": "Configure Gateway to fail over from Anthropic to OpenAI if Anthropic returns 5xx.",
      "steps": [
        "Define a primary and a fallback model",
        "Gateway monitors error rates per provider",
        "Traffic shifts on failure automatically",
        "You see the failover events in the dashboard"
      ],
      "outcome": "Higher availability without bespoke retry code."
    }
  ]$$::jsonb,
  popularity = 62
WHERE slug = 'ai-gateway';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source",
      "price": "Free",
      "features": [
        "MIT licensed framework",
        "langchain, langgraph, provider integrations",
        "Pay providers directly for tokens",
        "Python and TypeScript"
      ]
    },
    {
      "name": "LangSmith Plus",
      "price": "$39",
      "period": "/user/mo",
      "highlight": true,
      "features": [
        "10,000 traces per seat per month",
        "Longer retention",
        "Prompt management",
        "Human review and evals"
      ],
      "cta": { "label": "Sign up for LangSmith", "href": "https://smith.langchain.com" }
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "SSO and self-hosted LangSmith",
        "LangGraph Platform for hosted agents",
        "Dedicated support",
        "Custom retention and residency"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 6 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 9 },
    { "axis": "ecosystem", "score": 10 },
    { "axis": "ease", "score": 4 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Build a RAG pipeline",
      "prompt": "Ingest a folder of PDFs, embed them with OpenAI, store in Chroma, and answer questions with Claude.",
      "steps": [
        "Use document loaders to read the PDFs",
        "Split, embed, and write to a vector store",
        "Wire a RetrievalQA chain to Claude",
        "Trace runs in LangSmith"
      ],
      "outcome": "End-to-end RAG with observability."
    },
    {
      "title": "Stateful agent with LangGraph",
      "prompt": "Model a multi-step agent as a graph with retries, branches, and human-in-the-loop checkpoints.",
      "steps": [
        "Define nodes for each step",
        "Add conditional edges for branching",
        "Persist state to a checkpointer",
        "Resume from checkpoints after failures"
      ],
      "outcome": "Durable agent that survives restarts."
    }
  ]$$::jsonb,
  popularity = 72
WHERE slug = 'langchain';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Open source",
      "price": "Free",
      "features": [
        "MIT licensed framework",
        "Python and TypeScript",
        "Pay providers for tokens",
        "Hundreds of integrations and loaders"
      ]
    },
    {
      "name": "LlamaCloud Starter",
      "price": "$50",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Hosted LlamaParse and managed indexes",
        "Higher page quotas than the free tier",
        "Additional credits",
        "Basic SLA"
      ],
      "cta": { "label": "Try LlamaCloud", "href": "https://cloud.llamaindex.ai" }
    },
    {
      "name": "LlamaCloud Pro",
      "price": "$500",
      "period": "/mo",
      "features": [
        "Production page volumes",
        "Priority support",
        "LlamaExtract and advanced parsing",
        "Higher rate limits"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "SSO and VPC deployment",
        "Dedicated capacity",
        "Custom retention and residency",
        "Procurement and MSA"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 9 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 5 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Parse messy PDFs with LlamaParse",
      "prompt": "Send a folder of scanned PDFs to LlamaParse and get structured Markdown back.",
      "steps": [
        "Upload via the LlamaCloud API or SDK",
        "Choose parsing mode for tables and figures",
        "Receive clean Markdown with structure preserved",
        "Feed it straight into an index"
      ],
      "outcome": "High-fidelity ingestion of complex documents."
    },
    {
      "title": "Stand up a query engine",
      "prompt": "Index a documents/ folder and expose a query engine that answers product questions with citations.",
      "steps": [
        "VectorStoreIndex.from_documents",
        "Configure an embedding and an LLM",
        "Build a query engine with citation mode",
        "Wrap it in a small FastAPI route"
      ],
      "outcome": "Working RAG endpoint in under a hundred lines."
    }
  ]$$::jsonb,
  popularity = 60
WHERE slug = 'llamaindex';


-- ── Productivity / consumer ──────────────────────────────────────────────────

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "GPT-5 with limited daily usage",
        "Basic browsing and image generation",
        "Limited file uploads",
        "Mobile and web apps"
      ]
    },
    {
      "name": "Plus",
      "price": "$20",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Higher caps and priority access",
        "Deep research mode",
        "Sora video generation",
        "Advanced voice"
      ],
      "cta": { "label": "Upgrade to Plus", "href": "https://chatgpt.com" }
    },
    {
      "name": "Pro",
      "price": "$200",
      "period": "/mo",
      "features": [
        "Effectively unlimited frontier-model usage",
        "Pro-only research modes",
        "Highest rate limits",
        "Best for power users"
      ]
    },
    {
      "name": "Business",
      "price": "$25",
      "period": "/user/mo",
      "features": [
        "Workspace and admin controls",
        "No training on your data",
        "SSO on higher tiers",
        "Annual billing"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 8 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 10 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Summarise a long PDF",
      "prompt": "Upload a 60-page lecture handout and ask: 'give me a one-page summary with the five key arguments'.",
      "steps": [
        "Drag the PDF into the prompt",
        "ChatGPT extracts and reasons over it",
        "Returns a structured summary",
        "Ask follow-ups for any section"
      ],
      "outcome": "Hours of reading compressed into a page."
    },
    {
      "title": "Generate practice questions",
      "prompt": "Make 10 multiple-choice questions on chapter 4 of my biology textbook, with answers and short explanations.",
      "steps": [
        "Paste or upload the chapter",
        "Specify question style and difficulty",
        "Receive questions, answers, and rationales",
        "Iterate on tone or coverage"
      ],
      "outcome": "Custom study set in seconds."
    },
    {
      "title": "Write code in the sandbox",
      "prompt": "Plot a histogram of this CSV and show me the top 5 rows.",
      "steps": [
        "Upload the CSV",
        "ChatGPT runs Python in the sandbox",
        "Returns a plot and a small table",
        "Iterate on transformations or charts"
      ],
      "outcome": "Quick data exploration with zero setup."
    }
  ]$$::jsonb,
  popularity = 94
WHERE slug = 'chatgpt';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Unlimited basic searches",
        "Limited Pro searches per day",
        "Standard models",
        "Web and mobile"
      ]
    },
    {
      "name": "Pro",
      "price": "$20",
      "period": "/mo",
      "highlight": true,
      "features": [
        "300+ Pro searches per day",
        "Access to GPT-5, Claude Opus 4, Gemini 2.5",
        "File uploads and Spaces",
        "Annual billing at $200/yr available"
      ],
      "cta": { "label": "Try Pro", "href": "https://www.perplexity.ai/pro" }
    },
    {
      "name": "Max",
      "price": "$200",
      "period": "/mo",
      "features": [
        "Higher daily caps",
        "Early access to new features",
        "Included API credits",
        "Priority support"
      ]
    },
    {
      "name": "Enterprise Pro",
      "price": "$40",
      "period": "/user/mo",
      "features": [
        "SSO and admin controls",
        "Increased file upload limits",
        "No data retention controls",
        "Centralised billing"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 10 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Research a current event",
      "prompt": "What were the main reactions to this week's central bank rate decision? Cite sources.",
      "steps": [
        "Perplexity searches the live web",
        "Synthesises the answer across sources",
        "Cites every claim with a link",
        "Ask follow-ups in the same thread"
      ],
      "outcome": "Sourced answer in seconds, no manual link-chasing."
    },
    {
      "title": "Compare two products with citations",
      "prompt": "Compare the AWS Bedrock and Vercel AI Gateway pricing models, with sources.",
      "steps": [
        "Perplexity picks vendor pages and reviews",
        "Builds a side-by-side comparison",
        "Links every fact back to its origin",
        "Pin the answer to a Space"
      ],
      "outcome": "Decision-ready comparison you can defend."
    }
  ]$$::jsonb,
  popularity = 70
WHERE slug = 'perplexity';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "highlight": true,
      "features": [
        "Up to 100 notebooks",
        "50 sources per notebook",
        "Standard audio overviews",
        "Citations to exact source lines"
      ],
      "cta": { "label": "Open NotebookLM", "href": "https://notebooklm.google.com" }
    },
    {
      "name": "NotebookLM Plus",
      "price": "$20",
      "period": "/mo",
      "features": [
        "5x daily limits",
        "Higher source caps",
        "Longer audio overviews and customization",
        "Bundled with Google AI Pro"
      ]
    },
    {
      "name": "Google AI Ultra",
      "price": "$250",
      "period": "/mo",
      "features": [
        "Highest limits across NotebookLM",
        "Included across the Google AI suite",
        "Priority access",
        "Best for heavy research"
      ]
    },
    {
      "name": "Workspace",
      "price": "Bundled",
      "features": [
        "Included with Workspace Business and Enterprise",
        "Admin controls",
        "Common in universities",
        "No extra per-seat cost"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 9 },
    { "axis": "price", "score": 9 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Study a stack of readings",
      "prompt": "Upload 8 PDFs for the week and ask: 'what do these authors agree and disagree on?'.",
      "steps": [
        "Drag PDFs into a notebook",
        "Ask comparative questions across sources",
        "Click any sentence to jump to the source line",
        "Save notes alongside the answer"
      ],
      "outcome": "Cross-reading synthesis with line-level citations."
    },
    {
      "title": "Audio overview for the commute",
      "prompt": "Generate an Audio Overview from this week's reading list.",
      "steps": [
        "Add sources to the notebook",
        "Click Audio Overview",
        "Two hosts walk through the material",
        "Download or listen in-app"
      ],
      "outcome": "Podcast-style review of your own material."
    }
  ]$$::jsonb,
  popularity = 52
WHERE slug = 'notebooklm';


UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Small starter credit allowance",
        "Watermark removed",
        "Basic models",
        "Public projects"
      ]
    },
    {
      "name": "Premium",
      "price": "$20",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Larger monthly credit pool",
        "Higher-capability models",
        "Private projects",
        "Top-up credits available"
      ],
      "cta": { "label": "Go Premium", "href": "https://v0.app/pricing" }
    },
    {
      "name": "Team",
      "price": "$30",
      "period": "/user/mo",
      "features": [
        "Shared workspaces",
        "Team billing",
        "Higher per-seat credits",
        "Role-based access"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "SSO and audit log",
        "Custom credit allotments",
        "Procurement and MSA",
        "Dedicated support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 7 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 10 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Prompt a landing page",
      "prompt": "Pricing page for a developer tool, three tiers, dark mode, big code snippet on the right.",
      "steps": [
        "Describe the screen in plain English",
        "v0 generates React + shadcn/ui + Tailwind",
        "Iterate with follow-ups",
        "Copy the code into your repo"
      ],
      "outcome": "Polished page in minutes."
    },
    {
      "title": "Tweak then ship",
      "prompt": "Make the hero darker and add a second column with a screenshot.",
      "steps": [
        "Iterate inside v0 with natural language",
        "Preview the change live",
        "Export or one-click deploy to Vercel",
        "Refine in your editor"
      ],
      "outcome": "From prompt to live URL the same day."
    }
  ]$$::jsonb,
  popularity = 46
WHERE slug = 'v0';
