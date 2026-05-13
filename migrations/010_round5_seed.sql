-- Round 5 seed: tool_dna personality entries for the 18 anchor tools.

-- Claude ecosystem ----------------------------------------------------------

UPDATE tools SET tool_dna = $${
  "vibe": "Terminal native agent that reads your code and ships PRs without asking for permission every step.",
  "best_for": ["Multi-file refactors", "Real codebase Q&A", "Long agentic tasks"],
  "not_for": ["First time programmers", "Tasks under 30 seconds"],
  "typical_user": "Senior dev who lives in tmux and wants Claude in the loop.",
  "signature_move": "Reads the whole repo, plans the change, executes, then explains what it did."
}$$::jsonb WHERE slug = 'claude-code';

UPDATE tools SET tool_dna = $${
  "vibe": "Raw access to the Claude models with prompt caching, tool use, and batch APIs for builders who want full control.",
  "best_for": ["Custom AI products", "Backend pipelines", "High volume LLM work"],
  "not_for": ["No-code prototypers", "Quick chat lookups"],
  "typical_user": "Engineer wiring Claude into an existing service or agent.",
  "signature_move": "Long context window plus prompt caching that turns a 100k prompt into a near-free request."
}$$::jsonb WHERE slug = 'claude-api';

UPDATE tools SET tool_dna = $${
  "vibe": "The official SDK for building agents on top of Claude with tool use, memory, and managed loops baked in.",
  "best_for": ["Custom coding agents", "Tool calling pipelines", "Stateful assistants"],
  "not_for": ["One-shot completions", "Pure chat UIs"],
  "typical_user": "Builder shipping an autonomous workflow that needs more than a single API call.",
  "signature_move": "Spins up an agent loop with tools, memory, and retries in a few dozen lines of code."
}$$::jsonb WHERE slug = 'claude-agent-sdk';

UPDATE tools SET tool_dna = $${
  "vibe": "Curated skill pack that gives Claude opinionated workflows for planning, testing, and shipping.",
  "best_for": ["Disciplined agentic dev", "Plan and review loops", "Repeatable workflows"],
  "not_for": ["Vibe coding sessions", "Throwaway scripts"],
  "typical_user": "Team that wants Claude to behave like a senior engineer, not a hot keyboard.",
  "signature_move": "Forces a brainstorm and plan step before any code gets written."
}$$::jsonb WHERE slug = 'superpowers';

UPDATE tools SET tool_dna = $${
  "vibe": "Open protocol that lets any LLM call your tools, files, and services with a uniform handshake.",
  "best_for": ["Plugging Claude into local tools", "Cross-client integrations", "Self-hosted capabilities"],
  "not_for": ["Users who never leave the chat box", "Production without auth review"],
  "typical_user": "Infra-minded dev who wants their editor and assistant to share the same toolbelt.",
  "signature_move": "Write a server once, use the same tools across Claude Desktop, Cursor, and Code."
}$$::jsonb WHERE slug = 'mcp-servers';

-- AI coding CLIs ------------------------------------------------------------

UPDATE tools SET tool_dna = $${
  "vibe": "The AI-first editor that treats your codebase as context and lets you steer with prompts instead of menus.",
  "best_for": ["Fast inline edits", "Repo-wide chat", "Pair programming in your IDE"],
  "not_for": ["Strict VSCode purists", "Teams without LLM budget"],
  "typical_user": "Product engineer who jumped from VSCode and never looked back.",
  "signature_move": "Tab complete that rewrites multiple lines based on the diff you just made."
}$$::jsonb WHERE slug = 'cursor';

UPDATE tools SET tool_dna = $${
  "vibe": "Pair-programming CLI that edits files via git commits and treats the LLM like a careful junior dev.",
  "best_for": ["Editing existing repos", "Git-native workflows", "Cost-conscious sessions"],
  "not_for": ["GUI lovers", "Brand new projects with no code yet"],
  "typical_user": "Open source maintainer hacking on a long-lived Python or JS repo.",
  "signature_move": "Every change lands as a clean commit with a descriptive message you can revert."
}$$::jsonb WHERE slug = 'aider';

UPDATE tools SET tool_dna = $${
  "vibe": "OpenAI's terminal coding agent that plans, edits, and runs commands inside a sandboxed shell.",
  "best_for": ["GPT model fans", "Sandboxed automation", "Terminal-first workflows"],
  "not_for": ["Anthropic-only shops", "Teams wary of auto-exec"],
  "typical_user": "OpenAI power user who wants Codex behavior without leaving the shell.",
  "signature_move": "Drops into a sandbox, runs commands, reads output, and loops until the task is done."
}$$::jsonb WHERE slug = 'codex-cli';

UPDATE tools SET tool_dna = $${
  "vibe": "Google's open-source terminal agent powered by Gemini with a generous free tier and big context.",
  "best_for": ["Cost-sensitive experiments", "Gemini ecosystem users", "Long context Q&A"],
  "not_for": ["Teams locked to Anthropic or OpenAI", "Air-gapped environments"],
  "typical_user": "Developer who wants a free, capable CLI agent without picking a paid subscription.",
  "signature_move": "Massive Gemini context window that swallows a whole repo in one prompt."
}$$::jsonb WHERE slug = 'gemini-cli';

