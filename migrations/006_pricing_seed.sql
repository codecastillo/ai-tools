-- Migration 006: seed pricing_md and resources_md for every curated tool.
-- Pricing reflects publicly listed rates as of early-to-mid 2026. Always
-- check the vendor's own pricing page for current numbers before relying on
-- these values for budgeting.
--
-- Uses dollar-quoted strings so apostrophes inside markdown stay readable.

-- ── Claude family ────────────────────────────────────────────────────────────

UPDATE tools SET pricing_md = $$
## Plans

Claude Code is bundled with the consumer Claude plans and is also available pay-as-you-go through the Anthropic API.

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Limited daily messages on the default Sonnet tier, basic Claude Code usage |
| Pro | $20/mo | Higher usage caps, access to Opus and extended thinking, regular Claude Code sessions |
| Max (5x) | $100/mo | 5x the Pro usage caps, priority access during peak hours |
| Max (20x) | $200/mo | 20x the Pro usage caps, longest context windows, best for heavy daily use |
| API | Pay-as-you-go | Bring your own Anthropic API key, billed per token, no monthly commitment |

## API token pricing (per million tokens, as of early 2026)

| Model | Input | Output |
| --- | --- | --- |
| Claude Opus 4 | $15 | $75 |
| Claude Sonnet 4 | $3 | $15 |
| Claude Haiku 4 | $0.80 | $4 |

