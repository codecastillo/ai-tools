// Curated prompt library. Each prompt has a body you can copy into any AI tool
// plus an optional best_tool slug for deep linking.

export type PromptCategory =
  | 'refactor'
  | 'debug'
  | 'review'
  | 'docs'
  | 'tests'
  | 'agents'
  | 'rag'
  | 'product'
  | 'learning';

export interface Prompt {
  slug: string;
  title: string;
  category: PromptCategory;
  body: string;
  best_tool?: string;
  why: string;
}

export const PROMPTS: Prompt[] = [
  {
    slug: 'refactor-class-to-hooks',
    title: 'Refactor a React class component to hooks',
    category: 'refactor',
    best_tool: 'claude-code',
    why: 'Mechanical migrations are where coding agents shine, fast and accurate.',
    body: `Refactor this React class component to a functional component with hooks.

Preserve:
- All prop types and default values
- Lifecycle behavior (componentDidMount becomes useEffect with empty deps, etc.)
- Internal state shape (use useState or useReducer based on complexity)

After refactoring:
- Update the call sites only if the public API changes
- Show me a unified diff
- List any subtle behavior changes you made

Code:
[paste the class component]`,
  },
  {
    slug: 'find-the-bug',
    title: 'Find the bug from a stack trace',
    category: 'debug',
    best_tool: 'cursor',
    why: 'Pulls in your codebase, walks the stack, suggests the smallest fix.',
    body: `I have this error:

[paste error + stack trace]

The relevant file is [path]. Please:
1. Identify the root cause (not just the line that threw).
2. Show me the smallest patch that fixes it.
3. Tell me whether this bug has likely been hiding in other call sites.
4. Suggest a test that would have caught it.`,
  },
  {
    slug: 'pr-self-review',
    title: 'Pre-PR self review',
    category: 'review',
    best_tool: 'claude-code',
    why: 'A second pair of eyes before you push. Catches taste issues and bugs.',
    body: `Review the staged changes in this repo as if you were a senior engineer doing code review.

For each notable observation, give:
- Severity (critical, major, minor, style)
- File and line range
- What's wrong
- A specific suggested rewrite

Do not just point out lint, focus on correctness, security, performance, and clarity. Ignore formatting nits.

Also flag anything that should have a test but does not.`,
  },
  {
    slug: 'function-jsdoc',
    title: 'Generate JSDoc for a function',
    category: 'docs',
    why: 'Useful for shared utility files. Add the doc comment without changing behavior.',
    body: `Add a JSDoc comment above this function. Include:
- One sentence summary
- @param for each argument, with types and meaning
- @returns
- @throws if applicable
- @example with a realistic call

Do not change the function body.

[paste function]`,
  },
  {
    slug: 'unit-tests-edge-cases',
    title: 'Write unit tests, including edge cases',
    category: 'tests',
    best_tool: 'aider',
    why: 'Aider commits each test file as its own git commit, easy to review.',
    body: `Write unit tests for this function using [vitest|jest|pytest].

Cover:
- The happy path with a typical input
- Each documented edge case
- Boundary values (empty, max, negative if numeric)
- Invalid input (wrong type, null) and the expected error
- One realistic regression scenario

Name tests so the describe + it block reads as a sentence.

[paste function + its signature]`,
  },
  {
    slug: 'design-an-agent',
    title: 'Scaffold an agent for a narrow task',
    category: 'agents',
    best_tool: 'claude-agent-sdk',
    why: 'Anthropic SDK is the cleanest agent loop primitive.',
    body: `Design an agent that does: [one-line goal].

Constraints:
- Must use only these tools: [list]
- Max iterations: 8
- Must produce a structured JSON output matching this schema: [paste schema]
- Fail gracefully if a tool call errors twice in a row

Output:
1. A system prompt that defines the role and rules
2. The tool definitions as JSON schema
3. The agent loop pseudocode
4. The success and failure exit conditions`,
  },
  {
    slug: 'rag-eval-harness',
    title: 'Build a RAG eval harness',
    category: 'rag',
    best_tool: 'llamaindex',
    why: 'LlamaIndex has the cleanest data ingestion + eval primitives for RAG.',
    body: `Set up a RAG evaluation harness for the following retrieval task:

Source corpus: [describe]
Query set: [N questions or pointer to a file]
Ground truth: [how truth is encoded]

Implement:
1. Ingestion pipeline (chunk strategy, embedding model, index choice)
2. Retriever (top-k, reranker if applicable)
3. Generator wrapped with the retrieved chunks
4. Metrics: faithfulness, answer relevance, context precision and recall
5. A regression script I can run on every prompt change

Use cheap, fast models for the eval judge (gpt-5-nano or haiku 4) and log per-question diffs to a file.`,
  },
  {
    slug: 'prd-from-rough-notes',
    title: 'Turn rough notes into a PRD',
    category: 'product',
    best_tool: 'chatgpt',
    why: 'Conversational chat is good for messy ideas. Iterate before committing.',
    body: `Here are my rough notes on a feature: [paste].

Produce a one page PRD with:
- Problem statement (who hurts, when, how often)
- Goal in one sentence
- Non-goals (3 to 5)
- User story for the primary persona
- 3 to 5 acceptance criteria, testable
- Open questions, ranked by how much they block design

Keep it under 400 words. No fluff. Be specific.`,
  },
  {
    slug: 'explain-this-codebase',
    title: 'Explain this codebase to a new hire',
    category: 'learning',
    best_tool: 'cursor',
    why: 'Cursor reads the repo and produces a useful map without your help.',
    body: `Pretend I am a new engineer on the team and I just cloned this repo.

Walk me through:
1. The top-level folder structure, with one line per folder
2. The entry points (where execution starts)
3. The 5 most important files and what each one is responsible for
4. The data flow on a typical request
5. The non-obvious conventions (naming, file size limits, when to add a new module)
6. Common gotchas

Keep total output under 800 words. Use a real example for each step where you can.`,
  },
  {
    slug: 'sql-from-question',
    title: 'Write a SQL query from a plain English question',
    category: 'product',
    why: 'Pair this with a tool that knows your schema and you save real time.',
    body: `Given this schema:
[paste DDL or table descriptions]

Write a Postgres query that answers: [question in plain English].

Requirements:
- Use CTEs where they aid readability
- Use parameterized inputs not literals
- Include an EXPLAIN guess for which indexes would be hit
- If the question is ambiguous, return the query for the most likely interpretation AND list the alternatives at the bottom

Do not invent tables. If you need one that does not exist, ask.`,
  },
  {
    slug: 'reduce-prompt-cost',
    title: 'Audit a prompt for cost and clarity',
    category: 'refactor',
    why: 'Prompts grow over time. Pruning is a fast cost win without losing accuracy.',
    body: `Audit this prompt for cost and clarity:

[paste prompt]

Tell me:
1. Word count, estimated token count
2. Which sentences are doing real work and which are decorative
3. Sections that should be in a system prompt cached prefix vs the user turn
4. Examples that could be removed without losing accuracy
5. A rewritten version that is at least 30 percent shorter while preserving the same output behavior

Score the rewrite confidence 0 to 10 and explain what could go wrong.`,
  },
  {
    slug: 'sql-injection-audit',
    title: 'Security audit a route handler',
    category: 'review',
    why: 'AI is great at spotting OWASP patterns. Always pair with human review.',
    body: `Audit this route handler for OWASP top 10 vulnerabilities.

[paste handler]

For each finding:
- Vulnerability name and link to OWASP page
- Concrete attack scenario
- Affected lines
- Recommended fix
- Severity (critical, high, medium, low)

If you find nothing, list the categories you checked so I can verify your work.`,
  },
  {
    slug: 'changelog-from-commits',
    title: 'Generate a changelog from git commits',
    category: 'docs',
    why: 'Cleans messy commit history into something a user can read.',
    body: `Here is the git log between two versions:

[paste git log]

Generate a user facing changelog:
- Grouped by Added, Changed, Fixed, Removed, Security
- One line per entry, written from the user's perspective (not the engineer's)
- Skip internal refactors that have no user impact
- Highlight breaking changes at the top of the file

Output as markdown ready to drop into CHANGELOG.md.`,
  },
  {
    slug: 'api-contract-from-types',
    title: 'Generate an API contract from TypeScript types',
    category: 'docs',
    why: 'Keeps your client and server schemas in lockstep automatically.',
    body: `Given these TypeScript types:

[paste types]

Generate:
1. A REST API contract (OpenAPI 3.1 YAML) for endpoints that produce or consume these types. Infer reasonable paths and verbs.
2. Example request and response bodies
3. Error response shapes
4. A short curl example per endpoint

Use shared components for repeated shapes.`,
  },
  {
    slug: 'refactor-fat-controller',
    title: 'Break a fat controller into thinner units',
    category: 'refactor',
    why: 'Forces you to name responsibilities before shipping the refactor.',
    body: `This controller has grown too big:

[paste file]

Plan a refactor:
1. List every responsibility in the file (verbs, not nouns)
2. Group them by concern (validation, business logic, persistence, formatting, dispatch)
3. Propose the new file split, with each new file's public API
4. Identify any tests that need to move with each chunk
5. Sequence the moves so the codebase is shippable after each step

Do not write any code yet. I want the plan first.`,
  },
  {
    slug: 'pair-on-an-algorithm',
    title: 'Pair program on a hard algorithm',
    category: 'learning',
    why: 'Treat the model as a forcing function to slow down and think.',
    body: `I am working on this algorithm problem:

[paste problem statement]

Be my pair. Do not give me the answer. Instead:
1. Ask me clarifying questions about the input shape and constraints
2. After I answer, suggest a brute force solution and ask me to critique it
3. Ask me what the next simplification would be
4. When I propose an approach, point out invariants I might be missing
5. Only write code if I explicitly ask for it

Goal is for me to learn, not to get the answer fast.`,
  },
  {
    slug: 'incident-postmortem',
    title: 'Write an incident postmortem',
    category: 'product',
    why: 'Forces structure on hot moments, easy to skip without a template.',
    body: `I have rough incident notes:

[paste notes, including timeline, who was paged, what was tried]

Produce a blameless postmortem with:
- One sentence summary
- Impact (who, how many, how long, what they saw)
- Timeline with timestamps
- Root cause (not the trigger, the underlying issue)
- Contributing factors (3 to 5)
- What worked well in the response
- Action items, each with an owner and a deadline

Tone: factual, not finger pointing. Engineers will read this on the next incident.`,
  },
  {
    slug: 'mcp-server-scaffold',
    title: 'Scaffold a new MCP server',
    category: 'agents',
    best_tool: 'mcp-servers',
    why: 'Hooks any agent up to a new tool surface with one command.',
    body: `Scaffold a new MCP server that exposes [thing] to AI agents.

Capabilities:
- [list 3 to 5 tools the server should provide]

For each tool, give:
- The JSON schema for input
- The Python or TypeScript handler signature
- Auth and rate limit considerations

Include:
- The MCP server boilerplate (transport, list_tools, call_tool)
- A README with one curl example using mcp-cli or claude --mcp
- A docker-compose entry so I can run it locally`,
  },
  {
    slug: 'explain-error-message',
    title: 'Explain a cryptic error message',
    category: 'debug',
    why: 'Decoder ring for "What does this even mean."',
    body: `Decode this error:

[paste error]

Tell me:
1. What component is throwing (the library, framework, runtime)
2. What the message actually means in plain English
3. The most common causes (top 3)
4. How to reproduce it locally
5. The single best diagnostic command or log line to add next`,
  },
  {
    slug: 'design-doc-skeleton',
    title: 'Draft a design doc skeleton',
    category: 'product',
    why: 'Most blocks are blank page paralysis. This gets you over the hump.',
    body: `Skeleton for a design doc on: [feature name].

Sections to include:
- Context (why now, who is asking, the user problem)
- Goals and non goals
- Proposed approach (sketch only)
- Alternatives considered (3, with one-line tradeoffs)
- Open questions (5)
- Rollout plan
- Risk register

For each section, write ONE seed sentence to unblock me. I will fill in the rest.`,
  },
  {
    slug: 'extract-types-from-json',
    title: 'Derive types from a JSON payload',
    category: 'refactor',
    why: 'Saves 5 minutes per integration, and the types are usually right.',
    body: `Given this example JSON payload:

[paste sample]

Generate:
1. TypeScript types (interface or type, your call) representing the shape
2. A zod schema (or pydantic if the project is Python)
3. Notes on which fields could be optional or nullable based on real-world variations`,
  },
  {
    slug: 'tutor-a-concept',
    title: 'Tutor me on an unfamiliar concept',
    category: 'learning',
    why: 'Adaptive teaching beats reading docs cold.',
    body: `Teach me [concept] like I have solid programming experience but zero exposure to this topic.

Format:
1. One sentence definition
2. The mental model an experienced practitioner uses
3. A concrete code example, runnable
4. Three common misconceptions
5. A practice problem I can solve in 10 minutes
6. Where to go next (1 book, 1 paper, 1 talk)`,
  },
  {
    slug: 'review-a-prompt',
    title: 'Critique my prompt before I ship it',
    category: 'review',
    why: 'Prompts are code. Code reviews catch silliness.',
    body: `Critique this prompt the way you would a code review:

[paste prompt]

For each issue:
- Severity (blocker, major, minor)
- Why it is a problem (with an example failure)
- A specific rewrite

Then suggest one structural change that would make the prompt easier to maintain over time.`,
  },
  {
    slug: 'find-dead-code',
    title: 'Find dead code in a module',
    category: 'refactor',
    why: 'Static analysis tools miss dynamic uses. AI catches the in-between cases.',
    body: `Look at this module:

[paste file]

Identify:
1. Functions that are never called from within this file or the wider repo
2. Imports that are not actually used
3. Variables initialized but never read
4. Branches that are unreachable

For each finding, show how you confirmed (e.g. "grep returned 0 matches for X in src/").

Then propose the deletions in dependency order so the codebase stays green at each step.`,
  },
  {
    slug: 'commit-message-from-diff',
    title: 'Write a Conventional Commit from a diff',
    category: 'docs',
    why: 'Faster than thinking about whether it is a feat or fix.',
    body: `Given this diff:

[paste git diff]

Write a Conventional Commit message:
- type(scope): subject (50 chars max, imperative)
- Blank line
- Body explaining the WHY in 1 to 3 short paragraphs

If the change is large enough to need multiple commits, propose how to split it.`,
  },
  {
    slug: 'simplify-this-code',
    title: 'Simplify this code without changing behavior',
    category: 'refactor',
    why: 'Forces objective comparison, line count + complexity before and after.',
    body: `Simplify this code while keeping its behavior identical:

[paste code]

Before you write, give me your plan: which abstractions you would remove, which you would add, what would stay the same.

Then show:
- Original line count
- Refactored line count
- Cyclomatic complexity estimate before and after
- The refactored code

Do not rename public functions. Do not change external behavior.`,
  },
  {
    slug: 'red-team-the-feature',
    title: 'Red team a feature design',
    category: 'review',
    why: 'Catches design flaws before they ship to users.',
    body: `Red team this feature design:

[paste design]

Try to break it. For each attack:
1. The angle (security, abuse, edge case, scale)
2. The exact scenario, step by step
3. What breaks
4. How to mitigate before launch

End with the top 3 risks you would actually lose sleep over.`,
  },
  {
    slug: 'integration-from-docs',
    title: 'Integrate against a third party API from docs',
    category: 'product',
    why: 'Cuts integration time from a day to an hour when the docs are good.',
    body: `I want to integrate with [API name]. Here are the docs: [paste or link].

Produce:
1. A minimal end-to-end example in [language]
2. Required environment variables and where to get them
3. Auth flow explanation
4. The 5 most common errors and how to handle each
5. Rate limit and retry guidance
6. A wrapper module exposing a clean internal API

Pin the SDK version you used.`,
  },
  {
    slug: 'test-flaky-explain',
    title: 'Diagnose a flaky test',
    category: 'debug',
    why: 'Flaky tests are often timing or shared-state bugs the model can spot.',
    body: `This test is flaky:

[paste test code]

It fails [N%] of the time with [error or no error].

Diagnose:
1. Sources of nondeterminism in the test (timing, shared state, random seeds, network)
2. The most likely root cause based on the failure mode
3. A specific fix that makes it deterministic
4. How to assert the fix actually worked (e.g. run 100 times in CI)`,
  },
  {
    slug: 'one-pager-from-thesis',
    title: 'Distill a paper to a one pager',
    category: 'learning',
    why: 'Faster than reading the abstract. Calibrated to engineering audience.',
    body: `Summarize this paper for an engineer who needs to ship something inspired by it:

[paste paper or link]

One page:
1. Problem and why it matters (3 sentences)
2. Key idea in plain English (3 sentences)
3. The exact method, no jargon (5 to 8 bullets)
4. Results that matter
5. Implementation hints (what's hard, what's easy)
6. Open questions the paper does not answer`,
  },
  {
    slug: 'monorepo-bootstrap',
    title: 'Bootstrap a monorepo',
    category: 'product',
    why: 'Skips 2 hours of yak shaving. Modify to taste.',
    body: `Bootstrap a monorepo with these packages: [list].

Constraints:
- Package manager: [pnpm or bun]
- Tooling: TypeScript strict, eslint, prettier, vitest
- Shared config in packages/config
- One published package, one app
- Turborepo or Nx (your pick, justify)

Output:
1. Folder tree
2. package.json files
3. turbo.json or nx.json
4. tsconfig with project references
5. A README explaining how to add a new package`,
  },
];

export const PROMPT_CATEGORY_LABEL: Record<PromptCategory, string> = {
  refactor: 'Refactor',
  debug: 'Debug',
  review: 'Review',
  docs: 'Docs',
  tests: 'Tests',
  agents: 'Agents',
  rag: 'RAG',
  product: 'Product',
  learning: 'Learning',
};

export function promptsByCategory(): Record<PromptCategory, Prompt[]> {
  const out = {} as Record<PromptCategory, Prompt[]>;
  for (const p of PROMPTS) {
    (out[p.category] ??= []).push(p);
  }
  return out;
}
