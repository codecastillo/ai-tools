-- ──────────────────────────────────────────────────────────────────────────────
-- Round 8: seven new curated stacks
--
-- Depends on the new tool slugs introduced in migration 012
-- (github-copilot, windsurf, bolt-new, jetbrains-ai, runway, suno,
--  elevenlabs, magnific). Apply 012 before this file.
--
-- Each stack uses a slug subquery so we do not need to know UUIDs at
-- author time. ON CONFLICT (slug) DO NOTHING keeps the migration
-- idempotent.
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO stacks (slug, name, description, tool_ids, is_curated, created_at)
VALUES (
  'vibe-coder',
  'Vibe coder',
  'For folks who want AI to make most of the typing decisions while they stay in flow. A blend of editors and agents tuned for momentum over ceremony.',
  ARRAY(SELECT id FROM tools WHERE slug IN ('cursor', 'claude-code', 'github-copilot', 'windsurf', 'bolt-new')),
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO stacks (slug, name, description, tool_ids, is_curated, created_at)
VALUES (
  'rag-cookbook',
  'RAG cookbook starter',
  'Everything you need to ship a retrieval-augmented feature: ingestion, retrieval, generation, and eval. Pair a framework with an SDK and a gateway and you are off.',
  ARRAY(SELECT id FROM tools WHERE slug IN ('llamaindex', 'langchain', 'claude-api', 'vercel-ai-sdk', 'ai-gateway')),
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO stacks (slug, name, description, tool_ids, is_curated, created_at)
VALUES (
  'agent-playground',
  'Agent playground',
  'Build, test, and observe an agent that uses tools and calls APIs. Includes the Claude Agent SDK, MCP servers, and a routing gateway for model swaps.',
  ARRAY(SELECT id FROM tools WHERE slug IN ('claude-agent-sdk', 'mcp-servers', 'claude-api', 'langchain', 'ai-gateway')),
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO stacks (slug, name, description, tool_ids, is_curated, created_at)
VALUES (
  'solo-founder',
  'Solo founder',
  'A one person stack for shipping fast: prototyping, coding, deploying, and writing. Skews toward tools that compress a team into a single tab.',
  ARRAY(SELECT id FROM tools WHERE slug IN ('cursor', 'claude-code', 'v0', 'vercel-ai-sdk', 'chatgpt')),
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO stacks (slug, name, description, tool_ids, is_curated, created_at)
VALUES (
  'ai-researcher',
  'AI researcher',
  'For reading papers, running benchmarks, and writing notebooks at the frontier. Mixes grounded research surfaces with raw model access for ad hoc experiments.',
  ARRAY(SELECT id FROM tools WHERE slug IN ('notebooklm', 'perplexity', 'claude-api', 'langchain', 'claude-code')),
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO stacks (slug, name, description, tool_ids, is_curated, created_at)
VALUES (
  'mobile-dev',
  'Mobile developer',
  'AI tooling for shipping a mobile app: a cross-platform editor, a code agent, and a design generator. Covers the loop from screen mockup to merged PR.',
  ARRAY(SELECT id FROM tools WHERE slug IN ('cursor', 'github-copilot', 'claude-code', 'v0', 'jetbrains-ai')),
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO stacks (slug, name, description, tool_ids, is_curated, created_at)
VALUES (
  'multimedia-creator',
  'Multimedia creator',
  'For producers shipping content across video, music, voice, and image. One pick per modality so you can move a story end to end without leaving the stack.',
  ARRAY(SELECT id FROM tools WHERE slug IN ('runway', 'suno', 'elevenlabs', 'magnific', 'chatgpt')),
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