Prompt caching cuts input costs by up to 90% on cache hits. Batch processing through the Messages Batches API discounts both input and output by 50%. Check the [official pricing page](https://www.anthropic.com/pricing) for current rates and any newer model tiers.
$$, resources_md = $$
- [Official docs](https://docs.claude.com/en/docs/claude-code)
- [Anthropic pricing](https://www.anthropic.com/pricing)
- [GitHub repo](https://github.com/anthropics/claude-code)
- [Quickstart](https://docs.claude.com/en/docs/claude-code/quickstart)
- [Discord community](https://www.anthropic.com/discord)
- [Changelog](https://docs.claude.com/en/release-notes/claude-code)
$$ WHERE slug = 'claude-code';

-- Fix Claude Code pricing enum: there is a real free tier via the Claude consumer plan.
UPDATE tools SET pricing = 'freemium' WHERE slug = 'claude-code' AND pricing = 'paid';


UPDATE tools SET pricing_md = $$
## Free SDK, pay for tokens

The Claude Agent SDK is free software. You install it from npm or PyPI and call into the Anthropic API (or any compatible provider) with your own key. Anthropic bills you for tokens used by the agent loop.

Typical agent runs consume more tokens than chat completions because the loop iterates: read tool result, plan, call tool, repeat. Budget accordingly and turn on prompt caching for long system prompts.

### Token rates (Anthropic, as of early 2026)

| Model | Input per 1M | Output per 1M |
| --- | --- | --- |
| Opus 4 | $15 | $75 |
| Sonnet 4 | $3 | $15 |
| Haiku 4 | $0.80 | $4 |

The SDK itself imposes no surcharge. Check the [Anthropic pricing page](https://www.anthropic.com/pricing) for current rates.
$$, resources_md = $$
- [Agent SDK docs](https://docs.claude.com/en/api/agent-sdk)
- [TypeScript SDK on GitHub](https://github.com/anthropics/anthropic-sdk-typescript)
- [Python SDK on GitHub](https://github.com/anthropics/anthropic-sdk-python)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Anthropic pricing](https://www.anthropic.com/pricing)
$$ WHERE slug = 'claude-agent-sdk';


UPDATE tools SET pricing_md = $$
## Free and open standard

Model Context Protocol is an open specification. The protocol, the official SDKs, and the reference servers are MIT licensed and free to use.

You may incur costs from the services a server connects to (a Postgres host, a paid API a server wraps, hosting for a remote server), but the protocol itself is free. The growing ecosystem of community servers is also overwhelmingly open-source.

Anthropic, the original author, accepts no fee for using MCP. The spec is governed in the open at [modelcontextprotocol.io](https://modelcontextprotocol.io).
$$, resources_md = $$
- [Official site](https://modelcontextprotocol.io)
- [Specification](https://spec.modelcontextprotocol.io)
- [GitHub organization](https://github.com/modelcontextprotocol)
- [Server registry](https://github.com/modelcontextprotocol/servers)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
$$ WHERE slug = 'mcp-servers';


UPDATE tools SET pricing_md = $$
## Pay-as-you-go API

The Claude API is billed per token. No monthly minimum, no seat licensing. You pay only for what you send and receive.

### Per-million-token rates (as of early 2026)

| Model | Input | Output | Notes |
| --- | --- | --- | --- |
| Claude Opus 4 | $15 | $75 | Best reasoning, agentic work |
| Claude Sonnet 4 | $3 | $15 | Default workhorse, fast and capable |
| Claude Haiku 4 | $0.80 | $4 | Cheapest, good for classification and short tasks |

### Discounts

- Prompt caching: up to 90% off cached input tokens after the first call.
- Message Batches: 50% off both input and output when results can return within 24 hours.
- Volume commitments are available for enterprise contracts.

Free trial credit is granted when you sign up. After that, top up your balance or attach a card. Check the [pricing page](https://www.anthropic.com/pricing) for any newer model SKUs.
$$, resources_md = $$
- [API docs](https://docs.claude.com/en/api)
- [Pricing](https://www.anthropic.com/pricing)
- [Anthropic Console](https://console.anthropic.com)
- [TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- [Python SDK](https://github.com/anthropics/anthropic-sdk-python)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
$$ WHERE slug = 'claude-api';


UPDATE tools SET pricing_md = $$
## Free and open-source

Superpowers is released as a plugin pack under the MIT license. There are no paid tiers and no hosted product.

If you find it useful, the author Jesse Vincent accepts sponsorship through [GitHub Sponsors](https://github.com/sponsors/obra). The plugins themselves run inside your existing Claude Code session, so the only ongoing cost is whatever Claude plan or API usage you already pay for.
$$, resources_md = $$
- [GitHub repo](https://github.com/obra/superpowers)
- [Skills index](https://github.com/obra/superpowers/tree/main/skills)
- [Claude Code plugins docs](https://docs.claude.com/en/docs/claude-code/plugins)
- [Sponsor the author](https://github.com/sponsors/obra)
$$ WHERE slug = 'superpowers';


-- ── Editors / coding CLIs ────────────────────────────────────────────────────

UPDATE tools SET pricing_md = $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Hobby | $0 | 2,000 completions, 50 slow premium requests, basic tab model |
| Pro | $20/mo | Unlimited completions, 500 fast premium requests, agent and composer with GPT-5 and Claude |
| Pro+ | $60/mo | Higher fast-request quota, priority routing |
| Ultra | $200/mo | 20x the Pro quota of fast premium requests, full agent throughput |
| Business | $40/user/mo | Everything in Pro plus org policies, SSO, audit log, central billing, privacy mode by default |
| Enterprise | Custom | SAML SSO, procurement, dedicated support, custom data residency |

### What counts as a "premium request"

A premium request is one call to a frontier model (Claude Opus, GPT-5, etc.) in agent or composer mode. Tab completions are unlimited on all paid tiers. Slow premium requests on the free tier are heavily rate-limited during peak hours.

Education discounts are available for verified students. Check [cursor.com/pricing](https://cursor.com/pricing) for current rates and any new tier names.
$$, resources_md = $$
- [Cursor website](https://cursor.com)
- [Pricing](https://cursor.com/pricing)
- [Docs](https://docs.cursor.com)
- [Forum](https://forum.cursor.com)
- [Changelog](https://cursor.com/changelog)
- [Student discount](https://cursor.com/students)
$$ WHERE slug = 'cursor';


UPDATE tools SET pricing_md = $$
## Free and open-source

Aider is released under the Apache 2.0 license. The CLI itself is free. You pay only for the model API calls it makes on your behalf.

### Model costs

Aider works with any major provider. Typical setups:

- Anthropic Claude Sonnet 4 (recommended default): $3 input, $15 output per million tokens.
- OpenAI GPT-5: similar order of magnitude, check current OpenAI pricing.
- Local models via Ollama or LM Studio: free after hardware.

A typical Aider session on a medium repo costs cents to a few dollars per hour of active coding, depending on how much context the repo map sends. Use `--cache-prompts` to slash Anthropic costs on repeated context.

The author Paul Gauthier accepts sponsorship through [GitHub Sponsors](https://github.com/sponsors/paul-gauthier).
$$, resources_md = $$
- [Official site](https://aider.chat)
- [GitHub repo](https://github.com/Aider-AI/aider)
- [Docs](https://aider.chat/docs/)
- [Discord community](https://discord.gg/Tv2uQnR88V)
- [Leaderboards](https://aider.chat/docs/leaderboards/)
- [Sponsor the author](https://github.com/sponsors/paul-gauthier)
$$ WHERE slug = 'aider';


UPDATE tools SET pricing_md = $$
## Free and open-source

Codex CLI is released by OpenAI under the Apache 2.0 license. The CLI is free; you pay for the model calls.

### How you pay for models

Two options as of early 2026:

- Sign in with a ChatGPT Plus, Pro, or Business account and Codex uses your existing plan quota. Plus is $20/mo, Pro is $200/mo, Business is $25/user/mo with annual billing.
- Bring an OpenAI API key and pay per token at the standard [OpenAI API rates](https://openai.com/api/pricing/). GPT-5 and the o-series reasoning models are the typical defaults.

There is no per-seat fee for Codex itself. Local execution costs you nothing beyond whatever the model calls add up to. Check OpenAI's pricing page for current API rates.
$$, resources_md = $$
- [GitHub repo](https://github.com/openai/codex)
- [Codex documentation](https://developers.openai.com/codex/cli)
- [OpenAI API pricing](https://openai.com/api/pricing/)
- [ChatGPT pricing](https://openai.com/chatgpt/pricing/)
- [Releases](https://github.com/openai/codex/releases)
$$ WHERE slug = 'codex-cli';


UPDATE tools SET pricing_md = $$
## Generous free tier, pay for scale

Gemini CLI is released under the Apache 2.0 license. The CLI is free; model access is metered separately.

### Free tier

Sign in with a personal Google account and you get a free quota that, as of early 2026, includes 60 model requests per minute and 1,000 per day against Gemini 2.5 Pro. That is the most generous free tier of any major coding CLI.

### Paid options

- Bring a [Google AI Studio](https://aistudio.google.com) key and pay per token at standard Gemini API rates (Gemini 2.5 Pro: $1.25 input / $10 output per million tokens at the 200k context tier as of early 2026, higher beyond).
- Use a Vertex AI service account on Google Cloud for enterprise billing, SSO, and data residency.

Check the [Gemini API pricing page](https://ai.google.dev/pricing) for current rates and any newer model SKUs.
$$, resources_md = $$
- [GitHub repo](https://github.com/google-gemini/gemini-cli)
- [Gemini API pricing](https://ai.google.dev/pricing)
- [Google AI Studio](https://aistudio.google.com)
- [Releases](https://github.com/google-gemini/gemini-cli/releases)
- [Discussions](https://github.com/google-gemini/gemini-cli/discussions)
$$ WHERE slug = 'gemini-cli';


UPDATE tools SET pricing_md = $$
## Free and open-source extension

Continue is released under the Apache 2.0 license. The VS Code and JetBrains extensions are free. You pay only for the model API calls you make.

### Bring your own key (recommended for individuals)

Point Continue at any provider in `~/.continue/config.json`: Anthropic, OpenAI, Google, Mistral, Groq, Ollama for local models, etc. You pay each provider directly at their listed rates. A typical solo developer spends a few dollars to a few tens of dollars a month.

### Continue Hub (Teams)

Continue also offers a hosted team product, Continue Hub, which adds shared model configs, org policies, and usage analytics. Pricing is published at [hub.continue.dev](https://hub.continue.dev) and starts at a per-seat monthly fee with a free trial. Check the page for current rates.
$$, resources_md = $$
- [Official site](https://continue.dev)
- [GitHub repo](https://github.com/continuedev/continue)
- [Docs](https://docs.continue.dev)
- [Continue Hub](https://hub.continue.dev)
- [Discord community](https://discord.gg/NWtdYexhMs)
- [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=Continue.continue)
$$ WHERE slug = 'continue-dev';


-- ── Frameworks / SDKs ────────────────────────────────────────────────────────

UPDATE tools SET pricing_md = $$
## Free and open-source

The Vercel AI SDK is released under the Apache 2.0 license. The SDK itself is free; you pay each provider for the tokens you send through it.

### What the SDK costs

Nothing. Install from npm, ship with your app, no per-call fee.

### What the models cost

Whatever the underlying provider charges. The SDK is provider-agnostic, so you can swap models without changing code. Typical providers and per-million-token rates as of early 2026:

| Provider / model | Input | Output |
| --- | --- | --- |
| Anthropic Claude Sonnet 4 | $3 | $15 |
| OpenAI GPT-5 | check [openai.com/api/pricing](https://openai.com/api/pricing/) | same |
| Google Gemini 2.5 Pro | $1.25 | $10 |

Route through the Vercel AI Gateway to get a single bill and automatic failover (separate optional product, see the AI Gateway tool).
$$, resources_md = $$
- [Official site](https://ai-sdk.dev)
- [GitHub repo](https://github.com/vercel/ai)
- [Docs](https://ai-sdk.dev/docs)
- [Providers list](https://ai-sdk.dev/providers/ai-sdk-providers)
- [Cookbook](https://ai-sdk.dev/cookbook)
- [Templates](https://vercel.com/templates?type=ai)
$$ WHERE slug = 'vercel-ai-sdk';


UPDATE tools SET pricing_md = $$
## Pay providers at list price, no gateway markup

Vercel AI Gateway charges no surcharge on top of provider model costs as of early 2026. You pay Anthropic, OpenAI, Google, Groq, etc. exactly what you would pay them directly, just consolidated onto your Vercel invoice.

### What you pay for

- Model tokens, billed through Vercel at the provider's list rate.
- Optional Vercel platform costs if you also host your app on Vercel.

### What you do not pay for

- Routing, failover, load balancing, observability, per-team budgets, cache hits via the Gateway, all included.

### Free credits

New Vercel accounts get monthly free Gateway credits to try the product. Hobby plan includes a small monthly allowance. Pro and Enterprise add higher allowances and committed-use discounts. Confirm current credit amounts on the [Gateway pricing page](https://vercel.com/docs/ai-gateway/pricing).
$$, resources_md = $$
- [AI Gateway product page](https://vercel.com/ai-gateway)
- [Docs](https://vercel.com/docs/ai-gateway)
- [Pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Supported models](https://vercel.com/docs/ai-gateway/models)
- [Vercel dashboard](https://vercel.com/dashboard)
$$ WHERE slug = 'ai-gateway';


UPDATE tools SET pricing_md = $$
## Free framework, paid platform for ops

LangChain the framework is released under the MIT license. `langchain`, `langgraph`, and the provider integration packages are free.

### LangSmith (observability and evals)

LangChain Inc. monetizes through LangSmith, a hosted platform for tracing, evals, prompt management, and human review.

| Plan | Price | What you get |
| --- | --- | --- |
| Developer | $0 | 5,000 traces/mo, 1 seat, basic features |
| Plus | $39/user/mo | 10,000 traces/mo per seat, then usage-based, longer retention |
| Enterprise | Custom | SSO, self-hosted, dedicated support |

LangGraph Platform (hosted agent runtime) is priced separately on a usage basis. Check [langchain.com/pricing](https://www.langchain.com/pricing) for current numbers.

### Model calls

Separate from LangChain's products. You pay the provider for every token.
$$, resources_md = $$
- [Official site](https://www.langchain.com)
- [Pricing](https://www.langchain.com/pricing)
- [Python docs](https://python.langchain.com)
- [JS docs](https://js.langchain.com)
- [GitHub organization](https://github.com/langchain-ai)
- [LangSmith](https://smith.langchain.com)
$$ WHERE slug = 'langchain';


UPDATE tools SET pricing_md = $$
## Free framework, paid hosted platform

The LlamaIndex framework (`llama-index` on PyPI, `llamaindex` on npm) is released under the MIT license. It is free.

### LlamaCloud

LlamaIndex Inc. monetizes through LlamaCloud, a hosted parsing, indexing, and retrieval platform that includes LlamaParse, LlamaExtract, and managed indexes.

| Plan | Price | What you get |
| --- | --- | --- |
| Free | $0 | 1,000 pages/day of LlamaParse, basic features |
| Starter | $50/mo | Higher page quotas, additional credits, basic SLA |
| Pro | $500/mo | Production page volumes, priority support |
| Enterprise | Custom | SSO, VPC, dedicated capacity |

Pricing changes regularly as new features ship. Check [cloud.llamaindex.ai/pricing](https://cloud.llamaindex.ai/pricing) for current rates.

### Model calls

Whatever provider you point LlamaIndex at bills you directly for tokens.
$$, resources_md = $$
- [Official site](https://www.llamaindex.ai)
- [LlamaCloud](https://cloud.llamaindex.ai)
- [Python docs](https://docs.llamaindex.ai)
- [TypeScript docs](https://ts.llamaindex.ai)
- [GitHub repo](https://github.com/run-llama/llama_index)
- [Discord community](https://discord.gg/dGcwcsnxhU)
$$ WHERE slug = 'llamaindex';


-- ── Productivity / consumer ──────────────────────────────────────────────────

UPDATE tools SET pricing_md = $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | GPT-5 with limited daily usage, basic browsing and image generation, limited file uploads |
| Plus | $20/mo | Higher caps, priority access at peak, deep research, Sora video, advanced voice |
| Pro | $200/mo | Effectively unlimited usage of frontier models, Pro-only research modes |
| Business | $25/user/mo (annual) | Workspace, admin controls, no training on your data, SSO on higher tiers |
| Enterprise | Custom | SAML SSO, audit log, data residency, dedicated support |
| Edu | Custom | University-wide deployments at negotiated rates |

### Student discount

OpenAI runs periodic student promotions (free Plus for a semester, etc.) in the US and select other markets. Check [openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing/) for the current offer.

Free-tier users get reduced caps but the same GPT-5 model. Plus is the right default for most students and professionals.
$$, resources_md = $$
- [ChatGPT website](https://chatgpt.com)
- [Pricing](https://openai.com/chatgpt/pricing/)
- [Help center](https://help.openai.com)
- [Release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [Mobile apps](https://openai.com/chatgpt/download/)
- [OpenAI status](https://status.openai.com)
$$ WHERE slug = 'chatgpt';


UPDATE tools SET pricing_md = $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Unlimited basic searches, limited Pro searches per day |
| Pro | $20/mo or $200/yr | 300+ Pro searches/day, access to GPT-5, Claude Opus 4, Gemini 2.5, file uploads, Spaces |
| Max | $200/mo | Higher caps, early access to new features, included API credits |
| Enterprise Pro | $40/user/mo | SSO, admin controls, increased file upload limits |

### Free year for students

Perplexity has run multi-month free-Pro promotions for verified students through campus partnerships, including via Comcast Xfinity and several universities. Check [perplexity.ai/pro](https://www.perplexity.ai/pro) for current student offers.

### API

Perplexity also sells API access to its Sonar models on a pay-per-token basis. See [docs.perplexity.ai](https://docs.perplexity.ai) for current API rates.
$$, resources_md = $$
- [Perplexity website](https://www.perplexity.ai)
- [Pricing](https://www.perplexity.ai/pro)
- [Help center](https://www.perplexity.ai/help-center)
- [API docs](https://docs.perplexity.ai)
- [Mobile apps](https://www.perplexity.ai/download)
- [Blog](https://www.perplexity.ai/hub/blog)
$$ WHERE slug = 'perplexity';


UPDATE tools SET pricing_md = $$
## Free for individuals, paid for power users and teams

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Up to 100 notebooks, 50 sources per notebook, standard audio overviews |
| NotebookLM Plus | $20/mo (or bundled with Google AI Pro at $20/mo) | 5x the daily limits, higher source caps, longer audio overviews, customization |
| Google AI Ultra | $250/mo | Everything in Plus plus highest limits, included across the Google AI suite |
| Workspace | Bundled | Available to Google Workspace Business and Enterprise plans at no extra per-seat cost |

### Education

Verified university accounts often get NotebookLM Plus features through Google Workspace for Education. Check with your institution.

Most students do not need to pay. The free tier covers a full semester of readings comfortably. Upgrade only if you hit the 50-sources-per-notebook ceiling on a large research project. Confirm current limits at [notebooklm.google.com](https://notebooklm.google.com).
$$, resources_md = $$
- [NotebookLM](https://notebooklm.google.com)
- [Help center](https://support.google.com/notebooklm)
- [Google AI plans](https://gemini.google/subscriptions/)
- [Blog](https://blog.google/technology/ai/notebooklm-new-features/)
- [Discord community](https://discord.com/invite/notebooklm)
$$ WHERE slug = 'notebooklm';


UPDATE tools SET pricing_md = $$
## Credit-based plans

v0 is sold on monthly credit allowances. Credits are consumed by generations; larger and more capable models cost more credits per generation.

| Tier | Price | Monthly credits |
| --- | --- | --- |
| Free | $0 | Small starter allowance, watermark removed, basic models |
| Premium | $20/mo | Larger credit pool, access to higher-capability models, private projects |
| Team | $30/user/mo | Shared workspaces, team billing, higher per-seat credits |
| Enterprise | Custom | SSO, audit log, custom credit allotments |

Unused credits do not roll over. You can top up additional credits at usage-based pricing if you blow through your monthly allowance.

Generated code is yours to use without royalty. v0 outputs React with shadcn/ui and Tailwind by default and integrates one-click with Vercel deployments. Check [v0.app/pricing](https://v0.app/pricing) for current credit amounts and add-on rates.
$$, resources_md = $$
- [v0 website](https://v0.app)
- [Pricing](https://v0.app/pricing)
- [Docs](https://v0.app/docs)
- [Community gallery](https://v0.app/community)
- [Changelog](https://v0.app/changelog)
- [X account](https://x.com/v0)
$$ WHERE slug = 'v0';
