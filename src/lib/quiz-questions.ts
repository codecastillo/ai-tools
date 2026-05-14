export interface QuizQuestion {
  id: string;
  source: 'glossary' | 'tools' | 'pricing' | 'general';
  prompt: string;
  choices: [string, string, string, string];
  answer: number; // 0..3 index into choices
  explainer?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- Glossary (definitions of terms) -------------------------------------
  {
    id: 'rag-1',
    source: 'glossary',
    prompt: 'What does RAG stand for?',
    choices: [
      'Recursive Attention Graph',
      'Retrieval Augmented Generation',
      'Reinforced Action Guidance',
      'Reactive AI Gateway',
    ],
    answer: 1,
    explainer:
      'RAG is Retrieval Augmented Generation, the pattern of fetching docs then asking the model to answer using only that context.',
  },
  {
    id: 'llm-1',
    source: 'glossary',
    prompt: 'What does LLM stand for?',
    choices: [
      'Linear Logic Module',
      'Long Latency Memory',
      'Large Language Model',
      'Layered Learning Machine',
    ],
    answer: 2,
    explainer:
      'A Large Language Model is a neural network trained on huge corpora of text to predict the next token.',
  },
  {
    id: 'token-1',
    source: 'glossary',
    prompt: 'What is a token in the context of LLMs?',
    choices: [
      'A chunk of text that the model reads or writes, often a word fragment',
      'A unit of currency used to pay for API access',
      'A security credential for authentication',
      'A single character of input',
    ],
    answer: 0,
    explainer:
      'Tokens are sub-word fragments. Most English words are one or two tokens; punctuation and whitespace count too.',
  },
  {
    id: 'context-1',
    source: 'glossary',
    prompt: 'What is the "context window" of a model?',
    choices: [
      'The number of users it can serve at once',
      'The amount of training data it has seen',
      'The maximum tokens it can read and write in one call',
      'The temperature setting for sampling',
    ],
    answer: 2,
    explainer:
      'The context window is the hard limit on tokens (input plus output) that fit in a single request.',
  },
  {
    id: 'temp-1',
    source: 'glossary',
    prompt: 'What does the temperature parameter control?',
    choices: [
      'How fast the model runs',
      'How much it costs per call',
      'The maximum length of the response',
      'The randomness of the model output',
    ],
    answer: 3,
    explainer:
      'Lower temperature gives more deterministic output; higher temperature gives more variety.',
  },
  {
    id: 'embed-1',
    source: 'glossary',
    prompt: 'What is a vector embedding?',
    choices: [
      'A compressed image format',
      'A numeric array that represents the meaning of a piece of content',
      'A type of database index',
      'A prompt template',
    ],
    answer: 1,
    explainer:
      'An embedding maps text or other media to a fixed-length numeric vector so similar items end up near each other.',
  },
  {
    id: 'fine-tune-1',
    source: 'glossary',
    prompt: 'What is fine-tuning?',
    choices: [
      'Tweaking a prompt until it works',
      'Lowering the temperature toward zero',
      'Continuing the training of a pretrained model on a smaller, specific dataset',
      'Routing requests across providers',
    ],
    answer: 2,
    explainer:
      'Fine-tuning adapts a base model to a domain or style by training further on curated examples.',
  },
  {
    id: 'system-prompt-1',
    source: 'glossary',
    prompt: 'What is a system prompt?',
    choices: [
      'The instructions that frame the assistant before the user message',
      'The error message a model returns on failure',
      'The hardware spec the model runs on',
      'The OS-level prompt in a shell',
    ],
    answer: 0,
    explainer:
      'A system prompt sets the persona, rules, and goals for the assistant for the duration of the chat.',
  },
  {
    id: 'hallucinate-1',
    source: 'glossary',
    prompt: 'In the LLM world, what is a "hallucination"?',
    choices: [
      'A successful image generation',
      'A new training run',
      'Output that is fluent but factually wrong',
      'A safety refusal',
    ],
    answer: 2,
    explainer:
      'Hallucinations are confident, plausible-sounding outputs that are simply false.',
  },
  {
    id: 'agent-1',
    source: 'glossary',
    prompt: 'What is an "agent" in modern AI terminology?',
    choices: [
      'A web crawler',
      'A model that supports streaming',
      'A type of safety filter',
      'An LLM that runs in a loop, calling tools and making decisions toward a goal',
    ],
    answer: 3,
    explainer:
      'Agents are LLMs in a loop with tool access, deciding their next action until a goal is met or a stop condition fires.',
  },
  {
    id: 'tool-call-1',
    source: 'glossary',
    prompt: 'What is "tool calling" (or function calling)?',
    choices: [
      'When a model invokes a defined function and the host runs it',
      'When two models talk to each other',
      'When you pay extra for a feature',
      'When a model refuses to answer',
    ],
    answer: 0,
    explainer:
      'Tool calling lets the model emit a structured request to run a function, the host executes it, and the result is returned to the model.',
  },
  {
    id: 'mcp-1',
    source: 'glossary',
    prompt: 'What does MCP stand for?',
    choices: [
      'Multi-Cloud Pipeline',
      'Model Context Protocol',
      'Machine Compute Plane',
      'Modular Compiler Pass',
    ],
    answer: 1,
    explainer:
      'Model Context Protocol is an open standard from Anthropic for connecting models to tools and data sources.',
  },
  {
    id: 'prompt-eng-1',
    source: 'glossary',
    prompt: 'What is prompt engineering?',
    choices: [
      'Designing CPUs for LLM inference',
      'Training a new base model',
      'The craft of structuring inputs to get reliable model outputs',
      'Compressing prompts for cheaper inference',
    ],
    answer: 2,
    explainer:
      'Prompt engineering is iterating on instructions, examples, and structure to make a model behave the way you want.',
  },
  {
    id: 'cot-1',
    source: 'glossary',
    prompt: 'What does "chain of thought" mean?',
    choices: [
      'A model showing its step-by-step reasoning before the final answer',
      'A chained API call across providers',
      'A retry mechanism for failed calls',
      'A workflow engine',
    ],
    answer: 0,
    explainer:
      'Chain of thought prompts the model to think step by step, often improving accuracy on multi-step problems.',
  },
  {
    id: 'eval-1',
    source: 'glossary',
    prompt: 'What is an "eval" in AI engineering?',
    choices: [
      'A JavaScript eval call',
      'A type of fine-tuning',
      'A monitoring dashboard',
      'A graded test that measures how well a model or prompt performs on tasks',
    ],
    answer: 3,
    explainer:
      'Evals are repeatable tests that score outputs so you can compare prompts, models, or versions.',
  },
  {
    id: 'sft-1',
    source: 'glossary',
    prompt: 'What does SFT stand for in model training?',
    choices: [
      'Supervised Fine-Tuning',
      'Stable Function Transform',
      'Stochastic Forward Trace',
      'Secure Federated Training',
    ],
    answer: 0,
    explainer:
      'Supervised fine-tuning trains a model on labelled input-output pairs.',
  },
  {
    id: 'rlhf-1',
    source: 'glossary',
    prompt: 'What does RLHF stand for?',
    choices: [
      'Recursive Layer Hidden Forward',
      'Reverse Logit High Frequency',
      'Reinforcement Learning from Human Feedback',
      'Random Layered Hash Filter',
    ],
    answer: 2,
    explainer:
      'RLHF aligns models by training a reward model from human preferences then optimizing the LLM against it.',
  },
  {
    id: 'distill-1',
    source: 'glossary',
    prompt: 'What is "distillation" in the LLM context?',
    choices: [
      'Compressing prompts to save tokens',
      'Training a smaller model to imitate a larger one',
      'Removing personally identifiable information from training data',
      'Caching common responses',
    ],
    answer: 1,
    explainer:
      'Distillation transfers knowledge from a big teacher model into a smaller, cheaper student model.',
  },
  {
    id: 'quant-1',
    source: 'glossary',
    prompt: 'What is "quantization" for LLMs?',
    choices: [
      'Counting tokens precisely',
      'Splitting a model across multiple GPUs',
      'Adding numbered citations to output',
      'Reducing the numeric precision of weights so the model runs faster and uses less memory',
    ],
    answer: 3,
    explainer:
      'Quantization stores weights in lower precision (for example int4 or int8) to shrink and speed up models with minimal quality loss.',
  },
  {
    id: 'moe-1',
    source: 'glossary',
    prompt: 'What does MoE stand for in model architectures?',
    choices: [
      'Mixture of Experts',
      'Multi-Objective Encoder',
      'Memory of Embeddings',
      'Model of Everything',
    ],
    answer: 0,
    explainer:
      'Mixture of Experts routes each token to a small subset of expert sub-networks, giving big capacity at lower compute cost per token.',
  },
  {
    id: 'multimodal-1',
    source: 'glossary',
    prompt: 'What does "multimodal" mean for an AI model?',
    choices: [
      'It can be deployed in multiple cloud regions',
      'It supports multiple programming languages',
      'It accepts or produces more than one type of input or output (text, image, audio, video)',
      'It has multiple versions',
    ],
    answer: 2,
    explainer:
      'A multimodal model can mix modalities, for example reading an image and writing text about it.',
  },
  {
    id: 'guardrail-1',
    source: 'glossary',
    prompt: 'What is a "guardrail" in an LLM application?',
    choices: [
      'A physical rack mount for GPUs',
      'A monitoring graph',
      'A retry policy',
      'A constraint or filter that keeps model behavior within allowed bounds',
    ],
    answer: 3,
    explainer:
      'Guardrails are policies, validators, or classifiers that prevent unsafe or off-topic outputs.',
  },
  {
    id: 'streaming-1',
    source: 'glossary',
    prompt: 'What does "streaming" mean when calling an LLM?',
    choices: [
      'Receiving the response token by token instead of waiting for the full answer',
      'Storing audio responses',
      'Loading a model from disk',
      'Reading from a vector database',
    ],
    answer: 0,
    explainer:
      'Streaming surfaces tokens as they are generated, which lowers perceived latency for chat UIs.',
  },
  {
    id: 'latency-1',
    source: 'glossary',
    prompt: 'What is "time to first token" (TTFT)?',
    choices: [
      'How long the model takes to load',
      'How long an API key lasts',
      'How long until the first token of the response is returned',
      'How long the longest token in a response is',
    ],
    answer: 2,
    explainer:
      'TTFT is a key latency metric, especially for streaming UIs where users see output as it arrives.',
  },
  {
    id: 'json-mode-1',
    source: 'glossary',
    prompt: 'What is "structured output" or JSON mode?',
    choices: [
      'A model setting that forces responses to match a schema or JSON shape',
      'A way to compress prompts',
      'A retry strategy',
      'A debugging tool',
    ],
    answer: 0,
    explainer:
      'Structured output constrains the model so the response is valid JSON, often matching a provided schema.',
  },

  // --- Tool-specific -------------------------------------------------------
  {
    id: 'cursor-1',
    source: 'tools',
    prompt: 'Cursor is best described as:',
    choices: [
      'A vector database',
      'An AI-first code editor built on VS Code',
      'A model training framework',
      'A terminal multiplexer',
    ],
    answer: 1,
    explainer:
      'Cursor is a fork of VS Code with built-in AI chat, edit, and agent features.',
  },
  {
    id: 'copilot-1',
    source: 'tools',
    prompt: 'GitHub Copilot is primarily:',
    choices: [
      'An inline code completion and chat assistant inside IDEs',
      'A code review bot',
      'A CI/CD platform',
      'A package manager',
    ],
    answer: 0,
    explainer:
      'Copilot suggests code as you type and offers chat inside Visual Studio, VS Code, JetBrains, and more.',
  },
  {
    id: 'claude-code-1',
    source: 'tools',
    prompt: 'Claude Code is:',
    choices: [
      'A standalone IDE',
      'A model fine-tuning service',
      'A browser extension',
      'A command-line agent from Anthropic that edits and runs your codebase',
    ],
    answer: 3,
    explainer:
      'Claude Code is a terminal-based agent that can read, edit, and run code in your local repo.',
  },
  {
    id: 'v0-1',
    source: 'tools',
    prompt: 'v0 by Vercel is best used for:',
    choices: [
      'Provisioning Kubernetes clusters',
      'Indexing documentation',
      'Generating React and Next.js UI from natural language prompts',
      'Training image models',
    ],
    answer: 2,
    explainer:
      'v0 turns prompts and screenshots into shadcn or Tailwind-styled React components and pages.',
  },
  {
    id: 'langchain-1',
    source: 'tools',
    prompt: 'LangChain is:',
    choices: [
      'A framework for composing LLM applications with chains, agents, and integrations',
      'A blockchain for AI models',
      'A vector database',
      'A model from Meta',
    ],
    answer: 0,
    explainer:
      'LangChain provides primitives for chaining LLM calls, tools, and memory, available in Python and JS.',
  },
  {
    id: 'pinecone-1',
    source: 'tools',
    prompt: 'Pinecone is a:',
    choices: [
      'Hosted vector database for semantic search',
      'Code formatter',
      'CI service',
      'Fine-tuning provider',
    ],
    answer: 0,
    explainer:
      'Pinecone stores embeddings and serves nearest-neighbour queries at scale.',
  },
  {
    id: 'ollama-1',
    source: 'tools',
    prompt: 'Ollama lets you:',
    choices: [
      'Train new models from scratch',
      'Run open-source LLMs locally with a simple CLI and API',
      'Generate images from text',
      'Manage Kubernetes pods',
    ],
    answer: 1,
    explainer:
      'Ollama packages open models such as Llama and Mistral so you can pull and run them locally.',
  },
  {
    id: 'huggingface-1',
    source: 'tools',
    prompt: 'Hugging Face is best known for:',
    choices: [
      'A hosted vector index',
      'A code editor',
      'A robotics SDK',
      'A hub of open-source models, datasets, and inference endpoints',
    ],
    answer: 3,
    explainer:
      'Hugging Face hosts hundreds of thousands of models and datasets plus the Transformers library.',
  },
  {
    id: 'ai-sdk-1',
    source: 'tools',
    prompt: 'What is the Vercel AI SDK?',
    choices: [
      'A managed model hosting service',
      'A TypeScript library for building AI features (streaming, tools, structured output) across providers',
      'A fine-tuning UI',
      'A vector database',
    ],
    answer: 1,
    explainer:
      'The AI SDK gives a unified TS interface for many LLM providers, with helpers for streaming and tool calls.',
  },
  {
    id: 'replit-agent-1',
    source: 'tools',
    prompt: 'Replit Agent is designed to:',
    choices: [
      'Translate languages in real time',
      'Compile Rust faster',
      'Build and deploy small full-stack apps from a natural language description',
      'Index documentation',
    ],
    answer: 2,
    explainer:
      'Replit Agent scaffolds, edits, and deploys apps inside the Replit cloud workspace.',
  },
  {
    id: 'midjourney-1',
    source: 'tools',
    prompt: 'Midjourney is primarily:',
    choices: [
      'A text-to-image generator known for stylized output',
      'A coding assistant',
      'A speech-to-text API',
      'A graph database',
    ],
    answer: 0,
    explainer:
      'Midjourney generates images from text prompts, originally accessed via Discord.',
  },
  {
    id: 'whisper-1',
    source: 'tools',
    prompt: 'OpenAI Whisper is:',
    choices: [
      'An image classifier',
      'A code linter',
      'A speech-to-text model',
      'A vector DB',
    ],
    answer: 2,
    explainer:
      'Whisper transcribes and translates speech across many languages.',
  },
  {
    id: 'gateway-1',
    source: 'tools',
    prompt: 'An "AI gateway" (Vercel, Cloudflare, Portkey) primarily provides:',
    choices: [
      'A unified endpoint plus routing, fallback, caching, and observability across many LLM providers',
      'A new base model',
      'A training cluster',
      'A vector store',
    ],
    answer: 0,
    explainer:
      'AI gateways sit in front of providers so you can swap models, add caching, and track spend in one place.',
  },
  {
    id: 'shadcn-1',
    source: 'tools',
    prompt: 'shadcn/ui is:',
    choices: [
      'A hosted component CDN',
      'A copy-paste component library and CLI for React, Tailwind, and Radix',
      'A design tool similar to Figma',
      'A linter for JSX',
    ],
    answer: 1,
    explainer:
      'shadcn/ui distributes components as source you own, installed via a CLI.',
  },
  {
    id: 'cloud-code-1',
    source: 'tools',
    prompt: 'Which of these is NOT a coding-agent product?',
    choices: ['Claude Code', 'Cursor', 'Pinecone', 'Aider'],
    answer: 2,
    explainer:
      'Pinecone is a vector database, not a coding agent. The others all help edit code with AI.',
  },

  // --- Pricing -------------------------------------------------------------
  {
    id: 'cheap-1',
    source: 'pricing',
    prompt: 'Which model has the cheapest input rate per million tokens?',
    choices: [
      'Claude Opus 4',
      'GPT-5 nano',
      'Gemini 2.5 Flash',
      'GPT-5',
    ],
    answer: 1,
    explainer:
      'GPT-5 nano is the cheapest at roughly $0.10 per million input tokens.',
  },
  {
    id: 'expensive-1',
    source: 'pricing',
    prompt: 'Of these, which is the MOST expensive per million output tokens?',
    choices: [
      'GPT-4o mini',
      'GPT-5 nano',
      'Gemini 2.5 Flash',
      'Claude Opus 4',
    ],
    answer: 3,
    explainer:
      'Opus-tier Anthropic models price output tokens at $75 per million, well above the others listed.',
  },
  {
    id: 'pricing-units-1',
    source: 'pricing',
    prompt: 'LLM API prices are most commonly quoted in:',
    choices: [
      'Dollars per request',
      'Dollars per minute of compute',
      'Dollars per million tokens (separate input and output rates)',
      'Dollars per parameter',
    ],
    answer: 2,
    explainer:
      'Providers price input and output tokens separately, in $/MTok.',
  },
  {
    id: 'cache-1',
    source: 'pricing',
    prompt: 'Prompt caching usually changes pricing how?',
    choices: [
      'It makes output tokens free',
      'It charges a small write fee, then offers cached input reads at a steep discount',
      'It only affects fine-tuned models',
      'It doubles the input price',
    ],
    answer: 1,
    explainer:
      'Cache writes cost a bit more than normal input, but cache reads can be 75 to 90 percent cheaper.',
  },
  {
    id: 'output-vs-input-1',
    source: 'pricing',
    prompt: 'For most frontier LLMs, output tokens are typically priced:',
    choices: [
      'The same as input tokens',
      'Cheaper than input tokens',
      'Several times more expensive than input tokens',
      'Free up to a daily cap',
    ],
    answer: 2,
    explainer:
      'Output tokens are usually 3x to 5x the price of input tokens because each must be generated step by step.',
  },
  {
    id: 'flagship-cheap-1',
    source: 'pricing',
    prompt:
      'You need fast, ultra-cheap classification on millions of short strings. Which tier fits best?',
    choices: [
      'A frontier Opus or GPT-5 model',
      'A nano or flash tier model',
      'A fine-tuned reasoning model',
      'A multimodal vision model',
    ],
    answer: 1,
    explainer:
      'Nano and flash tiers (GPT-5 nano, Gemini Flash, Haiku) are tuned for cheap high-volume classification.',
  },
  {
    id: 'reasoning-cost-1',
    source: 'pricing',
    prompt: 'Why do reasoning models often look more expensive in practice?',
    choices: [
      'They charge for context window size',
      'They require a special API key',
      'They use older hardware',
      'They generate large amounts of hidden thinking tokens that count toward output',
    ],
    answer: 3,
    explainer:
      'Reasoning models like o-series and Claude Extended Thinking burn output tokens on internal reasoning.',
  },
  {
    id: 'free-tier-1',
    source: 'pricing',
    prompt: 'Which provider is best known for a generous free tier on Flash-class models?',
    choices: [
      'Anthropic',
      'OpenAI',
      'Google (Gemini)',
      'Cohere',
    ],
    answer: 2,
    explainer:
      'Gemini offers a meaningful free tier on Flash models through Google AI Studio.',
  },
  {
    id: 'batch-1',
    source: 'pricing',
    prompt:
      'Most providers offer a "batch" API tier. The typical tradeoff is:',
    choices: [
      'Lower price for higher latency (often around 50 percent off, returned within 24h)',
      'Higher price for higher quality',
      'Same price, just async',
      'Free, but rate-limited to one request per minute',
    ],
    answer: 0,
    explainer:
      'Batch APIs from OpenAI, Anthropic, and others price at roughly half rate with a 24-hour SLA.',
  },
  {
    id: 'haiku-1',
    source: 'pricing',
    prompt:
      "Within Anthropic's lineup, which model is positioned as the cheapest and fastest?",
    choices: ['Opus', 'Sonnet', 'Haiku', 'Aria'],
    answer: 2,
    explainer:
      'Haiku is the small-tier model. Sonnet is mid, Opus is the top flagship.',
  },

  // --- General AI dev knowledge -------------------------------------------
  {
    id: 'gen-1',
    source: 'general',
    prompt:
      'Your chatbot keeps giving outdated answers about your product docs. The most reliable fix is to:',
    choices: [
      'Increase temperature',
      'Add retrieval (RAG) over the up-to-date docs',
      'Switch to a larger model',
      'Lower the max_tokens',
    ],
    answer: 1,
    explainer:
      'Models cannot know your private or updated docs unless you retrieve and pass them in context.',
  },
  {
    id: 'gen-2',
    source: 'general',
    prompt:
      'Which is usually the cheapest way to make a model handle a niche style or format more reliably?',
    choices: [
      'Train a brand new base model',
      'Switch to a different provider',
      'Increase the context window',
      'Add a few high-quality examples in the prompt (few-shot)',
    ],
    answer: 3,
    explainer:
      'Few-shot prompting is fast, free of training cost, and often enough before reaching for fine-tuning.',
  },
  {
    id: 'gen-3',
    source: 'general',
    prompt:
      'You need to compare answers from a model across versions. The best practice is to:',
    choices: [
      'Eyeball a couple of outputs',
      'Trust user feedback only',
      'Build an eval set with graded test cases and run it on every change',
      'Always use the newest model',
    ],
    answer: 2,
    explainer:
      'Repeatable evals turn vibes into numbers, which is how you safely change prompts and models.',
  },
  {
    id: 'gen-4',
    source: 'general',
    prompt:
      'What is the safest place to store your provider API key in a web app?',
    choices: [
      'In a public NEXT_PUBLIC_ env var so the browser can read it',
      'Hardcoded in a client component',
      'On the server in a private env var, called only from server code',
      'In localStorage',
    ],
    answer: 2,
    explainer:
      'API keys must stay server-side. Calling providers from the browser exposes the key to anyone.',
  },
  {
    id: 'gen-5',
    source: 'general',
    prompt:
      'A user reports the chatbot refusing safe requests. The most useful first investigation is to:',
    choices: [
      'Restart the server',
      'Inspect the system prompt and any safety filters in front of the model',
      'Upgrade to the next model tier',
      'Increase max_tokens',
    ],
    answer: 1,
    explainer:
      'Most over-refusals come from an over-broad system prompt or overly aggressive moderation layer.',
  },
  {
    id: 'gen-6',
    source: 'general',
    prompt:
      'You want to ground LLM output in a stable schema (typed fields). The best technique is:',
    choices: [
      'Ask politely in the prompt and hope',
      'Lower the temperature to 0',
      'Switch to a smaller model',
      'Use structured output / JSON schema mode supported by the provider',
    ],
    answer: 3,
    explainer:
      'Native structured output enforces the schema during decoding, which is far more reliable than asking nicely.',
  },
  {
    id: 'gen-7',
    source: 'general',
    prompt:
      'Your RAG app retrieves the right docs but the model still misses facts. A common fix is to:',
    choices: [
      'Include the retrieved chunks more clearly in the prompt and ask the model to cite them',
      'Remove the retrieval step',
      'Train a new base model',
      'Increase temperature',
    ],
    answer: 0,
    explainer:
      'Many "bad RAG" results come from sloppy prompt construction, not bad retrieval.',
  },
  {
    id: 'gen-8',
    source: 'general',
    prompt:
      'Which of these is a real risk of letting an agent run tools autonomously?',
    choices: [
      'It might bill itself for tokens',
      'It might take destructive actions if tools are not sandboxed and reviewed',
      'It will get faster over time on its own',
      'It will compress the context window',
    ],
    answer: 1,
    explainer:
      'Agent loops can delete files, send emails, or spend money if you do not gate dangerous tools.',
  },
  {
    id: 'gen-9',
    source: 'general',
    prompt: 'For long chat sessions, a good way to manage context size is to:',
    choices: [
      'Send every previous message every turn',
      'Truncate to the first message only',
      'Disable the system prompt',
      'Summarize older turns and keep recent ones verbatim',
    ],
    answer: 3,
    explainer:
      'Rolling summaries plus recent verbatim history keep the model coherent without blowing the context window.',
  },
  {
    id: 'gen-10',
    source: 'general',
    prompt:
      'You see costs spike. Which observability metric is most directly useful?',
    choices: [
      'CPU load on the model server',
      'Tokens in and tokens out per request, broken down by route or feature',
      'DNS query latency',
      'Number of HTTP 200 responses',
    ],
    answer: 1,
    explainer:
      'Token counts per route translate directly to dollars and reveal where to optimize prompts or cache.',
  },
];
