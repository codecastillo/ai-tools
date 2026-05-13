-- Migration 003: rewrite install_md for curated tools to use the new
-- `:::pkg <manager>` directive instead of the legacy `:::os <os>` syntax.
-- Tools with a single universal command collapse to one block (no tabs).
-- Tools that genuinely have multiple package-manager options keep multiple
-- blocks. Web-only tools (ChatGPT, NotebookLM, Perplexity, v0, AI Gateway,
-- Continue) get a single-line markdown paragraph instead of a fenced block.

-- ── Anthropic / Claude family ────────────────────────────────────────────────

UPDATE tools SET install_md = E':::pkg npm\n```bash\nnpm install -g @anthropic-ai/claude-code\n```\n:::'
WHERE slug = 'claude-code';

UPDATE tools SET install_md = E':::pkg npm\n```bash\nnpm install @anthropic-ai/agent-sdk\n```\n:::\n\n:::pkg pip\n```bash\npip install anthropic-agent\n```\n:::'
WHERE slug = 'claude-agent-sdk';

UPDATE tools SET install_md = E':::pkg cli\n```bash\nnpx -y @modelcontextprotocol/create-server my-server\n```\n:::'
WHERE slug = 'mcp-servers';

UPDATE tools SET install_md = E':::pkg npm\n```bash\nnpm install @anthropic-ai/sdk\n```\n:::\n\n:::pkg pip\n```bash\npip install anthropic\n```\n:::'
WHERE slug = 'claude-api';

UPDATE tools SET install_md = E':::pkg cli\n```bash\nclaude plugin install obra/superpowers\n```\n:::'
WHERE slug = 'superpowers';

-- ── Editors / coding CLIs ────────────────────────────────────────────────────

UPDATE tools SET install_md = E':::pkg brew\n```bash\nbrew install --cask cursor\n```\n:::\n\n:::pkg winget\n```powershell\nwinget install Cursor\n```\n:::'
WHERE slug = 'cursor';

UPDATE tools SET install_md = E':::pkg pip\n```bash\npython -m pip install aider-install\naider-install\n```\n:::'
WHERE slug = 'aider';

UPDATE tools SET install_md = E':::pkg npm\n```bash\nnpm install -g @openai/codex\n```\n:::'
WHERE slug = 'codex-cli';

UPDATE tools SET install_md = E':::pkg npm\n```bash\nnpm install -g @google/gemini-cli\n```\n:::'
WHERE slug = 'gemini-cli';

UPDATE tools SET install_md = E'Install from the [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=Continue.continue) or JetBrains marketplace by searching for **Continue**.'
WHERE slug = 'continue-dev';

-- ── Frameworks / SDKs ────────────────────────────────────────────────────────

UPDATE tools SET install_md = E':::pkg npm\n```bash\nnpm install ai @ai-sdk/anthropic\n```\n:::'
WHERE slug = 'vercel-ai-sdk';

UPDATE tools SET install_md = E'Use a `"provider/model"` string with the Vercel AI SDK and it routes through the Gateway automatically when `AI_GATEWAY_API_KEY` is set.'
WHERE slug = 'ai-gateway';

UPDATE tools SET install_md = E':::pkg pip\n```bash\npip install langchain langchain-anthropic\n```\n:::\n\n:::pkg npm\n```bash\nnpm install @langchain/anthropic\n```\n:::'
WHERE slug = 'langchain';

UPDATE tools SET install_md = E':::pkg pip\n```bash\npip install llama-index\n```\n:::\n\n:::pkg npm\n```bash\nnpm install llamaindex\n```\n:::'
WHERE slug = 'llamaindex';

-- ── Web-only / sign-in tools ─────────────────────────────────────────────────

UPDATE tools SET install_md = E'Sign in at [chatgpt.com](https://chatgpt.com). iOS and Android apps available.'
WHERE slug = 'chatgpt';

UPDATE tools SET install_md = E'Sign in at [perplexity.ai](https://perplexity.ai). iOS and Android apps available.'
WHERE slug = 'perplexity';

UPDATE tools SET install_md = E'Sign in with a Google account at [notebooklm.google.com](https://notebooklm.google.com).'
WHERE slug = 'notebooklm';

UPDATE tools SET install_md = E'Sign in at [v0.app](https://v0.app).'
WHERE slug = 'v0';
