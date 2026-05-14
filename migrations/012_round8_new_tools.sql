-- Round 8: 15 new curated tools added to the directory.
-- Each tool gets a full INSERT followed by an UPDATE that populates
-- pricing_tiers, strengths, workflows, tool_dna, and popularity.
-- Idempotent via ON CONFLICT (slug) DO NOTHING on the INSERTs.

-- ── 1. Windsurf ───────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('windsurf', 'Windsurf', 'https://windsurf.com',
 $$Cascade-driven AI editor with multi-file plan and apply.$$,
 $$Windsurf is Codeium's agentic IDE, a fork of VS Code wrapped around the Cascade agent. Cascade plans changes across many files at once, then walks the diff with you. It feels like a coding partner that already mapped the repo before you opened the editor.$$,
 'clis',
 ARRAY['editor','ide','agent','cascade'],
 E':::os mac\n```bash\nbrew install --cask windsurf\n```\n:::\n:::os linux\n```bash\n# Download the .deb or .rpm from https://windsurf.com/download\n```\n:::\n:::os windows\n```powershell\nwinget install Codeium.Windsurf\n```\n:::',
 E'## First session\n\n- Open Windsurf in any project.\n- Press `Cmd+L` to open Cascade and describe a multi-file change.\n- Cascade plans the edit, shows the file list, then writes the diff.\n- Approve or refine each hunk before it lands.\n- Tab completion works inline as you type.',
 E'| Shortcut | Action |\n|---|---|\n| `Cmd+L` | Open Cascade chat |\n| `Cmd+I` | Inline edit on selection |\n| `Cmd+.` | Quick suggestion |\n| `Cmd+Enter` | Accept Cascade plan |\n| `@file` | Mention a file in chat |\n| `@docs` | Pull in external docs |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Limited Cascade credits, basic tab autocomplete, single seat |
| Pro | $15/mo | 500 prompt credits, 1500 flow action credits, premium models |
| Teams | $30/user/mo | Shared credits, admin controls, SSO add-on |
| Enterprise | Custom | SAML, audit log, dedicated capacity, custom data retention |

Cascade credit usage scales with how often the agent reasons across multiple files. Tab completions remain unlimited on all paid tiers. Check the [Windsurf pricing page](https://windsurf.com/pricing) for current credit counts.
$$,
 $$
- [Windsurf website](https://windsurf.com)
- [Docs](https://docs.windsurf.com)
- [Pricing](https://windsurf.com/pricing)
- [Changelog](https://windsurf.com/changelog)
- [Discord community](https://discord.gg/windsurf)
- [X account](https://x.com/windsurf_ai)
$$,
 'freemium','easy','5 min','approved',TRUE,'ai.tools',NOW(),NOW(),NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Limited Cascade credits per month",
        "Basic tab autocomplete",
        "Single seat",
        "Personal projects only"
      ]
    },
    {
      "name": "Pro",
      "price": "$15",
      "period": "/mo",
      "highlight": true,
      "features": [
        "500 prompt credits, 1500 flow action credits",
        "Premium models including Claude Sonnet and GPT-5",
        "Unlimited tab autocomplete",
        "Multi-file Cascade planning"
      ],
      "cta": { "label": "Try Pro", "href": "https://windsurf.com/pricing" }
    },
    {
      "name": "Teams",
      "price": "$30",
      "period": "/user/mo",
      "features": [
        "Shared credit pool",
        "Admin and billing controls",
        "Centralised user management",
        "SSO add-on available"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "SAML SSO and audit log",
        "Dedicated capacity",
        "Custom data retention",
        "Priority support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 7 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Plan a multi-file feature with Cascade",
      "prompt": "Cascade, add a /settings page with a profile form, server action, and a navigation link in the sidebar.",
      "steps": [
        "Cascade scans the repo and lists target files",
        "Generates a written plan you can review",
        "Walks the diff file by file with explanations",
        "Applies the change when you approve the plan"
      ],
      "outcome": "Full feature scaffolded across pages, components, and server code."
    },
    {
      "title": "Inline rewrite with context",
      "prompt": "Highlight a function, press Cmd+I, ask 'rewrite as async and add zod validation'.",
      "steps": [
        "Select code in the editor",
        "Trigger inline edit",
        "Cascade pulls related imports for context",
        "Diff appears in place to accept or reject"
      ],
      "outcome": "Targeted rewrite that respects the rest of the file."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Agentic IDE where Cascade reads the whole repo and walks you through a planned diff before any code lands.",
    "best_for": ["Multi-file features", "Repo-wide refactors", "Developers who want a planning step"],
    "not_for": ["Pure VSCode loyalists", "Tasks that fit in a single function"],
    "typical_user": "Product engineer who wants Cursor-style flow with a tighter plan and review loop.",
    "signature_move": "Generates a written plan, lists every file it will touch, then walks the diff with you."
  }$$::jsonb,
  popularity = 78
WHERE slug = 'windsurf';


-- ── 2. Replit Agent ──────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('replit-agent', 'Replit Agent', 'https://replit.com/agent',
 $$Spin up a working app from a single prompt in your browser.$$,
 $$Replit Agent takes a plain-English description of an app, then writes the code, installs dependencies, configures a database, and deploys it on Replit's infrastructure. The entire loop, prompt to running URL, lives in the browser. Great for getting from idea to demo in an afternoon.$$,
 'clis',
 ARRAY['agent','browser','no-setup','deploy'],
 E'Sign in at https://replit.com. No local install. The Agent is available on the Core plan and above.',
 E'- Open replit.com and click New Agent.\n- Describe the app in plain English: "a todo list with Google sign-in and a Postgres backend".\n- Watch the Agent draft a plan, scaffold files, and install dependencies.\n- Hit Run to see it live, share a URL, or deploy to a custom domain.\n- Iterate by talking to the Agent in the side panel.',
 E'| Action | What it does |\n|---|---|\n| New Agent | Start a new project from a prompt |\n| Run | Boot the app inside the workspace |\n| Deploy | Promote to a public URL |\n| Database | Provision Postgres in one click |\n| Secrets | Manage env vars from the UI |\n| Checkpoints | Roll back the codebase to a previous step |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Starter | $0 | Limited Agent runs, public Repls only |
| Core | $20/mo | Full Agent access, private projects, monthly compute credits |
| Teams | $40/user/mo | Shared workspaces, role-based access, team billing |
| Enterprise | Custom | SSO, audit log, VPC connectivity, procurement support |

Agent runs consume Replit compute credits. Heavier projects (large dependency installs, long-running deploys) burn credits faster. Confirm current credit allocations on the [Replit pricing page](https://replit.com/pricing).
$$,
 $$
- [Replit website](https://replit.com)
- [Agent product page](https://replit.com/agent)
- [Pricing](https://replit.com/pricing)
- [Docs](https://docs.replit.com)
- [Community](https://replit.com/community)
- [Blog](https://blog.replit.com)
$$,
 'freemium','easy','2 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '1 second',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Starter",
      "price": "$0",
      "features": [
        "Limited Agent runs",
        "Public Repls only",
        "Basic compute credits",
        "Community support"
      ]
    },
    {
      "name": "Core",
      "price": "$20",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Full Agent access",
        "Private projects",
        "Monthly compute and AI credits",
        "Custom domain deploys"
      ],
      "cta": { "label": "Start with Core", "href": "https://replit.com/pricing" }
    },
    {
      "name": "Teams",
      "price": "$40",
      "period": "/user/mo",
      "features": [
        "Shared workspaces",
        "Role-based access",
        "Team billing",
        "Higher compute credits"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "SSO and audit log",
        "VPC connectivity",
        "Procurement support",
        "Dedicated capacity"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 8 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 7 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 10 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Idea to live URL in one prompt",
      "prompt": "Build a habit tracker with Google sign-in, a Postgres backend, and a weekly streak view.",
      "steps": [
        "Agent drafts a plan and target stack",
        "Generates the codebase and installs dependencies",
        "Provisions Postgres and seeds initial data",
        "Deploys to a public Replit URL"
      ],
      "outcome": "Working demo with auth, data, and a shareable URL."
    },
    {
      "title": "Iterate by talking",
      "prompt": "Add a settings page that lets users delete their account, and add a confirmation modal.",
      "steps": [
        "Describe the change in the Agent panel",
        "Agent edits files and migrates the database if needed",
        "Restart the app from the workspace",
        "Roll back via Checkpoints if anything breaks"
      ],
      "outcome": "Feature shipped without touching a local editor."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Browser-native agent that takes one prompt and hands back a deployed app with a database wired up.",
    "best_for": ["Hackathon demos", "Non-developers building MVPs", "Quick prototype to URL"],
    "not_for": ["Large codebases", "Teams with strict on-prem requirements"],
    "typical_user": "Founder or student who wants an app live by the end of the afternoon, not the end of the sprint.",
    "signature_move": "Goes from plain-English idea to a public URL with a working database in one session."
  }$$::jsonb,
  popularity = 84
WHERE slug = 'replit-agent';


-- ── 3. Devin ─────────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('devin', 'Devin', 'https://devin.ai',
 $$Long-running autonomous software engineer agent from Cognition.$$,
 $$Devin is a remote AI engineer that picks up a ticket, plans the work, writes the code, runs the tests, and opens a pull request. It can execute multi-hour tasks in its own sandboxed VM, which is what sets it apart from in-editor copilots. Most useful when paired with a clear ticket and a CI suite.$$,
 'clis',
 ARRAY['agent','autonomous','remote','cognition'],
 E'Sign up at https://devin.ai. Devin runs in the cloud, no local install. Connect a GitHub repo and grant it access to the branches you want it to touch.',
 E'- Sign in at devin.ai and link a GitHub account.\n- Create a new session and paste a ticket or task description.\n- Devin spins up a fresh VM and plans the work in writing.\n- Watch the live terminal as it edits files, runs tests, and pushes commits.\n- Review the resulting PR on GitHub.',
 E'| Surface | What it does |\n|---|---|\n| Sessions | Each task gets its own sandboxed VM |\n| Slack integration | Assign tasks by mentioning @Devin |\n| Linear / Jira | Pick up tickets directly from your tracker |\n| Knowledge | Teach Devin facts that persist across sessions |\n| Pause | Interrupt and steer a run mid-flight |\n| Replay | Step through what Devin actually did |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Core | $20/mo + usage | Pay-as-you-go ACU (Agent Compute Unit) billing on top of a monthly base |
| Team | $500/mo | Bundled ACUs, multiple seats, shared session history |
| Enterprise | Custom | SSO, audit, on-prem deployment, dedicated capacity |

Each ACU corresponds to a chunk of agent compute, roughly aligned with the work Devin does on a small task. Long, autonomous runs can burn many ACUs, so budget accordingly. Devin is significantly more expensive than an in-editor copilot, and is priced to compete with hiring a junior engineer rather than a $20 seat. Confirm current ACU rates on the [Cognition pricing page](https://cognition.ai/pricing).
$$,
 $$
- [Devin website](https://devin.ai)
- [Cognition pricing](https://cognition.ai/pricing)
- [Docs](https://docs.devin.ai)
- [Devin on YouTube](https://www.youtube.com/@cognition_labs)
- [Blog](https://cognition.ai/blog)
$$,
 'paid','medium','30 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '2 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Core",
      "price": "$20",
      "period": "/mo + usage",
      "features": [
        "Pay-as-you-go ACU billing on top of monthly base",
        "Single seat",
        "GitHub, Slack, and Linear integrations",
        "Cloud-hosted sandboxes"
      ]
    },
    {
      "name": "Team",
      "price": "$500",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Bundled monthly ACUs",
        "Multiple seats",
        "Shared session history",
        "Higher concurrency limits"
      ],
      "cta": { "label": "Talk to sales", "href": "https://devin.ai" }
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "SAML SSO and audit",
        "On-prem deployment option",
        "Dedicated capacity",
        "Custom data residency"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 6 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 4 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 8 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Hand off a ticket and walk away",
      "prompt": "Paste a Linear ticket into Devin: 'fix flaky retry logic in src/queue.ts and add a regression test'.",
      "steps": [
        "Devin spins up a fresh VM and clones the repo",
        "Writes a plan and shares it in the session",
        "Edits files, runs the test suite, iterates on failures",
        "Pushes a branch and opens a pull request"
      ],
      "outcome": "A reviewable PR with passing tests, hands off."
    },
    {
      "title": "Slack-assigned task",
      "prompt": "In a channel, @Devin add a CSV export button to the analytics dashboard.",
      "steps": [
        "Devin picks up the message and spins up a session",
        "Replies in-thread with a written plan",
        "Streams updates as it codes and tests",
        "Posts the PR link when done"
      ],
      "outcome": "Routine feature shipped without anyone opening a laptop."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Remote autonomous engineer that takes a ticket, runs in its own sandbox for hours, and opens a PR.",
    "best_for": ["Well-scoped tickets", "Background work while you focus elsewhere", "Teams with strong CI"],
    "not_for": ["Tight budgets", "Ambiguous tasks without acceptance criteria"],
    "typical_user": "Engineering manager who wants to assign routine tickets to a junior who never sleeps.",
    "signature_move": "Runs unattended for hours, then drops a PR with a written plan, tests, and a replay you can audit."
  }$$::jsonb,
  popularity = 72
WHERE slug = 'devin';


-- ── 4. Bolt.new ──────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('bolt-new', 'Bolt.new', 'https://bolt.new',
 $$Prompt to full-stack web app in your browser.$$,
 $$Bolt.new from StackBlitz runs an entire Node.js dev environment inside the browser via WebContainers, then drives it with an AI agent. You describe an app, Bolt scaffolds it, runs it, and lets you iterate via chat. Strong for React, Next.js, Astro, Svelte, and Vue starters.$$,
 'frameworks',
 ARRAY['agent','browser','webcontainers','full-stack'],
 E'Sign in at https://bolt.new with a StackBlitz, GitHub, or Google account. No local install required.',
 E'- Open bolt.new and type an app description.\n- Bolt picks a framework, scaffolds files, and runs the dev server in-browser.\n- The preview pane updates as the agent writes code.\n- Chat with Bolt to add features, fix bugs, or change styling.\n- Export to GitHub or deploy to Netlify or Vercel with one click.',
 E'| Action | Result |\n|---|---|\n| New chat | Start a fresh project |\n| @file | Pin a file as required context |\n| Revert | Roll back to a previous step |\n| Export | Download the code as a zip |\n| Deploy | One-click to Netlify or Vercel |\n| Fork | Branch into a new project |',
 $$
## Plans

Bolt is sold on monthly token allowances. Token usage scales with how much code the agent generates and how often it revises.

| Tier | Price | Monthly tokens |
| --- | --- | --- |
| Free | $0 | Small daily allowance, public projects |
| Pro | $20/mo | 10M tokens, private projects, priority models |
| Pro 50 | $50/mo | 26M tokens, higher concurrency |
| Pro 100 | $100/mo | 55M tokens |
| Pro 200 | $200/mo | 120M tokens, best for heavy daily use |
| Teams | $30/user/mo | Shared token pool, role-based access |

Unused tokens do not roll over. Top-ups are available if you blow through your allowance. Confirm current rates at [bolt.new/pricing](https://bolt.new/pricing).
$$,
 $$
- [Bolt.new](https://bolt.new)
- [Pricing](https://bolt.new/pricing)
- [Docs and guides](https://support.bolt.new)
- [StackBlitz](https://stackblitz.com)
- [Community Discord](https://discord.gg/stackblitz)
- [Changelog](https://bolt.new/changelog)
$$,
 'freemium','easy','2 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '3 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Small daily token allowance",
        "Public projects",
        "Basic models",
        "Full WebContainer environment"
      ]
    },
    {
      "name": "Pro",
      "price": "$20",
      "period": "/mo",
      "highlight": true,
      "features": [
        "10M tokens per month",
        "Private projects",
        "Priority models including Claude Sonnet",
        "Higher concurrency"
      ],
      "cta": { "label": "Try Pro", "href": "https://bolt.new/pricing" }
    },
    {
      "name": "Pro 100",
      "price": "$100",
      "period": "/mo",
      "features": [
        "55M tokens per month",
        "Faster iteration on large projects",
        "Top-up bundles available",
        "Best for daily building"
      ]
    },
    {
      "name": "Teams",
      "price": "$30",
      "period": "/user/mo",
      "features": [
        "Shared token pool",
        "Role-based access",
        "Centralised billing",
        "Project sharing across the team"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 10 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Prompt a full-stack starter",
      "prompt": "Astro site with a blog, a contact form that emails me, and Tailwind styling.",
      "steps": [
        "Bolt picks a framework and scaffolds the project",
        "Runs the dev server inside the browser",
        "Streams files into the editor as it codes",
        "Live preview updates side-by-side"
      ],
      "outcome": "Runnable starter with the entire stack in minutes."
    },
    {
      "title": "Iterate with the agent",
      "prompt": "Add an admin route protected by a password env var, and a dashboard that lists form submissions.",
      "steps": [
        "Describe the change in chat",
        "Bolt updates files and restarts the server",
        "Test the new flow in the preview pane",
        "Deploy to Netlify or Vercel when happy"
      ],
      "outcome": "Feature added end to end without leaving the browser."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Browser IDE where an agent writes code into a live Node sandbox while you watch it boot.",
    "best_for": ["Full-stack prototypes", "Hackathons", "Designers who want real code"],
    "not_for": ["Existing monorepos", "Backend-heavy enterprise apps"],
    "typical_user": "Indie hacker or designer who wants a working app between coffee and lunch.",
    "signature_move": "Boots a real Node server inside your browser tab and edits it from chat."
  }$$::jsonb,
  popularity = 80
WHERE slug = 'bolt-new';


-- ── 5. GitHub Copilot ────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('github-copilot', 'GitHub Copilot', 'https://github.com/features/copilot',
 $$The original AI pair programmer, now with chat and agents.$$,
 $$GitHub Copilot kicked off the AI coding category in 2021. The 2026 product is a full suite: inline suggestions, chat, agent mode, code review, and a CLI. It is the safest enterprise default, with native VS Code and JetBrains integrations and predictable billing through GitHub itself.$$,
 'clis',
 ARRAY['copilot','github','vscode','jetbrains','enterprise'],
 E':::os mac\n```bash\n# Install the GitHub Copilot extension from the VS Code marketplace\ncode --install-extension GitHub.copilot\ncode --install-extension GitHub.copilot-chat\n```\n:::\n:::os linux\n```bash\ncode --install-extension GitHub.copilot\n```\n:::\n:::os windows\n```powershell\ncode --install-extension GitHub.copilot\n```\n:::',
 E'## Daily use\n\n- Inline suggestions appear as you type. Press `Tab` to accept.\n- `Cmd+I` opens inline chat for a quick edit.\n- The Copilot panel handles repo-aware chat and agent runs.\n- `gh copilot suggest` adds a CLI hint generator in your terminal.\n- Use `@workspace` in chat to ground answers in the open repo.',
 E'| Shortcut | Action |\n|---|---|\n| `Tab` | Accept suggestion |\n| `Esc` | Dismiss suggestion |\n| `Cmd+I` | Inline chat |\n| `@workspace` | Repo-grounded chat |\n| `@terminal` | Generate a shell command |\n| `gh copilot suggest` | CLI command suggestions |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Limited monthly completions and chat messages, basic models |
| Pro | $10/mo or $100/yr | Unlimited completions, chat, agent mode, premium models |
| Pro+ | $39/mo | Higher premium model quota, priority routing |
| Business | $19/user/mo | Org policy, SSO, content exclusions, audit log |
| Enterprise | $39/user/mo | Knowledge bases over your codebase, fine-grained admin |

Verified students, teachers, and OSS maintainers get Copilot Pro free. Confirm current rates on the [Copilot plans page](https://github.com/features/copilot/plans).
$$,
 $$
- [Copilot product page](https://github.com/features/copilot)
- [Pricing](https://github.com/features/copilot/plans)
- [Docs](https://docs.github.com/copilot)
- [Student offer](https://education.github.com/pack)
- [Trust center](https://copilot.github.trust.page)
- [Changelog](https://github.blog/changelog/label/copilot/)
$$,
 'freemium','easy','5 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '4 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Limited monthly completions",
        "Limited chat messages",
        "Basic models",
        "Personal use"
      ]
    },
    {
      "name": "Pro",
      "price": "$10",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Unlimited completions",
        "Chat and agent mode",
        "Premium models including Claude Sonnet and GPT-5",
        "Free for verified students and OSS maintainers"
      ],
      "cta": { "label": "Try Pro", "href": "https://github.com/features/copilot/plans" }
    },
    {
      "name": "Business",
      "price": "$19",
      "period": "/user/mo",
      "features": [
        "Org policy controls",
        "SSO and audit log",
        "Content exclusions",
        "Centralised billing"
      ]
    },
    {
      "name": "Enterprise",
      "price": "$39",
      "period": "/user/mo",
      "features": [
        "Knowledge bases over your codebase",
        "Fine-grained admin",
        "Higher premium model quota",
        "Dedicated support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 10 },
    { "axis": "ease", "score": 10 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Accept inline suggestions",
      "prompt": "Start typing a function signature. Copilot offers a body. Press Tab.",
      "steps": [
        "Type the signature and a docstring",
        "Copilot drafts the implementation",
        "Press Tab to accept or Esc to dismiss",
        "Refine with inline chat if needed"
      ],
      "outcome": "Standard boilerplate drafted before you do."
    },
    {
      "title": "Repo-grounded chat",
      "prompt": "Open Copilot chat, type '@workspace where is the auth middleware defined and how is it wired into routes?'.",
      "steps": [
        "Copilot indexes the open workspace",
        "Returns an answer with file paths and snippets",
        "Click through to jump to each reference",
        "Ask follow-ups in the same thread"
      ],
      "outcome": "Repo Q and A grounded in your actual code."
    },
    {
      "title": "Generate a shell command",
      "prompt": "gh copilot suggest 'find files modified in the last week and bigger than 1MB'.",
      "steps": [
        "Run gh copilot suggest with a description",
        "Review the proposed command",
        "Press y to execute or refine",
        "Saves you a trip to a man page"
      ],
      "outcome": "Cryptic CLI invocation, explained and ready to run."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "The default AI coding companion: predictable, deeply integrated into GitHub and VS Code, safe enterprise pick.",
    "best_for": ["Daily inline suggestions", "Enterprise rollouts", "Teams already on GitHub"],
    "not_for": ["Bleeding-edge agent enthusiasts", "Workflows outside the GitHub ecosystem"],
    "typical_user": "Developer at a company that pays for GitHub already and wants AI without a procurement review.",
    "signature_move": "Inline ghost text completion that nails the next 10 lines based on the file and recent edits."
  }$$::jsonb,
  popularity = 99
WHERE slug = 'github-copilot';


-- ── 6. Codeium ───────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('codeium', 'Codeium', 'https://codeium.com',
 $$Free AI autocomplete with strong language coverage.$$,
 $$Codeium pairs an in-editor autocomplete with chat that runs in VS Code, JetBrains, Vim, Emacs, and dozens of other editors. The individual tier is free forever and supports 70+ languages. Codeium also ships Windsurf as its agentic editor, but the original extension remains the broadest reach autocomplete on the market.$$,
 'clis',
 ARRAY['autocomplete','vscode','jetbrains','free'],
 E':::os mac\n```bash\n# Install the Codeium extension for your editor of choice\ncode --install-extension Codeium.codeium\n```\n:::\n:::os linux\n```bash\ncode --install-extension Codeium.codeium\n```\n:::\n:::os windows\n```powershell\ncode --install-extension Codeium.codeium\n```\n:::',
 E'- Install the extension and sign in with a free Codeium account.\n- Inline ghost text appears as you type. Press `Tab` to accept.\n- Open the chat panel for repo-aware questions.\n- Use the @ mention to pin specific files as context.\n- Switch to Windsurf for the full agentic IDE experience.',
 E'| Shortcut | Action |\n|---|---|\n| `Tab` | Accept suggestion |\n| `Cmd+Shift+A` | Open Codeium chat |\n| `Alt+]` | Next suggestion |\n| `Alt+[` | Previous suggestion |\n| `@file` | Mention a file in chat |\n| `Cmd+Enter` | Send chat message |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Individual | $0 forever | Unlimited autocomplete, chat, 70+ languages |
| Teams | $15/user/mo | Shared analytics, admin controls, higher chat quota |
| Enterprise (self-hosted) | Custom | On-prem deployment, fine-tuning on your code |

Codeium's free tier is unusually generous. Most solo developers never need to pay. Teams plans add admin and observability; Enterprise adds self-hosting and bespoke fine-tunes. Confirm current rates on the [Codeium pricing page](https://codeium.com/pricing).
$$,
 $$
- [Codeium website](https://codeium.com)
- [Pricing](https://codeium.com/pricing)
- [Docs](https://docs.codeium.com)
- [Windsurf](https://windsurf.com)
- [Discord community](https://discord.gg/codeium)
- [Blog](https://codeium.com/blog)
$$,
 'freemium','easy','5 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '5 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Individual",
      "price": "$0",
      "highlight": true,
      "features": [
        "Free forever for solo use",
        "Unlimited autocomplete",
        "Repo-aware chat",
        "70+ languages, 40+ editors"
      ],
      "cta": { "label": "Get started", "href": "https://codeium.com" }
    },
    {
      "name": "Teams",
      "price": "$15",
      "period": "/user/mo",
      "features": [
        "Shared analytics",
        "Admin controls",
        "Higher chat quota",
        "Centralised billing"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "On-prem deployment",
        "Fine-tuning on your code",
        "SAML SSO and audit",
        "Dedicated support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 10 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Free autocomplete in any editor",
      "prompt": "Install the extension, sign in, and start typing.",
      "steps": [
        "Pick from 40+ supported editors",
        "Sign in with a free account",
        "Inline suggestions appear immediately",
        "No credit card required, ever"
      ],
      "outcome": "Capable AI autocomplete at zero cost."
    },
    {
      "title": "Repo-aware chat",
      "prompt": "Ask the chat panel: 'show me where we handle Stripe webhooks'.",
      "steps": [
        "Open the chat panel",
        "Codeium indexes the workspace",
        "Returns answers with file references",
        "Pin extra files via @ mentions"
      ],
      "outcome": "Quick repo Q and A without paying a seat fee."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Generous free autocomplete that quietly does its job in whatever editor you already use.",
    "best_for": ["Solo developers on a budget", "Polyglot codebases", "Less common editors"],
    "not_for": ["Teams wanting the latest agentic features in the base extension", "Workflows that need deep tool use"],
    "typical_user": "Student or hobbyist who refuses to pay $20 a month for tab completion.",
    "signature_move": "Free forever individual plan with unlimited autocomplete and dozens of editor integrations."
  }$$::jsonb,
  popularity = 70
WHERE slug = 'codeium';


-- ── 7. Tabnine ───────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('tabnine', 'Tabnine', 'https://tabnine.com',
 $$Private AI code assistant with on-prem options.$$,
 $$Tabnine is the privacy-first option in this space. The full stack can run on your own infrastructure, the models can be fine-tuned on your codebase, and your code never trains a shared model. It is the safe pick for regulated industries that still want modern autocomplete and chat.$$,
 'clis',
 ARRAY['privacy','enterprise','on-prem','autocomplete'],
 E':::os mac\n```bash\n# Install the Tabnine extension from the VS Code or JetBrains marketplace\ncode --install-extension TabNine.tabnine-vscode\n```\n:::\n:::os linux\n```bash\ncode --install-extension TabNine.tabnine-vscode\n```\n:::\n:::os windows\n```powershell\ncode --install-extension TabNine.tabnine-vscode\n```\n:::',
 E'- Install the extension and sign in.\n- Tabnine suggests completions and full functions as you type.\n- Open Tabnine Chat for explanations, test generation, and refactors.\n- Enterprise can deploy the inference server inside their own VPC.\n- Admins can fine-tune a private model on the org codebase.',
 E'| Shortcut | Action |\n|---|---|\n| `Tab` | Accept suggestion |\n| `Cmd+Shift+P` Tabnine Chat | Open chat panel |\n| `/explain` | Explain selection |\n| `/test` | Generate tests for selection |\n| `/fix` | Fix the selection |\n| `/document` | Add doc comments |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Basic | $0 | Short completions, limited chat, individual use |
| Dev | $9/user/mo | Full completions, chat, code review, multiple editors |
| Enterprise | $39/user/mo | SSO, admin controls, private deployment, fine-tuning |

Tabnine's main draw is the Enterprise tier: deploy the whole stack inside your own VPC, on-prem, or air-gapped. Fine-tune a private model on your code so suggestions match your house style. Confirm current rates at [tabnine.com/pricing](https://tabnine.com/pricing).
$$,
 $$
- [Tabnine website](https://tabnine.com)
- [Pricing](https://tabnine.com/pricing)
- [Docs](https://docs.tabnine.com)
- [Security and privacy](https://tabnine.com/security)
- [Blog](https://tabnine.com/blog)
- [Status](https://status.tabnine.com)
$$,
 'freemium','easy','5 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '6 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Basic",
      "price": "$0",
      "features": [
        "Short completions",
        "Limited chat",
        "Individual use",
        "No card on file"
      ]
    },
    {
      "name": "Dev",
      "price": "$9",
      "period": "/user/mo",
      "highlight": true,
      "features": [
        "Full completions and chat",
        "Code review and test generation",
        "Multiple editors",
        "Cloud or private inference"
      ],
      "cta": { "label": "Try Dev", "href": "https://tabnine.com/pricing" }
    },
    {
      "name": "Enterprise",
      "price": "$39",
      "period": "/user/mo",
      "features": [
        "SAML SSO and admin controls",
        "Private VPC or on-prem deployment",
        "Fine-tuning on your code",
        "Dedicated support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 8 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 9 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 8 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Privacy-first autocomplete",
      "prompt": "Install the extension, connect to a self-hosted Tabnine server, and start typing.",
      "steps": [
        "Admin deploys the inference server in-VPC",
        "Developers connect via the extension",
        "No code leaves the corporate network",
        "Suggestions stream from the private model"
      ],
      "outcome": "Modern autocomplete that passes security review."
    },
    {
      "title": "Fine-tune on your codebase",
      "prompt": "Admin uploads the org codebase and runs a fine-tune job.",
      "steps": [
        "Configure fine-tuning in the Tabnine console",
        "Tabnine builds a private model variant",
        "Roll it out to developers via policy",
        "Suggestions now match your house conventions"
      ],
      "outcome": "AI completions that look like a senior on your team wrote them."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Quiet, privacy-first AI assistant that fits inside the security review at a bank or hospital.",
    "best_for": ["Regulated industries", "On-prem and air-gapped setups", "Teams with strict code-leaving policies"],
    "not_for": ["Hobbyists chasing the newest agent features", "Teams without privacy constraints"],
    "typical_user": "Senior engineer at a bank or government agency who needs AI but cannot send code to OpenAI.",
    "signature_move": "Runs entirely inside your VPC with a model fine-tuned on your codebase."
  }$$::jsonb,
  popularity = 46
WHERE slug = 'tabnine';


-- ── 8. JetBrains AI ──────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('jetbrains-ai', 'JetBrains AI', 'https://www.jetbrains.com/ai',
 $$Native AI inside IntelliJ, PyCharm, WebStorm, and friends.$$,
 $$JetBrains AI Assistant and the newer Junie agent bring first-party AI into every JetBrains IDE. Junie can plan and execute multi-file tasks, AI Assistant handles inline chat, completions, and refactors. Best in class language understanding because the IDE already knows your types, references, and project structure.$$,
 'clis',
 ARRAY['jetbrains','intellij','pycharm','agent','junie'],
 E':::os mac\n```bash\n# Install or update your JetBrains IDE, then enable the AI plugin from Settings -> Plugins\nbrew install --cask intellij-idea\n```\n:::\n:::os linux\n```bash\n# Use JetBrains Toolbox to install IDEs and updates\n```\n:::\n:::os windows\n```powershell\n# Use JetBrains Toolbox to install IDEs and updates\n```\n:::',
 E'- Sign in to your JetBrains Account inside the IDE.\n- Enable AI Assistant and Junie from Settings -> Tools -> AI.\n- Use `Ctrl+\\` for AI chat, or right-click for AI actions on a selection.\n- Junie picks up tasks from a side panel and plans across files.\n- AI integrates with Search Everywhere and the refactor menu.',
 E'| Shortcut | Action |\n|---|---|\n| `Ctrl+\\` | Open AI chat |\n| Right-click | AI actions on selection |\n| `Alt+Enter` | Suggest fix or refactor |\n| Junie panel | Multi-file agent tasks |\n| `/explain` | Explain selection |\n| `/test` | Generate test |',
 $$
## Plans

JetBrains AI is sold as part of the unified AI Pro and AI Ultimate subscriptions.

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Limited completions, basic chat, included with any IDE |
| AI Pro | $10/mo | Full AI Assistant and Junie quota, premium models |
| AI Ultimate | $20/mo | Highest quota, priority routing, advanced features |
| Organization | Custom | Centralised billing, admin controls, license management |

Existing JetBrains All Products Pack subscribers get AI Pro bundled. Confirm current rates and student discounts at [jetbrains.com/ai](https://www.jetbrains.com/ai/).
$$,
 $$
- [JetBrains AI](https://www.jetbrains.com/ai/)
- [AI Assistant docs](https://www.jetbrains.com/help/ai-assistant)
- [Junie docs](https://www.jetbrains.com/help/junie)
- [Pricing](https://www.jetbrains.com/ai/buy)
- [Blog](https://blog.jetbrains.com/ai/)
- [YouTrack](https://youtrack.jetbrains.com/issues/LLM)
$$,
 'freemium','easy','5 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '7 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Limited completions",
        "Basic chat",
        "Included with any JetBrains IDE",
        "Personal use"
      ]
    },
    {
      "name": "AI Pro",
      "price": "$10",
      "period": "/mo",
      "highlight": true,
      "features": [
        "Full AI Assistant quota",
        "Junie multi-file agent",
        "Premium models",
        "Bundled free with All Products Pack"
      ],
      "cta": { "label": "Get AI Pro", "href": "https://www.jetbrains.com/ai/buy" }
    },
    {
      "name": "AI Ultimate",
      "price": "$20",
      "period": "/mo",
      "features": [
        "Highest monthly quota",
        "Priority model routing",
        "Advanced agent features",
        "Best for daily heavy use"
      ]
    },
    {
      "name": "Organization",
      "price": "Custom",
      "features": [
        "Centralised billing",
        "Admin controls",
        "License management",
        "Volume discounts"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 8 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Refactor with type-aware AI",
      "prompt": "Highlight a Java method, AI Assistant: 'extract to a service class and update all call sites'.",
      "steps": [
        "Use the JetBrains refactor pipeline",
        "AI proposes the rename and extraction",
        "Preview affected files before applying",
        "Run tests inside the same IDE"
      ],
      "outcome": "Type-safe refactor that respects every reference."
    },
    {
      "title": "Hand a ticket to Junie",
      "prompt": "Open Junie, paste a task: 'add CSV export to the report controller and a unit test'.",
      "steps": [
        "Junie reads the project model",
        "Plans the edits across files",
        "Streams the diff with explanations",
        "You approve and commit"
      ],
      "outcome": "Multi-file change shipped without leaving the IDE."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "First-party AI baked into the IDEs that already know your types and project structure better than any extension.",
    "best_for": ["Java, Kotlin, Python, and TypeScript teams", "Existing JetBrains shops", "Strongly-typed codebases"],
    "not_for": ["VS Code purists", "Teams that never touched a JetBrains IDE"],
    "typical_user": "Backend engineer at a Java or Kotlin shop who lives inside IntelliJ.",
    "signature_move": "AI that understands the project model, so refactors actually update every reference correctly."
  }$$::jsonb,
  popularity = 68
WHERE slug = 'jetbrains-ai';


-- ── 9. Sourcegraph Cody ──────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('sourcegraph-cody', 'Sourcegraph Cody', 'https://sourcegraph.com/cody',
 $$Code intelligence agent that reads your whole monorepo.$$,
 $$Cody pairs an editor extension with Sourcegraph's code graph. The graph indexes every repo in your org, so Cody can answer questions and write code grounded in code that lives far outside the file you have open. Strong for large monorepos and polyrepo organisations.$$,
 'clis',
 ARRAY['code-search','monorepo','enterprise','agent'],
 E':::os mac\n```bash\n# Install the Cody extension for VS Code or JetBrains\ncode --install-extension sourcegraph.cody-ai\n```\n:::\n:::os linux\n```bash\ncode --install-extension sourcegraph.cody-ai\n```\n:::\n:::os windows\n```powershell\ncode --install-extension sourcegraph.cody-ai\n```\n:::',
 E'- Install the Cody extension and sign in with a Sourcegraph account.\n- Point Cody at your Sourcegraph instance to enable cross-repo context.\n- Use the chat panel for questions that span multiple repositories.\n- Trigger inline edits via `Cmd+.` for scoped changes.\n- Cody Agent can run as a CLI for batch tasks and CI.',
 E'| Shortcut | Action |\n|---|---|\n| `Cmd+.` | Inline edit |\n| `Cmd+L` | Open Cody chat |\n| `@repo` | Add a repository as context |\n| `@symbol` | Pin a specific function or class |\n| `/edit` | Edit selection |\n| `cody-cli` | Use the agent from the terminal |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Personal use, single repo context, basic chat |
| Pro | $9/user/mo | Higher chat quota, premium models, agentic chat |
| Enterprise | $59/user/mo | Cross-repo context via Sourcegraph, SSO, audit, on-prem option |
| Enterprise Starter | $19/user/mo | Smaller orgs that still want cross-repo context |

Cody Enterprise unlocks Sourcegraph's full code graph. For monorepos and polyrepo orgs this is the differentiator. Confirm current rates at [sourcegraph.com/pricing](https://sourcegraph.com/pricing).
$$,
 $$
- [Sourcegraph Cody](https://sourcegraph.com/cody)
- [Pricing](https://sourcegraph.com/pricing)
- [Docs](https://sourcegraph.com/docs/cody)
- [Cody CLI](https://sourcegraph.com/docs/cody/cli)
- [Discord community](https://discord.gg/sourcegraph)
- [Blog](https://about.sourcegraph.com/blog)
$$,
 'freemium','medium','15 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '8 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "Personal use",
        "Single repo context",
        "Basic chat",
        "Limited monthly quota"
      ]
    },
    {
      "name": "Pro",
      "price": "$9",
      "period": "/user/mo",
      "highlight": true,
      "features": [
        "Higher chat and edit quota",
        "Premium models",
        "Agentic chat",
        "Single-repo context"
      ],
      "cta": { "label": "Try Pro", "href": "https://sourcegraph.com/pricing" }
    },
    {
      "name": "Enterprise Starter",
      "price": "$19",
      "period": "/user/mo",
      "features": [
        "Cross-repo context via Sourcegraph",
        "Smaller team minimum",
        "Centralised billing",
        "SSO on higher tiers"
      ]
    },
    {
      "name": "Enterprise",
      "price": "$59",
      "period": "/user/mo",
      "features": [
        "Full Sourcegraph code graph",
        "On-prem deployment option",
        "SSO and audit log",
        "Custom data residency"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 9 },
    { "axis": "price", "score": 7 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 7 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Ask a question across repos",
      "prompt": "Cody, where is the JWT signing key rotated across the org? @repo:platform @repo:auth-service",
      "steps": [
        "Cody queries the Sourcegraph code graph",
        "Pulls relevant snippets from many repos",
        "Synthesises a grounded answer with citations",
        "Click through to jump to each file"
      ],
      "outcome": "Cross-repo answer that no in-editor copilot can match."
    },
    {
      "title": "Run Cody Agent in CI",
      "prompt": "cody-cli 'audit every repo for hard-coded API keys and open issues where found'.",
      "steps": [
        "Wire cody-cli into a scheduled CI job",
        "Agent runs a defined task across the org",
        "Produces a report or opens issues automatically",
        "Logs land in your central observability"
      ],
      "outcome": "Org-wide audits and migrations without a human bottleneck."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Code intelligence agent that grounds answers in the entire org's source, not just the file in front of you.",
    "best_for": ["Monorepos", "Polyrepo orgs", "Cross-repo refactors and audits"],
    "not_for": ["Tiny single-repo projects", "Teams that do not pay for code search"],
    "typical_user": "Platform engineer at a 500-developer company who needs to find every caller of a deprecated API.",
    "signature_move": "Answers a question by pulling code from a dozen repositories you never opened."
  }$$::jsonb,
  popularity = 64
WHERE slug = 'sourcegraph-cody';


-- ── 10. Pieces for Developers ────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('pieces', 'Pieces for Developers', 'https://pieces.app',
 $$On-device memory layer for snippets and conversations.$$,
 $$Pieces is a long-term memory app for developers. The desktop client captures snippets, browser activity, chat conversations, and meeting transcripts, then makes them searchable and chat-ready offline. Local-first by design, with optional cloud sync, and a sane answer to the question "where did I see that code last Tuesday".$$,
 'productivity',
 ARRAY['memory','snippets','local-first','offline'],
 E':::os mac\n```bash\nbrew install --cask pieces-os pieces\n```\n:::\n:::os linux\n```bash\n# Download .deb or .rpm from https://pieces.app/install\n```\n:::\n:::os windows\n```powershell\nwinget install Pieces.Pieces\n```\n:::',
 E'- Install Pieces OS and the Pieces Desktop app.\n- Enable the Long-Term Memory engine and grant capture permissions.\n- Save snippets via the browser extension, IDE plugin, or right-click menu.\n- Open Pieces Copilot to chat over your saved context, offline.\n- Sync optionally across devices via end-to-end-encrypted cloud.',
 E'| Surface | Use it for |\n|---|---|\n| Desktop | Browse and search snippets |\n| Browser extension | Save code from any tab |\n| IDE plugins | Save and reuse from VS Code, JetBrains |\n| Copilot | Chat over your own memory |\n| LTM | Time-based context across apps |\n| Workstreams | Group memory by topic or project |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | Full local-first product, unlimited snippets, on-device models |
| Pro | $8/mo | Cloud sync across devices, premium models, longer history |
| Teams | $20/user/mo | Shared workstreams, admin controls, role-based access |
| Enterprise | Custom | SSO, audit log, self-hosted Pieces OS |

The free tier is unusually complete because the heavy lifting runs locally. Pay for sync, premium cloud models, and team features. Confirm current rates at [pieces.app/pricing](https://pieces.app/pricing).
$$,
 $$
- [Pieces website](https://pieces.app)
- [Pricing](https://pieces.app/pricing)
- [Docs](https://docs.pieces.app)
- [Discord community](https://discord.gg/getpieces)
- [Blog](https://pieces.app/blog)
- [GitHub organization](https://github.com/pieces-app)
$$,
 'freemium','easy','10 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '9 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "highlight": true,
      "features": [
        "Full local-first product",
        "Unlimited snippets",
        "On-device models",
        "Browser and IDE plugins"
      ],
      "cta": { "label": "Install Pieces", "href": "https://pieces.app" }
    },
    {
      "name": "Pro",
      "price": "$8",
      "period": "/mo",
      "features": [
        "Cloud sync across devices",
        "Premium cloud models",
        "Longer history retention",
        "Priority support"
      ]
    },
    {
      "name": "Teams",
      "price": "$20",
      "period": "/user/mo",
      "features": [
        "Shared workstreams",
        "Admin controls",
        "Role-based access",
        "Centralised billing"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "SAML SSO and audit",
        "Self-hosted Pieces OS",
        "Custom retention",
        "Dedicated support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 9 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Capture and reuse a snippet",
      "prompt": "Right-click a code block in the browser, Save to Pieces. Recall it later via Copilot.",
      "steps": [
        "Save from the browser extension or IDE",
        "Pieces tags language and topic automatically",
        "Search by content, tag, or workstream",
        "Insert into your editor via the plugin"
      ],
      "outcome": "Snippets you actually find again."
    },
    {
      "title": "Ask your own memory a question",
      "prompt": "Open Copilot: 'what was that postgres query I was working on yesterday around connection pooling?'.",
      "steps": [
        "Long-Term Memory grounds the answer in captured context",
        "Returns a snippet plus the source app and time",
        "Offline by default, on-device models",
        "Refine with follow-ups"
      ],
      "outcome": "Memory recall that beats hunting through tabs and chats."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Local-first second brain for developers that quietly captures what you saw and lets you ask about it later.",
    "best_for": ["Snippet hoarders", "Cross-app memory", "Offline-first workflows"],
    "not_for": ["Cloud-only purists", "Users who never reuse anything"],
    "typical_user": "Developer who keeps a snippets folder, a Notes app, and a dozen browser tabs of useful code.",
    "signature_move": "Runs entirely on your machine and answers 'where did I see that' questions without sending data anywhere."
  }$$::jsonb,
  popularity = 48
WHERE slug = 'pieces';


-- ── 11. Microsoft Loop ───────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('loop', 'Microsoft Loop', 'https://loop.microsoft.com',
 $$AI-powered collaborative workspace for Office users.$$,
 $$Loop is Microsoft's answer to Notion, Coda, and Google Docs in one. Components, pages, and workspaces stay in sync across Teams, Outlook, and Word. The Copilot integration drafts content, summarises pages, and turns meeting notes into structured plans. Best when your org already lives inside Microsoft 365.$$,
 'productivity',
 ARRAY['microsoft','copilot','collaboration','workspace'],
 E'Sign in at https://loop.microsoft.com with a Microsoft 365 account. Available as a web app, iOS, and Android. Loop components can also be inserted directly into Teams chat and Outlook.',
 E'- Open loop.microsoft.com and create a Workspace.\n- Add pages for projects, meeting notes, or planning docs.\n- Insert Loop components into Teams and Outlook to keep them in sync.\n- Trigger Copilot inside a page to draft, summarise, or restructure content.\n- Share workspaces with teammates and assign tasks inline.',
 E'| Action | Result |\n|---|---|\n| `/` | Insert block (table, task, voting, etc.) |\n| `@person` | Mention a teammate |\n| `@page` | Link another Loop page |\n| `/copilot` | Trigger Copilot inside the page |\n| Share | Send a Loop component into Teams chat |\n| Tasks | Assign and sync with Planner |',
 $$
## Plans

Loop is bundled with Microsoft 365 subscriptions. There is no standalone Loop tier.

| Tier | Price | What you get |
| --- | --- | --- |
| Microsoft 365 Personal | $9.99/mo | Loop with personal Copilot, included |
| Microsoft 365 Family | $12.99/mo | Loop for up to 6 people |
| Business Basic | $6/user/mo | Loop for teams, basic collaboration |
| Business Standard | $12.50/user/mo | Full Loop, Office apps, Teams |
| Copilot for Microsoft 365 | +$30/user/mo | AI drafting and summarisation inside Loop and the rest of Office |

The AI features only light up if your tenant has Copilot for Microsoft 365 enabled. Confirm current rates at [microsoft.com/microsoft-365/business/compare-all-plans](https://www.microsoft.com/microsoft-365/business/compare-all-plans).
$$,
 $$
- [Loop website](https://loop.microsoft.com)
- [Microsoft 365 plans](https://www.microsoft.com/microsoft-365)
- [Copilot for Microsoft 365](https://www.microsoft.com/microsoft-365/copilot)
- [Help center](https://support.microsoft.com/loop)
- [Roadmap](https://www.microsoft.com/microsoft-365/roadmap)
- [Tech community](https://techcommunity.microsoft.com/category/microsoft365/loop)
$$,
 'paid','easy','10 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '10 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Microsoft 365 Personal",
      "price": "$9.99",
      "period": "/mo",
      "features": [
        "Loop with personal Copilot",
        "Office apps included",
        "1 TB OneDrive",
        "Single user"
      ]
    },
    {
      "name": "Business Standard",
      "price": "$12.50",
      "period": "/user/mo",
      "highlight": true,
      "features": [
        "Full Loop for teams",
        "Office apps and Teams",
        "OneDrive and SharePoint",
        "Most common business tier"
      ],
      "cta": { "label": "Compare plans", "href": "https://www.microsoft.com/microsoft-365/business/compare-all-plans" }
    },
    {
      "name": "Copilot for Microsoft 365",
      "price": "+$30",
      "period": "/user/mo",
      "features": [
        "AI drafting and summarisation in Loop",
        "Same Copilot in Word, Excel, Teams",
        "Requires an underlying Microsoft 365 plan",
        "Tenant admin must enable"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom",
      "features": [
        "E3 or E5 licensing",
        "Advanced security and compliance",
        "Audit and DLP",
        "Volume agreements"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 7 },
    { "axis": "accuracy", "score": 7 },
    { "axis": "price", "score": 8 },
    { "axis": "ecosystem", "score": 9 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Plan a project with Copilot",
      "prompt": "Inside a new Loop page, /copilot 'draft a launch plan for the spring product update with milestones and owners'.",
      "steps": [
        "Copilot drafts a structured page",
        "Edit blocks inline, assign tasks to teammates",
        "Insert the page into Teams chat as a Loop component",
        "Updates sync wherever the component lives"
      ],
      "outcome": "Project plan that stays in sync across chat, email, and docs."
    },
    {
      "title": "Sync meeting notes into Outlook",
      "prompt": "Embed a Loop notes component in a Teams meeting; review later in Outlook.",
      "steps": [
        "Take notes in the meeting using the Loop component",
        "Copilot summarises the discussion and surfaces actions",
        "Open the same component from Outlook later",
        "Edits keep everything in sync, automatically"
      ],
      "outcome": "Single source of truth for meeting notes across Microsoft 365."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Microsoft's Notion competitor that wins by sitting where the work already happens, Teams and Outlook.",
    "best_for": ["Microsoft 365 shops", "Cross-app collaboration", "Teams that already hate context switching"],
    "not_for": ["Solo developers", "Orgs allergic to Microsoft licensing"],
    "typical_user": "Project manager at a mid-size company that runs on Office and Teams.",
    "signature_move": "Loop components live inside Teams chat and Outlook email, syncing wherever they appear."
  }$$::jsonb,
  popularity = 40
WHERE slug = 'loop';


-- ── 12. Magnific ─────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('magnific', 'Magnific', 'https://magnific.ai',
 $$AI image upscaler that hallucinates plausible detail.$$,
 $$Magnific is the upscaler designers reach for when they want texture, fabric weave, hair, and skin pores back from a fuzzy source image. You control how much detail it invents via the Creativity and HDR sliders. Now owned by Freepik and bundled with their broader creative suite.$$,
 'productivity',
 ARRAY['image','upscaler','design','freepik'],
 E'Sign up at https://magnific.ai or via https://freepik.com. Web only, no install. Iframe integrations exist for some design tools.',
 E'- Upload a source image at any resolution.\n- Choose an upscale factor (2x, 4x, 8x, 16x).\n- Tune Creativity (how much new detail to invent) and HDR.\n- Optionally describe the subject for better detail synthesis.\n- Download the upscaled output and use it commercially.',
 E'| Control | Effect |\n|---|---|\n| Scale | 2x, 4x, 8x, 16x output size |\n| Creativity | Higher invents more new detail |\n| HDR | Boosts dynamic range and texture |\n| Resemblance | Keeps output close to the original |\n| Prompt | Hints the subject to guide synthesis |\n| Style | Apply a finishing aesthetic |',
 $$
## Plans

Magnific is sold via the Freepik subscription, with a separate Magnific Pro tier for heavy use.

| Tier | Price | What you get |
| --- | --- | --- |
| Free trial | $0 | A few credits to try, watermark on output |
| Premium | $39/mo | 100 image credits, commercial use, no watermark |
| Pro | $99/mo | 500 credits, higher concurrency, priority queue |
| Premium+ | $299/mo | 5000 credits, fastest queue, team features |

Credit usage scales with output size and upscale factor. Confirm current rates at [magnific.ai/pricing](https://magnific.ai/pricing).
$$,
 $$
- [Magnific website](https://magnific.ai)
- [Pricing](https://magnific.ai/pricing)
- [Freepik](https://freepik.com)
- [Docs and FAQ](https://magnific.ai/faq)
- [X account](https://x.com/javilopen)
- [Showcase gallery](https://magnific.ai/showcase)
$$,
 'paid','easy','5 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '11 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free trial",
      "price": "$0",
      "features": [
        "A few trial credits",
        "Watermark on output",
        "Web only",
        "No commercial use"
      ]
    },
    {
      "name": "Premium",
      "price": "$39",
      "period": "/mo",
      "highlight": true,
      "features": [
        "100 image credits per month",
        "Commercial use",
        "No watermark",
        "All upscale factors"
      ],
      "cta": { "label": "Subscribe", "href": "https://magnific.ai/pricing" }
    },
    {
      "name": "Pro",
      "price": "$99",
      "period": "/mo",
      "features": [
        "500 credits per month",
        "Higher concurrency",
        "Priority queue",
        "Best for daily designers"
      ]
    },
    {
      "name": "Premium+",
      "price": "$299",
      "period": "/mo",
      "features": [
        "5000 credits per month",
        "Fastest queue",
        "Team features",
        "Bulk processing"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 6 },
    { "axis": "accuracy", "score": 9 },
    { "axis": "price", "score": 5 },
    { "axis": "ecosystem", "score": 6 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Upscale a hero image",
      "prompt": "Upload a 1024px hero photo, set 4x, Creativity medium, HDR low.",
      "steps": [
        "Upload the source",
        "Choose scale and tune sliders",
        "Add a short subject prompt",
        "Download the 4096px result"
      ],
      "outcome": "Print-ready hero image with believable detail."
    },
    {
      "title": "Recover detail from a blurry photo",
      "prompt": "Push Creativity high to reinvent texture in a soft phone snapshot of a product.",
      "steps": [
        "Upload the soft source",
        "Set Creativity high, Resemblance medium",
        "Generate and compare variants",
        "Pick the one that holds up at zoom"
      ],
      "outcome": "A usable hero from a previously unusable photo."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "The upscaler that designers send each other on Twitter when they want jaw-drop reactions.",
    "best_for": ["Hero images", "Product photography rescue", "Concept art finishing"],
    "not_for": ["Pixel-perfect forensics", "Outputs you cannot let the model invent detail into"],
    "typical_user": "Designer or marketer who needs a believable, high-resolution image yesterday.",
    "signature_move": "Pushes Creativity high and invents pores, fabric weave, and texture that look real."
  }$$::jsonb,
  popularity = 52
WHERE slug = 'magnific';


-- ── 13. Suno ─────────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('suno', 'Suno', 'https://suno.com',
 $$Generative AI music for any prompt.$$,
 $$Suno generates complete songs from a text prompt: lyrics, vocals, instruments, structure, the whole thing. It is the easiest way to get a believable demo or background track without touching a DAW. The model has its own audible aesthetic, but it is wide-ranging across genres and moods.$$,
 'productivity',
 ARRAY['music','audio','generative','vocals'],
 E'Sign in at https://suno.com with a Google, Discord, or Microsoft account. Web and mobile apps available. No install required for the basic experience.',
 E'- Open suno.com and type a prompt: "lo-fi hip hop about rainy Tuesdays".\n- Suno generates two song variants with lyrics and vocals.\n- Edit lyrics, change style tags, or remix sections.\n- Download as MP3 or WAV; clips are usable commercially on paid tiers.\n- Share to the in-app feed or export to your DAW.',
 E'| Control | Effect |\n|---|---|\n| Prompt | Genre, mood, instrumentation hint |\n| Style of music | Force a specific aesthetic |\n| Lyrics | Provide your own or let Suno write them |\n| Extend | Add another section to an existing song |\n| Remix | Branch a song into a variant |\n| Personas | Reuse a voice across multiple songs |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | 50 credits per day, non-commercial use only, public songs |
| Pro | $10/mo | 2500 credits per month, commercial use, private songs |
| Premier | $30/mo | 10,000 credits per month, faster queue, priority models |
| Teams | Custom | Multi-seat licensing for agencies and studios |

A song typically costs 5-10 credits. Yearly plans get a discount. Commercial use is unlocked on Pro and above. Confirm current rates at [suno.com/pricing](https://suno.com/pricing).
$$,
 $$
- [Suno website](https://suno.com)
- [Pricing](https://suno.com/pricing)
- [Help center](https://help.suno.com)
- [Discord community](https://discord.gg/suno-ai)
- [Blog](https://suno.com/blog)
- [X account](https://x.com/sunomusic)
$$,
 'freemium','easy','2 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '12 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "50 credits per day",
        "Non-commercial use only",
        "Songs are public",
        "Web and mobile"
      ]
    },
    {
      "name": "Pro",
      "price": "$10",
      "period": "/mo",
      "highlight": true,
      "features": [
        "2500 credits per month",
        "Commercial use",
        "Private songs",
        "Faster queue than free"
      ],
      "cta": { "label": "Try Pro", "href": "https://suno.com/pricing" }
    },
    {
      "name": "Premier",
      "price": "$30",
      "period": "/mo",
      "features": [
        "10,000 credits per month",
        "Priority models and queue",
        "Best for daily producers",
        "Yearly discount available"
      ]
    },
    {
      "name": "Teams",
      "price": "Custom",
      "features": [
        "Multi-seat licensing",
        "Agency and studio billing",
        "Shared credit pools",
        "Dedicated support"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 7 },
    { "axis": "ecosystem", "score": 6 },
    { "axis": "ease", "score": 10 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Prompt a full song",
      "prompt": "Indie-folk with a banjo and harmonica, about moving to a new city.",
      "steps": [
        "Type the prompt and pick a genre tag",
        "Suno generates two variants, around 2-3 minutes each",
        "Listen and pick the better take",
        "Download as MP3 or WAV"
      ],
      "outcome": "Complete, believable song in under a minute."
    },
    {
      "title": "Extend and remix a section",
      "prompt": "Take the bridge you like, hit Extend, write a chorus that calls back to it.",
      "steps": [
        "Select a section to extend",
        "Provide lyrics or let Suno write them",
        "Generate the new section",
        "Stitch the full track together"
      ],
      "outcome": "Custom structure tailored beyond the default form."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Prompt-to-song machine that hands you a finished track with vocals before you finish your coffee.",
    "best_for": ["Background music for videos", "Throwaway demos", "Songwriters brainstorming hooks"],
    "not_for": ["Polished, label-ready masters", "Strict copyright-clean releases without review"],
    "typical_user": "Content creator who needs an original soundtrack and does not want to license a stock library.",
    "signature_move": "Generates lyrics, vocals, and a full arrangement from a one-line genre prompt."
  }$$::jsonb,
  popularity = 56
WHERE slug = 'suno';


-- ── 14. Runway ───────────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('runway', 'Runway', 'https://runwayml.com',
 $$Frontier text-to-video and AI video editing.$$,
 $$Runway makes the frontier video models the industry actually uses on set: Gen-3 Alpha and the newer Gen-4 family. Beyond generation, the editor handles AI rotoscoping, inpainting, motion brush, and frame interpolation. Used in production by film, advertising, and music video teams.$$,
 'productivity',
 ARRAY['video','generative','editing','gen-4'],
 E'Sign in at https://runwayml.com. Web app, no install. iOS app available for capture and quick edits.',
 E'- Open runwayml.com and start a Generative session.\n- Pick Text to Video, Image to Video, or Video to Video.\n- Write a prompt; iterate with seeds and reference images.\n- Use the Editor for rotoscoping, inpainting, motion brush.\n- Export in 4K (paid tiers) and bring into your NLE.',
 E'| Tool | Use it for |\n|---|---|\n| Text to Video | Prompt-driven generation |\n| Image to Video | Animate a still |\n| Video to Video | Restyle existing footage |\n| Motion Brush | Direct specific movement |\n| Rotoscoping | AI green-screen any subject |\n| Frame Interpolation | Smooth or slow-mo |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Basic | $0 | 125 one-time credits, watermarked output, 720p |
| Standard | $15/mo | 625 credits/mo, no watermark, faster generations |
| Pro | $35/mo | 2250 credits/mo, longer videos, 4K export |
| Unlimited | $95/mo | Unlimited slow-queue generations, Pro features |
| Enterprise | Custom | API access, dedicated capacity, custom licensing |

A short generation can run 5-25 credits depending on model, resolution, and length. Confirm current rates at [runwayml.com/pricing](https://runwayml.com/pricing).
$$,
 $$
- [Runway website](https://runwayml.com)
- [Pricing](https://runwayml.com/pricing)
- [Academy and tutorials](https://academy.runwayml.com)
- [API docs](https://docs.dev.runwayml.com)
- [Showcase](https://runwayml.com/showcase)
- [Blog](https://runwayml.com/blog)
$$,
 'freemium','medium','15 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '13 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Basic",
      "price": "$0",
      "features": [
        "125 one-time credits",
        "Watermarked output",
        "720p resolution",
        "Try every tool"
      ]
    },
    {
      "name": "Standard",
      "price": "$15",
      "period": "/mo",
      "features": [
        "625 credits per month",
        "No watermark",
        "Faster generations",
        "Most editor tools"
      ]
    },
    {
      "name": "Pro",
      "price": "$35",
      "period": "/mo",
      "highlight": true,
      "features": [
        "2250 credits per month",
        "Longer videos",
        "4K export",
        "Best balance for daily work"
      ],
      "cta": { "label": "Try Pro", "href": "https://runwayml.com/pricing" }
    },
    {
      "name": "Unlimited",
      "price": "$95",
      "period": "/mo",
      "features": [
        "Unlimited slow-queue generations",
        "All Pro features",
        "Best for heavy production",
        "Yearly discount available"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 6 },
    { "axis": "accuracy", "score": 8 },
    { "axis": "price", "score": 5 },
    { "axis": "ecosystem", "score": 7 },
    { "axis": "ease", "score": 8 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Generate a cinematic clip",
      "prompt": "Slow dolly through a foggy pine forest at dawn, anamorphic, 35mm grain.",
      "steps": [
        "Pick Text to Video and the Gen-4 model",
        "Tune duration, aspect ratio, and seed",
        "Generate two or three variants",
        "Export in 4K on Pro"
      ],
      "outcome": "Short cinematic shot ready to drop into a cut."
    },
    {
      "title": "Restyle a smartphone clip",
      "prompt": "Upload phone footage and prompt 'turn this into a watercolour animation'.",
      "steps": [
        "Choose Video to Video",
        "Upload the source and write a style prompt",
        "Generate and review variants",
        "Cut into a final edit"
      ],
      "outcome": "Stylised version of real footage without rotoscoping by hand."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Frontier video models packaged with a real editor that production crews actually ship cuts from.",
    "best_for": ["Short cinematic clips", "Restyling footage", "AI rotoscoping and inpainting"],
    "not_for": ["Feature-length narrative", "Tight budgets on a high-volume pipeline"],
    "typical_user": "Director, ad creative, or music video editor reaching for AI shots inside a real production timeline.",
    "signature_move": "Generates a believable cinematic clip from a prompt, then lets you rotoscope and re-cut it in the same tab."
  }$$::jsonb,
  popularity = 62
WHERE slug = 'runway';


-- ── 15. ElevenLabs ───────────────────────────────────────────────────────────

INSERT INTO tools (slug, title, url, tagline, description, category, tags, install_md, usage_md, cheatsheet_md, pricing_md, resources_md, pricing, difficulty, time_to_value, status, is_curated, submitter, last_verified, created_at, approved_at) VALUES
('elevenlabs', 'ElevenLabs', 'https://elevenlabs.io',
 $$Production-grade AI voice synthesis and cloning.$$,
 $$ElevenLabs sets the bar for AI voice in 2026. The text-to-speech models produce voices that hold up next to professional VO, with controls for emotion, pacing, and accent. Voice cloning lets you reuse a single take across an entire project. Strong API for product integrations, plus Studio for long-form narration.$$,
 'productivity',
 ARRAY['voice','tts','audio','cloning','api'],
 E'Sign up at https://elevenlabs.io. Web app and full API. SDKs for Python and TypeScript.\n\n:::pkg npm\n```bash\nnpm install elevenlabs\n```\n:::',
 E'- Sign in at elevenlabs.io.\n- Pick a stock voice or clone your own from a 1-minute sample.\n- Paste text in Studio and adjust stability, similarity, and style sliders.\n- Generate, preview, and re-roll segments as needed.\n- Export as MP3, WAV, or PCM; or call the API from your app.',
 E'| Surface | Use it for |\n|---|---|\n| Speech Synthesis | One-shot TTS from text |\n| Studio | Long-form narration with chapters |\n| Voice Library | Stock and community voices |\n| Voice Lab | Clone or design a custom voice |\n| Dubbing | Translate and re-voice video |\n| API | Stream TTS into your product |',
 $$
## Plans

| Tier | Price | What you get |
| --- | --- | --- |
| Free | $0 | 10,000 characters/mo, watermarked, 3 custom voices |
| Starter | $5/mo | 30,000 characters/mo, commercial use, no watermark |
| Creator | $22/mo | 100,000 characters/mo, professional cloning, higher quality |
| Pro | $99/mo | 500,000 characters/mo, 192kbps audio, priority API |
| Scale | $330/mo | 2M characters/mo, dedicated capacity, team features |
| Enterprise | Custom | Higher volumes, SSO, custom commercial terms |

Per-character pricing applies in the API for high-volume use. Confirm current rates and concurrency limits at [elevenlabs.io/pricing](https://elevenlabs.io/pricing).
$$,
 $$
- [ElevenLabs website](https://elevenlabs.io)
- [Pricing](https://elevenlabs.io/pricing)
- [Docs](https://elevenlabs.io/docs)
- [API reference](https://elevenlabs.io/docs/api-reference)
- [Voice Library](https://elevenlabs.io/voice-library)
- [Discord community](https://discord.gg/elevenlabs)
$$,
 'freemium','easy','5 min','approved',TRUE,'ai.tools',NOW(),NOW() + INTERVAL '14 seconds',NOW())
ON CONFLICT (slug) DO NOTHING;

UPDATE tools SET
  pricing_tiers = $$[
    {
      "name": "Free",
      "price": "$0",
      "features": [
        "10,000 characters per month",
        "Watermarked output",
        "3 custom voices",
        "Try every voice in the library"
      ]
    },
    {
      "name": "Creator",
      "price": "$22",
      "period": "/mo",
      "highlight": true,
      "features": [
        "100,000 characters per month",
        "Professional voice cloning",
        "Higher quality audio",
        "Commercial use included"
      ],
      "cta": { "label": "Try Creator", "href": "https://elevenlabs.io/pricing" }
    },
    {
      "name": "Pro",
      "price": "$99",
      "period": "/mo",
      "features": [
        "500,000 characters per month",
        "192kbps audio",
        "Priority API",
        "Best for podcasts and audiobooks"
      ]
    },
    {
      "name": "Scale",
      "price": "$330",
      "period": "/mo",
      "features": [
        "2M characters per month",
        "Dedicated capacity",
        "Team features",
        "SLA-backed throughput"
      ]
    }
  ]$$::jsonb,
  strengths = $$[
    { "axis": "speed", "score": 9 },
    { "axis": "accuracy", "score": 9 },
    { "axis": "price", "score": 7 },
    { "axis": "ecosystem", "score": 8 },
    { "axis": "ease", "score": 9 }
  ]$$::jsonb,
  workflows = $$[
    {
      "title": "Narrate an article in your own voice",
      "prompt": "Clone your voice from a 1-minute sample, paste a 2000-word article, generate the narration.",
      "steps": [
        "Record a clean voice sample in Voice Lab",
        "Run the clone job and preview a test line",
        "Paste the article and tune stability and style sliders",
        "Export the WAV and publish"
      ],
      "outcome": "Personal voice narration without a studio booking."
    },
    {
      "title": "Stream TTS in a product",
      "prompt": "POST to /v1/text-to-speech with your text and voice id, stream the response into the browser.",
      "steps": [
        "Get an API key from the dashboard",
        "Use the streaming endpoint",
        "Pipe audio chunks into the Web Audio API",
        "Watch usage in the dashboard"
      ],
      "outcome": "Low-latency voice in your app, billed per character."
    },
    {
      "title": "Dub a video into another language",
      "prompt": "Upload an English explainer, target Spanish, keep the speaker identity.",
      "steps": [
        "Open Dubbing in the dashboard",
        "Upload the source video",
        "Pick the target language and tune translation",
        "Download the re-voiced edit"
      ],
      "outcome": "Same speaker, new language, in minutes."
    }
  ]$$::jsonb,
  tool_dna = $${
    "vibe": "Production-grade AI voice that holds up next to a booth take, with cloning and a real API for products.",
    "best_for": ["Podcasts and audiobooks", "Localisation and dubbing", "In-product narration"],
    "not_for": ["Strict no-AI-voice contexts", "Pranks or impersonation, banned by ToS"],
    "typical_user": "Creator or product team that needs reliable, expressive voice at scale.",
    "signature_move": "Clones a voice from a minute of audio, then sounds like that person reading a novel."
  }$$::jsonb,
  popularity = 60
WHERE slug = 'elevenlabs';
