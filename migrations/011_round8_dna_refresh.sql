-- Round 8 refresh: tighten typical_user copy across all 18 tools. The Tool
-- DNA card uses this line as the single "who is this for" hint, so the
-- wording should feel specific and slightly opinionated rather than generic.

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Senior dev who lives in tmux and wants a coding agent in the loop without leaving the terminal."$$::jsonb)
  WHERE slug = 'claude-code';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Engineer wiring up an LLM feature and wants the raw API with caching and batching."$$::jsonb)
  WHERE slug = 'claude-api';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Backend dev building an agent that plans, calls tools, and verifies its own work."$$::jsonb)
  WHERE slug = 'claude-agent-sdk';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Claude Code power user collecting reusable skills and process scaffolding."$$::jsonb)
  WHERE slug = 'superpowers';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Agent builder who wants standard tool servers (filesystem, GitHub, Slack) without bespoke glue."$$::jsonb)
  WHERE slug = 'mcp-servers';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Full-time dev who wants AI baked into the editor and reads the whole repo for context."$$::jsonb)
  WHERE slug = 'cursor';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Open-source enthusiast who wants each AI edit to land as its own git commit for review."$$::jsonb)
  WHERE slug = 'aider';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Dev who lives in the OpenAI ecosystem and wants a first-party agent CLI."$$::jsonb)
  WHERE slug = 'codex-cli';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Researcher pulling entire codebases into Gemini's million-token context window."$$::jsonb)
  WHERE slug = 'gemini-cli';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Self-hoster who wants AI in the IDE while controlling which model runs where."$$::jsonb)
  WHERE slug = 'continue-dev';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Front-end dev building a streaming AI feature on Vercel without writing the plumbing."$$::jsonb)
  WHERE slug = 'vercel-ai-sdk';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Team lead routing every LLM call through one key with budgets and provider failover."$$::jsonb)
  WHERE slug = 'ai-gateway';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Backend engineer composing RAG and agent pipelines from named, observable building blocks."$$::jsonb)
  WHERE slug = 'langchain';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Data engineer building a production RAG over a real corpus, not a toy demo."$$::jsonb)
  WHERE slug = 'llamaindex';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Student or knowledge worker who treats ChatGPT as their default search-and-think partner."$$::jsonb)
  WHERE slug = 'chatgpt';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Researcher who wants cited answers and refuses to dig through ten Google tabs."$$::jsonb)
  WHERE slug = 'perplexity';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Student loading PDFs and lecture notes into a single corpus to query and quiz against."$$::jsonb)
  WHERE slug = 'notebooklm';

UPDATE tools SET tool_dna = jsonb_set(tool_dna, '{typical_user}', $$"Designer or PM who wants a working UI prototype before opening a code editor."$$::jsonb)
  WHERE slug = 'v0';
