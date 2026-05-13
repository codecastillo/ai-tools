-- Curated tools + stacks for launch.
-- Idempotent via ON CONFLICT DO NOTHING on the unique slug.

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('claude-code', 'Claude Code', 'https://claude.com/code',
 'Anthropic''s agentic CLI for software engineering.',
 'Claude Code runs Anthropic''s most capable models in your terminal, with access to your repo, your shell, and your editor. It is the fastest way to bring a top-tier AI model into a real codebase.',
 'claude',
 ARRAY['cli','agent','anthropic','flagship'],
 E':::os mac\n```bash\nnpm install -g @anthropic-ai/claude-code\n```\n:::\n:::os linux\n```bash\nnpm install -g @anthropic-ai/claude-code\n```\n:::\n:::os windows\n```powershell\nnpm install -g @anthropic-ai/claude-code\n```\n:::',
 E'## First session\n\n```bash\ncd ~/your-project\nclaude\n```\n\n## Tips\n\n- Use `/resume` to pick up where you left off.\n- Press `Esc` to interrupt a long action.\n- Drop in files by dragging them into the prompt.\n- Use `!` to run a shell command without leaving the session.',
 E'| Command | What it does |\n|---|---|\n| `/help` | List commands |\n| `/clear` | Reset the session |\n| `/resume` | Reopen the last session |\n| `!cmd` | Run a shell command |',
 'paid','medium','10 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('claude-agent-sdk', 'Claude Agent SDK', 'https://docs.anthropic.com/en/api/agent-sdk',
 'Build production agents with the same SDK that powers Claude Code.',
 'The Agent SDK exposes the agent loop, tool registration, and context engineering primitives Anthropic uses internally. Available in TypeScript and Python.',
 'claude',
 ARRAY['sdk','agent','ts','python'],
 E':::os mac\n```bash\nnpm install @anthropic-ai/agent-sdk\n# or:\npip install anthropic-agent\n```\n:::',
 E'## Define a tool\n\n```ts\nimport { defineTool } from "@anthropic-ai/agent-sdk";\n\nconst readFile = defineTool({\n  name: "read_file",\n  description: "Read a file from disk.",\n  inputSchema: { type: "object", properties: { path: { type: "string" } } },\n  handler: async ({ path }) => fs.readFileSync(path, "utf8"),\n});\n```\n\n## Run a loop\n\n```ts\nfor await (const event of agent.run({ tools: [readFile], prompt })) {\n  // stream events to your UI\n}\n```',
 NULL,
 'free','medium','30 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('mcp-servers', 'MCP Servers', 'https://modelcontextprotocol.io',
 'Open protocol that lets AI assistants talk to your tools.',
 'Model Context Protocol is the open standard for letting any AI client (Claude Desktop, Cursor, Zed, custom agents) call your APIs, read your databases, and use your services. The ecosystem has hundreds of community servers.',
 'claude',
 ARRAY['protocol','open','ecosystem'],
 E':::os mac\n```bash\nnpx -y @modelcontextprotocol/create-server my-server\n```\n:::',
 E'Servers expose **tools**, **resources**, and **prompts**. Clients (Claude Desktop, etc.) discover them over stdio or HTTP and forward calls from the model.\n\nA minimal server in TypeScript:\n\n```ts\nimport { McpServer } from "@modelcontextprotocol/sdk";\nconst server = new McpServer({ name: "weather" });\nserver.tool("getForecast", { city: "string" }, async ({ city }) => ({\n  content: [{ type: "text", text: `Sunny in ${city}` }],\n}));\nserver.listen();\n```',
 NULL,
 'oss','medium','20 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('claude-api', 'Claude API', 'https://docs.anthropic.com/en/api',
 'Direct API access to Claude Opus, Sonnet, and Haiku.',
 'The raw HTTP API and official SDKs (TS, Python). Use it when you want full control: streaming, tool use, prompt caching, extended thinking, structured outputs.',
 'claude',
 ARRAY['api','sdk','llm'],
 E':::os mac\n```bash\nnpm install @anthropic-ai/sdk\n# or:\npip install anthropic\n```\n:::',
 E'```ts\nimport Anthropic from "@anthropic-ai/sdk";\nconst client = new Anthropic();\nconst msg = await client.messages.create({\n  model: "claude-sonnet-4-6",\n  max_tokens: 1024,\n  messages: [{ role: "user", content: "Hello" }],\n});\n```\n\n**Always turn on prompt caching** for any system prompt > 1024 tokens — it''s a 90% cost reduction on hits.',
 E'| Feature | Use it for |\n|---|---|\n| `cache_control: { type: "ephemeral" }` | Reuse a long system prompt cheaply |\n| `tools: [...]` | Let the model call your functions |\n| `stream: true` | Token-by-token output |',
 'paid','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('superpowers', 'Superpowers', 'https://github.com/obra/superpowers',
 'Skill plugins that level up Claude Code with TDD, debugging, brainstorming, and more.',
 'Superpowers is a plugin pack for Claude Code that adds disciplined workflows: test-driven development, systematic debugging, structured planning, parallel agent dispatch, and brainstorming with a visual companion.',
 'claude',
 ARRAY['plugin','skills','workflow'],
 E':::os mac\n```bash\nclaude plugin install obra/superpowers\n```\n:::',
 E'Once installed, skills are auto-discovered. Try:\n\n- Start a new feature → invoke `superpowers:brainstorming`.\n- Stuck on a bug → invoke `superpowers:systematic-debugging`.\n- Need to ship → invoke `superpowers:test-driven-development`.\n\nSkills tell Claude **how** to approach the task — they are process scaffolding, not features.',
 NULL,
 'oss','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('cursor', 'Cursor', 'https://cursor.com',
 'The AI-first code editor.',
 'A VS Code fork rebuilt around AI: in-editor chat, agent mode, fast tab completion, codebase-aware refactors. The most popular AI-native IDE.',
 'clis',
 ARRAY['editor','ide','agent'],
 E':::os mac\n```bash\nbrew install --cask cursor\n```\n:::\n:::os linux\n```bash\n# Download AppImage from cursor.com\n```\n:::\n:::os windows\n```powershell\nwinget install Cursor\n```\n:::',
 E'## Daily-driver tips\n\n- `⌘K` — inline edit (rewrite the selection).\n- `⌘L` — chat with the codebase as context.\n- `⌘I` — composer (multi-file agent edits).\n- Set per-folder `.cursorrules` to teach Cursor your conventions.\n\n## Models\n\nThe default model auto-routes between providers. Switch to Claude or GPT manually if you have a preference.',
 NULL,
 'freemium','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('aider', 'Aider', 'https://aider.chat',
 'AI pair programming in your terminal.',
 'Aider edits code in your local git repo. It maps the repo, picks the relevant files, sends them to the model, and commits the diff for each change.',
 'clis',
 ARRAY['cli','pair','git','oss'],
 E':::os mac\n```bash\npython -m pip install aider-install\naider-install\n```\n:::',
 E'```bash\ncd ~/your-repo\naider --model sonnet\n```\n\nThen type what you want. Aider commits each change as a separate git commit.\n\n- `/add file.py` — add a file to the context.\n- `/drop file.py` — remove a file.\n- `/diff` — show the last commit.',
 NULL,
 'oss','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('codex-cli', 'Codex CLI', 'https://github.com/openai/codex',
 'OpenAI''s open-source coding agent for the terminal.',
 'Codex is OpenAI''s answer to Claude Code: a terminal-based coding agent that reads your repo, writes code, runs commands, and iterates.',
 'clis',
 ARRAY['cli','agent','openai','oss'],
 E':::os mac\n```bash\nnpm install -g @openai/codex\n```\n:::',
 E'```bash\ncodex\n```\n\nCodex is fast at small, scoped tasks. For deep multi-file refactors most teams still reach for Claude Code or Cursor''s composer.',
 NULL,
 'free','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('gemini-cli', 'Gemini CLI', 'https://github.com/google-gemini/gemini-cli',
 'Google''s open-source coding agent for the terminal.',
 'Gemini CLI brings Google''s Gemini 2.x models into a terminal agent. Long context windows make it strong for whole-repo questions.',
 'clis',
 ARRAY['cli','agent','google','oss'],
 E':::os mac\n```bash\nnpm install -g @google/gemini-cli\n```\n:::',
 E'```bash\ngemini\n```\n\nGemini''s 1M+ token context is its superpower — drop in entire codebases without worrying about chunking.',
 NULL,
 'freemium','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('continue-dev', 'Continue', 'https://continue.dev',
 'Open-source AI code assistant for VS Code and JetBrains.',
 'Continue is the open-source alternative to Cursor: inline chat, edit, autocomplete, all running against any model you point it at (Anthropic, OpenAI, local).',
 'clis',
 ARRAY['extension','vscode','jetbrains','oss'],
 E'Install from the VS Code marketplace or JetBrains marketplace — search "Continue".',
 E'Configure your model provider in `~/.continue/config.json`. Continue keeps you out of vendor lock-in: switch from Claude to a local model with a config change.',
 NULL,
 'oss','easy','10 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('vercel-ai-sdk', 'Vercel AI SDK', 'https://sdk.vercel.ai',
 'TypeScript toolkit for AI apps. Any provider, one API.',
 'The Vercel AI SDK gives you a single `streamText` / `generateObject` API that works against Anthropic, OpenAI, Google, Mistral, and 30+ other providers. Pairs perfectly with Next.js.',
 'frameworks',
 ARRAY['ts','sdk','streaming','tools'],
 E':::os mac\n```bash\nnpm install ai @ai-sdk/anthropic\n```\n:::',
 E'```ts\nimport { streamText } from "ai";\nimport { anthropic } from "@ai-sdk/anthropic";\n\nconst result = await streamText({\n  model: anthropic("claude-sonnet-4-6"),\n  prompt: "Write a haiku about TypeScript.",\n});\nfor await (const chunk of result.textStream) process.stdout.write(chunk);\n```',
 NULL,
 'free','easy','10 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('ai-gateway', 'Vercel AI Gateway', 'https://vercel.com/ai-gateway',
 'Unified API for every AI provider, with failover and observability.',
 'Vercel AI Gateway gives you a single endpoint and key that routes to any model — Anthropic, OpenAI, Google, Groq, and dozens more — with automatic failover, caching, and per-team budgets. Zero data retention by default.',
 'frameworks',
 ARRAY['gateway','observability','vercel'],
 E'Use a `"provider/model"` string with the Vercel AI SDK and it routes through the Gateway automatically when `AI_GATEWAY_API_KEY` is set.',
 E'```ts\nimport { streamText } from "ai";\n\nawait streamText({\n  model: "anthropic/claude-sonnet-4-6",  // routed via Gateway\n  prompt: "..."\n});\n```\n\nFalls back to the next provider if the first is down. Track per-model spend in the Vercel dashboard.',
 NULL,
 'freemium','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('langchain', 'LangChain', 'https://langchain.com',
 'Framework for building applications with LLMs.',
 'LangChain is the heavyweight framework for chains, agents, retrieval, and memory. Strong for Python; available in TypeScript.',
 'frameworks',
 ARRAY['framework','python','ts','rag'],
 E':::os mac\n```bash\npip install langchain langchain-anthropic\n```\n:::',
 E'LangChain shines for retrieval-augmented generation (RAG) and complex multi-step agents. For simple "stream a response" use cases, lighter tools like the Vercel AI SDK are faster to ship.',
 NULL,
 'oss','medium','1 hr','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('llamaindex', 'LlamaIndex', 'https://llamaindex.ai',
 'Data framework for LLM apps — best in class for RAG.',
 'LlamaIndex specializes in connecting LLMs to your data: ingestion, indexing, query engines, evaluation. Often paired with vector stores.',
 'frameworks',
 ARRAY['framework','rag','python','ts'],
 E':::os mac\n```bash\npip install llama-index\n```\n:::',
 E'Use LlamaIndex when "the documents" are the hard part of your app. It is more opinionated than LangChain about ingestion and retrieval.',
 NULL,
 'oss','medium','1 hr','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('chatgpt', 'ChatGPT', 'https://chatgpt.com',
 'OpenAI''s flagship chat assistant.',
 'The most widely-used AI assistant. Strong general reasoning, integrated web browsing, file uploads, image generation, custom GPTs, and a code-interpreter sandbox.',
 'productivity',
 ARRAY['chat','assistant','openai'],
 E'Sign in at https://chatgpt.com. iOS/Android apps available.',
 E'**For students**:\n\n- Free tier: GPT-5 with limited usage and access to most features.\n- Plus ($20/mo): higher caps, priority access, deep research, Sora.\n- Always cite sources separately — ChatGPT can hallucinate citations.',
 NULL,
 'freemium','easy','1 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('perplexity', 'Perplexity', 'https://perplexity.ai',
 'Answer engine with real-time sources.',
 'Perplexity combines search and chat: every answer cites the pages it pulled from. Great for research and current events.',
 'productivity',
 ARRAY['search','research','citations'],
 E'Sign in at https://perplexity.ai. iOS/Android apps available.',
 E'Use **Focus** modes to scope search to academic papers, social media, or YouTube. Pin sources and ask follow-ups — Perplexity keeps the context.',
 NULL,
 'freemium','easy','1 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('notebooklm', 'NotebookLM', 'https://notebooklm.google.com',
 'Google''s research assistant — ground answers in your own sources.',
 'Upload your PDFs, slides, transcripts, links. NotebookLM cites every answer back to the exact line it came from, and can generate audio overviews from your sources.',
 'productivity',
 ARRAY['research','study','google'],
 E'Sign in with a Google account at https://notebooklm.google.com.',
 E'**For students**:\n\n- Drop your readings into a notebook; ask comparative questions across them.\n- The Audio Overview feature turns sources into a podcast you can listen to on the bus.\n- Click any sentence in an answer to jump to the exact source line.',
 NULL,
 'free','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing, difficulty, time_to_value, status, is_curated, last_verified, approved_at) VALUES
('v0', 'v0', 'https://v0.app',
 'Generate React + Tailwind UIs from a prompt.',
 'v0 is Vercel''s UI generator: describe a screen, get a polished React + shadcn/ui + Tailwind component you can paste into your codebase.',
 'productivity',
 ARRAY['ui','react','tailwind','vercel'],
 E'Sign in at https://v0.app.',
 E'Best for spinning up a credible-looking page in minutes. Iterate with follow-up prompts ("make the hero darker", "add a second column"). Copy the code and refine in your editor.',
 NULL,
 'freemium','easy','5 min','approved',TRUE,NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────────────────
-- Curated stacks (editorial)
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO stacks (slug, name, description, tool_ids, is_curated)
SELECT 'claude-native', 'The Claude-native stack',
       'Everything you need to build with Anthropic''s tooling, end to end.',
       ARRAY(SELECT id FROM tools WHERE slug IN ('claude-code','claude-agent-sdk','claude-api','mcp-servers','superpowers') ORDER BY array_position(ARRAY['claude-code','claude-agent-sdk','claude-api','mcp-servers','superpowers']::text[], slug)),
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM stacks WHERE slug = 'claude-native');

INSERT INTO stacks (slug, name, description, tool_ids, is_curated)
SELECT 'vibe-coding', 'Vibe-coding starter',
       'Pick an AI coding assistant that matches your workflow.',
       ARRAY(SELECT id FROM tools WHERE slug IN ('cursor','aider','codex-cli','continue-dev') ORDER BY array_position(ARRAY['cursor','aider','codex-cli','continue-dev']::text[], slug)),
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM stacks WHERE slug = 'vibe-coding');

INSERT INTO stacks (slug, name, description, tool_ids, is_curated)
SELECT 'student-productivity', 'AI productivity for students',
       'The non-coding AI tools that earn their keep in school.',
       ARRAY(SELECT id FROM tools WHERE slug IN ('chatgpt','notebooklm','perplexity','v0') ORDER BY array_position(ARRAY['chatgpt','notebooklm','perplexity','v0']::text[], slug)),
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM stacks WHERE slug = 'student-productivity');
