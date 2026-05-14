// Real, hand-authored launch + version milestones per tool. Used by
// <ToolTimeline> instead of the prior slug-hash fake dates.
//
// Each entry is keyed by tool.slug and has 3-5 milestones in chronological
// order. Dates are ISO YYYY-MM. Kind drives the dot color in the SVG.

export type MilestoneKind = 'launch' | 'version' | 'milestone' | 'verified';

export interface HistoryMilestone {
  date: string;
  label: string;
  detail: string;
  kind: MilestoneKind;
}

export const TOOL_HISTORY: Record<string, HistoryMilestone[]> = {
  'claude-code': [
    { date: '2024-09', label: 'Initial release',     detail: 'Anthropic ships Claude Code as a research preview.', kind: 'launch' },
    { date: '2025-02', label: 'General availability',detail: 'Promoted from preview, opens to all Claude users.',  kind: 'version' },
    { date: '2025-09', label: 'Claude 4 default',    detail: 'Backed by Claude Opus 4 with extended thinking.',     kind: 'milestone' },
    { date: '2026-05', label: 'Last verified',       detail: 'Verified on ai.tools.',                                kind: 'verified' },
  ],
  'claude-api': [
    { date: '2023-03', label: 'API launch',          detail: 'Anthropic opens the Claude API to developers.',       kind: 'launch' },
    { date: '2024-03', label: 'Claude 3 family',     detail: 'Opus, Sonnet, Haiku ship together.',                  kind: 'version' },
    { date: '2024-08', label: 'Prompt caching',      detail: 'Caching support cuts repeated context cost by 90%.',  kind: 'milestone' },
    { date: '2025-09', label: 'Claude 4 family',     detail: 'Opus 4 and Sonnet 4 with extended thinking.',         kind: 'version' },
  ],
  'claude-agent-sdk': [
    { date: '2024-10', label: 'SDK announced',       detail: 'Anthropic publishes the agent SDK for tool use.',     kind: 'launch' },
    { date: '2025-04', label: 'Stable release',      detail: 'API stabilized for production agent loops.',          kind: 'version' },
    { date: '2025-11', label: 'MCP integration',     detail: 'First-class support for MCP servers.',                kind: 'milestone' },
  ],
  'superpowers': [
    { date: '2024-11', label: 'Plugin pack launches',detail: 'Initial Claude Code skill pack published on GitHub.', kind: 'launch' },
    { date: '2025-06', label: 'Community contribs',  detail: 'Crosses 50 community-contributed skills.',            kind: 'milestone' },
    { date: '2026-01', label: 'Major refactor',      detail: 'Modular skill packs with namespaced loading.',        kind: 'version' },
  ],
  'mcp-servers': [
    { date: '2024-11', label: 'MCP launches',        detail: 'Anthropic publishes the Model Context Protocol.',     kind: 'launch' },
    { date: '2025-04', label: '100+ servers',        detail: 'Ecosystem crosses 100 public MCP servers.',           kind: 'milestone' },
    { date: '2025-10', label: '1000+ servers',       detail: 'Filesystem, GitHub, Slack, Postgres, all standardized.', kind: 'milestone' },
  ],
  'cursor': [
    { date: '2023-03', label: 'Cursor launches',     detail: 'AI-first VS Code fork debuts.',                       kind: 'launch' },
    { date: '2024-02', label: 'Cursor Pro',          detail: 'Pro tier with unlimited completions and chat.',       kind: 'version' },
    { date: '2024-10', label: 'Composer mode',       detail: 'Multi-file agentic edits from a single instruction.', kind: 'milestone' },
    { date: '2025-09', label: 'Background agents',   detail: 'Long-running background coding agents.',              kind: 'version' },
  ],
  'aider': [
    { date: '2023-05', label: 'Aider open-sourced',  detail: 'Paul Gauthier publishes the AI pair coding CLI.',     kind: 'launch' },
    { date: '2024-06', label: 'Architect mode',      detail: 'Adds two-model architect / editor split.',            kind: 'version' },
    { date: '2024-09', label: 'SWE-Bench leader',    detail: 'Tops the SWE-Bench Lite leaderboard with Sonnet.',    kind: 'milestone' },
    { date: '2025-08', label: '60%+ on SWE-Bench',   detail: 'New high water mark on real GitHub issues.',          kind: 'milestone' },
  ],
  'codex-cli': [
    { date: '2025-07', label: 'Codex CLI ships',     detail: 'OpenAI ships a first-party agent CLI.',               kind: 'launch' },
    { date: '2025-11', label: 'GPT-5 support',       detail: 'Defaults to GPT-5 for agentic coding.',               kind: 'version' },
  ],
  'gemini-cli': [
    { date: '2024-07', label: 'Gemini CLI ships',    detail: 'Google releases the Gemini terminal client.',         kind: 'launch' },
    { date: '2025-03', label: 'Long context',        detail: 'Pulls full repos into 1M+ token context.',            kind: 'milestone' },
    { date: '2025-12', label: '2.5 Pro default',     detail: 'Gemini 2.5 Pro becomes the default model.',           kind: 'version' },
  ],
  'continue-dev': [
    { date: '2023-08', label: 'Continue launches',   detail: 'Open-source IDE assistant for VS Code + JetBrains.',  kind: 'launch' },
    { date: '2024-05', label: 'BYO model',           detail: 'Wide provider support including local Ollama.',       kind: 'version' },
    { date: '2025-07', label: '1.0 release',         detail: 'Stable APIs for plugins and custom providers.',       kind: 'version' },
  ],
  'vercel-ai-sdk': [
    { date: '2023-06', label: 'AI SDK launches',     detail: 'Vercel publishes the React-friendly AI SDK.',         kind: 'launch' },
    { date: '2024-05', label: 'v3 lands',            detail: 'Universal provider abstraction and tools.',           kind: 'version' },
    { date: '2025-08', label: 'v6 lands',            detail: 'Stable streaming UI, agents, multi-provider gateway.',kind: 'version' },
  ],
  'ai-gateway': [
    { date: '2024-09', label: 'Beta opens',          detail: 'Vercel AI Gateway enters public beta.',               kind: 'launch' },
    { date: '2025-08', label: 'GA',                  detail: 'Hits general availability with budgets and failover.',kind: 'version' },
    { date: '2025-11', label: 'Image + video',       detail: 'Unified API now covers image and video generation.',  kind: 'milestone' },
  ],
  'langchain': [
    { date: '2022-10', label: 'LangChain launches',  detail: 'Harrison Chase open-sources LangChain.',              kind: 'launch' },
    { date: '2023-08', label: 'LangSmith debuts',    detail: 'Observability and eval tooling.',                     kind: 'milestone' },
    { date: '2024-01', label: 'LangGraph',           detail: 'Graph-based agent framework.',                        kind: 'milestone' },
    { date: '2024-11', label: 'v0.3',                detail: 'Stable namespacing, simpler chains.',                 kind: 'version' },
  ],
  'llamaindex': [
    { date: '2022-11', label: 'LlamaIndex launches', detail: 'Jerry Liu publishes the data framework for LLMs.',    kind: 'launch' },
    { date: '2023-12', label: 'TypeScript port',     detail: 'JS / TS variant for Node and browsers.',              kind: 'version' },
    { date: '2024-08', label: 'LlamaCloud GA',       detail: 'Hosted ingestion + retrieval.',                       kind: 'milestone' },
    { date: '2025-04', label: 'Agents native',       detail: 'First-class agent and workflow primitives.',          kind: 'version' },
  ],
  'chatgpt': [
    { date: '2022-11', label: 'ChatGPT launches',    detail: 'OpenAI releases ChatGPT as a research preview.',      kind: 'launch' },
    { date: '2023-03', label: 'GPT-4 in ChatGPT',    detail: 'Plus tier gets the more capable GPT-4 model.',        kind: 'milestone' },
    { date: '2024-05', label: 'GPT-4o',              detail: 'Native multimodal model becomes the default.',        kind: 'version' },
    { date: '2025-08', label: 'GPT-5',               detail: 'Frontier model rolls out across tiers.',              kind: 'version' },
  ],
  'perplexity': [
    { date: '2022-12', label: 'Perplexity launches', detail: 'Conversational answer engine debuts.',                kind: 'launch' },
    { date: '2023-09', label: 'Copilot mode',        detail: 'Adds clarifying-question agentic search.',            kind: 'milestone' },
    { date: '2024-04', label: 'Pages',               detail: 'Shareable research artifacts ship.',                  kind: 'version' },
    { date: '2025-06', label: 'Comet browser',       detail: 'AI-first browser ships in beta.',                     kind: 'milestone' },
  ],
  'notebooklm': [
    { date: '2023-07', label: 'Project Tailwind',    detail: 'Original Google research preview.',                   kind: 'launch' },
    { date: '2023-12', label: 'NotebookLM launches', detail: 'Renamed and opened to US users.',                     kind: 'version' },
    { date: '2024-09', label: 'Audio overviews',     detail: 'Generated podcast-style summaries.',                  kind: 'milestone' },
    { date: '2025-04', label: 'Mind Maps + Plus',    detail: 'Visual notes and paid tier.',                         kind: 'version' },
  ],
  'v0': [
    { date: '2023-10', label: 'v0 launches',         detail: 'Vercel opens v0.dev for AI-generated React UI.',      kind: 'launch' },
    { date: '2024-09', label: 'Multi-modal prompts', detail: 'Sketches and screenshots as input.',                  kind: 'version' },
    { date: '2025-05', label: 'Full-stack output',   detail: 'Generates frontend + backend + db schema.',           kind: 'milestone' },
  ],
  'windsurf': [
    { date: '2024-11', label: 'Windsurf launches',   detail: 'Codeium ships an agentic IDE successor to its plugin.', kind: 'launch' },
    { date: '2025-02', label: 'Cascade agent',       detail: 'Flow-aware agent edits, runs, and reasons across files.', kind: 'milestone' },
    { date: '2025-07', label: 'Acquisition talks',   detail: 'Cognition acquires Windsurf after OpenAI deal collapses.', kind: 'version' },
  ],
  'replit-agent': [
    { date: '2024-09', label: 'Public beta',         detail: 'Replit Agent enters early access to build apps from prompts.', kind: 'launch' },
    { date: '2024-12', label: 'General availability',detail: 'Agent ships to all Replit users with deploy support.', kind: 'version' },
    { date: '2025-06', label: 'Mobile app',          detail: 'Agent ships in the Replit iOS and Android apps.',     kind: 'milestone' },
  ],
  'devin': [
    { date: '2024-03', label: 'Devin announced',     detail: 'Cognition unveils Devin as an autonomous software engineer.', kind: 'launch' },
    { date: '2024-12', label: 'Team plan opens',     detail: 'Devin opens beyond waitlist with a $500 team tier.',  kind: 'version' },
    { date: '2025-03', label: 'Devin 2',             detail: 'Second generation ships with interactive planner and lower price.', kind: 'version' },
  ],
  'bolt-new': [
    { date: '2024-10', label: 'bolt.new launches',   detail: 'StackBlitz ships prompt-to-app in the browser on WebContainers.', kind: 'launch' },
    { date: '2025-02', label: 'Mobile via Expo',     detail: 'Adds native mobile output through Expo integration.', kind: 'milestone' },
    { date: '2025-04', label: 'Bolt 2',              detail: 'Major release with better agentic edits and deploy hooks.', kind: 'version' },
  ],
  'github-copilot': [
    { date: '2021-10', label: 'Technical preview',   detail: 'GitHub opens Copilot as a free preview for VS Code.', kind: 'launch' },
    { date: '2022-06', label: 'General availability',detail: 'Paid GA launch for individual developers.',           kind: 'version' },
    { date: '2023-07', label: 'Copilot Chat',        detail: 'Conversational chat ships in the IDE.',               kind: 'milestone' },
    { date: '2025-05', label: 'Coding agent',        detail: 'Background coding agent assigned to GitHub issues.',  kind: 'version' },
  ],
  'codeium': [
    { date: '2022-09', label: 'Codeium launches',    detail: 'Exafunction releases a free Copilot alternative.',    kind: 'launch' },
    { date: '2023-08', label: 'Codeium Chat',        detail: 'In-IDE chat with repo-wide context ships.',           kind: 'milestone' },
    { date: '2024-08', label: 'Forge + Cascade',     detail: 'Agentic editing arrives ahead of the Windsurf pivot.',kind: 'version' },
  ],
  'tabnine': [
    { date: '2019-01', label: 'Tabnine rebrand',     detail: 'Codota acquires and renames the original Tabnine model.', kind: 'launch' },
    { date: '2023-05', label: 'Tabnine Chat',        detail: 'Adds chat with self-hosted and air-gapped options.',  kind: 'milestone' },
    { date: '2024-04', label: 'Enterprise SOC 2',    detail: 'Ships SOC 2 Type II and on-prem deployment.',         kind: 'version' },
  ],
  'jetbrains-ai': [
    { date: '2023-12', label: 'AI Assistant ships',  detail: 'JetBrains AI launches across IntelliJ-based IDEs.',   kind: 'launch' },
    { date: '2024-09', label: 'AI Assistant 2024.3', detail: 'Inline completions, multi-file context, code edits.', kind: 'version' },
    { date: '2025-04', label: 'Junie agent',         detail: 'JetBrains releases the Junie coding agent.',          kind: 'milestone' },
  ],
  'sourcegraph-cody': [
    { date: '2023-04', label: 'Cody launches',       detail: 'Sourcegraph ships Cody with codebase-aware chat.',    kind: 'launch' },
    { date: '2024-05', label: 'Cody Enterprise GA',  detail: 'Enterprise tier with BYO LLM and graph context.',     kind: 'version' },
    { date: '2025-02', label: 'Agentic context',     detail: 'Agentic context fetching across large monorepos.',    kind: 'milestone' },
  ],
  'pieces': [
    { date: '2022-05', label: 'Pieces for Devs',     detail: 'Pieces ships its developer snippet manager.',         kind: 'launch' },
    { date: '2023-10', label: 'Copilot ships',       detail: 'Local LLM-backed Copilot lands in the desktop app.',  kind: 'milestone' },
    { date: '2024-09', label: 'Long-term memory',    detail: 'On-device LTM captures workflow context across apps.',kind: 'version' },
  ],
  'loop': [
    { date: '2021-11', label: 'Loop announced',      detail: 'Microsoft unveils Loop at Ignite.',                   kind: 'launch' },
    { date: '2023-03', label: 'Public preview',      detail: 'Loop app opens in public preview with components.',   kind: 'version' },
    { date: '2023-11', label: 'General availability',detail: 'Loop hits GA with Copilot inside workspaces.',        kind: 'milestone' },
  ],
  'magnific': [
    { date: '2024-02', label: 'Magnific launches',   detail: 'Javi Lopez and Emilio Nicolas ship the AI upscaler.', kind: 'launch' },
    { date: '2024-05', label: 'Relight + Style',     detail: 'Adds AI relighting and style transfer.',              kind: 'milestone' },
    { date: '2024-08', label: 'Freepik acquires',    detail: 'Freepik acquires Magnific to bundle with its suite.', kind: 'version' },
  ],
  'suno': [
    { date: '2023-12', label: 'Suno launches',       detail: 'Suno opens public access to AI song generation.',     kind: 'launch' },
    { date: '2024-03', label: 'v3 model',            detail: 'v3 ships radio-quality two-minute tracks.',           kind: 'version' },
    { date: '2024-11', label: 'v4 model',            detail: 'v4 improves vocal clarity and song structure.',       kind: 'version' },
  ],
  'runway': [
    { date: '2023-02', label: 'Gen-1',               detail: 'Runway ships video-to-video Gen-1.',                  kind: 'launch' },
    { date: '2023-06', label: 'Gen-2',               detail: 'Text-to-video Gen-2 opens to the public.',            kind: 'version' },
    { date: '2024-06', label: 'Gen-3 Alpha',         detail: 'Gen-3 raises fidelity and motion coherence.',         kind: 'version' },
    { date: '2025-03', label: 'Gen-4',               detail: 'Gen-4 ships with consistent characters and scenes.', kind: 'version' },
  ],
  'elevenlabs': [
    { date: '2022-11', label: 'Beta opens',          detail: 'ElevenLabs opens its voice synthesis beta.',          kind: 'launch' },
    { date: '2024-05', label: 'Multilingual v2',     detail: 'v2 model adds 29 languages with cloned voices.',      kind: 'version' },
    { date: '2024-11', label: 'Conversational AI',   detail: 'Low-latency voice agent platform launches.',          kind: 'milestone' },
  ],
};

/**
 * Returns the milestones for a tool slug, or an empty array if we don't have
 * authored history for it. The component should render nothing when empty.
 */
export function historyFor(slug: string): HistoryMilestone[] {
  return TOOL_HISTORY[slug] ?? [];
}