UPDATE tools SET tool_dna = $${
  "vibe": "Open-source autopilot for your IDE that you can point at any model, local or remote.",
  "best_for": ["Local model setups", "Custom IDE assistants", "Privacy-conscious teams"],
  "not_for": ["One-click SaaS users", "Folks who want zero configuration"],
  "typical_user": "Engineer who runs Ollama on their laptop and refuses to send code to a third party.",
  "signature_move": "Swap models per task: a tiny local model for autocomplete, a big cloud model for refactors."
}$$::jsonb WHERE slug = 'continue-dev';

-- AI dev frameworks ---------------------------------------------------------

UPDATE tools SET tool_dna = $${
  "vibe": "TypeScript SDK that gives you streaming, structured output, and tools across every major LLM with one API.",
  "best_for": ["Next.js apps", "Streaming chat UIs", "Provider-agnostic projects"],
  "not_for": ["Python-only stacks", "Teams who never touch a frontend"],
  "typical_user": "Full-stack TS dev shipping an AI feature this sprint.",
  "signature_move": "Drop-in useChat and streamText helpers that turn a route handler into a chat UI."
}$$::jsonb WHERE slug = 'vercel-ai-sdk';

UPDATE tools SET tool_dna = $${
  "vibe": "Unified gateway in front of every major model with failover, caching, observability, and one API key.",
  "best_for": ["Multi-provider apps", "Production AI infra", "Spend tracking"],
  "not_for": ["Single-model hobby projects", "Offline tooling"],
  "typical_user": "Platform engineer who got burned by an OpenAI outage and wants a backup plan.",
  "signature_move": "Automatic failover to a backup provider when your primary model 500s."
}$$::jsonb WHERE slug = 'ai-gateway';

UPDATE tools SET tool_dna = $${
  "vibe": "Sprawling Python framework for chaining LLM calls, tools, retrievers, and agents into apps.",
  "best_for": ["RAG pipelines", "Complex agent graphs", "Python data stacks"],
  "not_for": ["Minimalists", "Folks who want one obvious way to do it"],
  "typical_user": "ML engineer prototyping a multi-step pipeline at a company that lives in Python.",
  "signature_move": "Compose retrievers, models, and tools as a graph with LangGraph for stateful agents."
}$$::jsonb WHERE slug = 'langchain';

UPDATE tools SET tool_dna = $${
  "vibe": "Data framework laser-focused on getting your documents, databases, and APIs into LLM-friendly context.",
  "best_for": ["RAG over private data", "Document Q&A", "Index management"],
  "not_for": ["Pure chat apps", "Teams without source documents"],
  "typical_user": "Engineer building an internal knowledge assistant over Confluence, Notion, or PDFs.",
  "signature_move": "Ingests messy data, builds an index, and answers grounded questions with citations."
}$$::jsonb WHERE slug = 'llamaindex';

-- AI productivity -----------------------------------------------------------

UPDATE tools SET tool_dna = $${
  "vibe": "The chat product that taught the world to talk to an LLM, now packed with tools, memory, and agents.",
  "best_for": ["General questions", "Brainstorms and drafts", "Quick code snippets"],
  "not_for": ["Deep repo edits", "Private codebases without enterprise plan"],
  "typical_user": "Anyone, from a curious teen to a CEO drafting a memo.",
  "signature_move": "Switches between web search, code interpreter, and image generation inside one thread."
}$$::jsonb WHERE slug = 'chatgpt';

UPDATE tools SET tool_dna = $${
  "vibe": "Answer engine that does live web research and cites every claim so you can actually trust the output.",
  "best_for": ["Research tasks", "Up-to-date facts", "Citation-heavy writing"],
  "not_for": ["Creative fiction", "Workflows that need no internet"],
  "typical_user": "Knowledge worker who used to keep ten Google tabs open.",
  "signature_move": "Returns a synthesized answer with numbered sources you can click and verify."
}$$::jsonb WHERE slug = 'perplexity';

UPDATE tools SET tool_dna = $${
  "vibe": "Personal research assistant that turns your uploaded docs into a grounded chat, podcast, and study guide.",
  "best_for": ["Studying dense material", "Document grounded chat", "Audio overviews"],
  "not_for": ["Open-ended web search", "Code generation"],
  "typical_user": "Student or analyst with a stack of PDFs and an exam or report on Monday.",
  "signature_move": "Generates a two-host podcast that explains your sources in plain English."
}$$::jsonb WHERE slug = 'notebooklm';

UPDATE tools SET tool_dna = $${
  "vibe": "Generative UI tool that turns a prompt into a working React component you can ship to production.",
  "best_for": ["Landing pages", "Component prototypes", "Design to code handoffs"],
  "not_for": ["Backend logic", "Apps without a frontend"],
  "typical_user": "Founder or designer who wants real Tailwind and shadcn code, not a Figma frame.",
  "signature_move": "Generates a polished component, then lets you iterate in chat and ship to Vercel."
}$$::jsonb WHERE slug = 'v0';
