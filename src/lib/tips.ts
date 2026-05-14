export interface Tip {
  id: string;
  category: 'prompt' | 'agent' | 'cost' | 'eval' | 'general';
  text: string;
}

export const TIPS: Tip[] = [
  // prompt (6)
  {
    id: 'prompt-01',
    category: 'prompt',
    text: 'Write your prompt for the dumb intern, not the senior engineer. Even GPT-5 needs explicit constraints.',
  },
  {
    id: 'prompt-02',
    category: 'prompt',
    text: 'Use JSON mode when you need structured output. Save your post-processing brain cells.',
  },
  {
    id: 'prompt-03',
    category: 'prompt',
    text: 'Put the instructions before the data, then repeat the key instruction after the data. Long contexts forget the middle.',
  },
  {
    id: 'prompt-04',
    category: 'prompt',
    text: 'Show two good examples and one bad example. Few-shot beats zero-shot for almost every classification task.',
  },
  {
    id: 'prompt-05',
    category: 'prompt',
    text: 'Ask the model to think step by step only when the task actually needs it. On easy tasks it just burns tokens.',
  },
  {
    id: 'prompt-06',
    category: 'prompt',
    text: 'If your prompt has more than three responsibilities, split it into two calls. Models are bad at juggling.',
  },

  // agent (6)
  {
    id: 'agent-01',
    category: 'agent',
    text: 'Most agents fail not from model errors but from tool errors. Add retries before adding reasoning.',
  },
  {
    id: 'agent-02',
    category: 'agent',
    text: 'Cap your agent loop at a hard step limit. Infinite loops are how single tasks become 40 dollar bills.',
  },
  {
    id: 'agent-03',
    category: 'agent',
    text: 'Give every tool a clear docstring and a JSON schema. The model picks tools based on names and descriptions, not your intent.',
  },
  {
    id: 'agent-04',
    category: 'agent',
    text: 'Log every tool call with inputs and outputs. When an agent goes off the rails, the trace is the only thing that saves you.',
  },
  {
    id: 'agent-05',
    category: 'agent',
    text: 'Prefer one fat tool over five tiny ones. Fewer choices means fewer wrong choices.',
  },
  {
    id: 'agent-06',
    category: 'agent',
    text: 'Let the agent ask for clarification. A question to the user is cheaper than ten wrong tool calls.',
  },

  // cost (6)
  {
    id: 'cost-01',
    category: 'cost',
    text: 'Cache stable system prompts to cut cost 90 percent on Anthropic and OpenAI.',
  },
  {
    id: 'cost-02',
    category: 'cost',
    text: 'Set a token budget per call before you ship. Without it, one bug can drain your credits in minutes.',
  },
  {
    id: 'cost-03',
    category: 'cost',
    text: 'Sonnet usually beats Opus when latency matters. Reserve Opus for the hard 10 percent.',
  },
  {
    id: 'cost-04',
    category: 'cost',
    text: 'Truncate chat history with a sliding window plus a summary. Sending the full transcript every turn is how bills explode.',
  },
  {
    id: 'cost-05',
    category: 'cost',
    text: 'Batch your offline jobs. Most providers offer a 50 percent discount for non realtime workloads.',
  },
  {
    id: 'cost-06',
    category: 'cost',
    text: 'Track cost per request as a first class metric, not an afterthought. You cannot optimize what you do not measure.',
  },

  // eval (6)
  {
    id: 'eval-01',
    category: 'eval',
    text: 'If your eval set has fewer than 20 cases, you do not have an eval yet, you have a vibe.',
  },
  {
    id: 'eval-02',
    category: 'eval',
    text: 'Pin your model version. New default models break prompts in subtle ways.',
  },
  {
    id: 'eval-03',
    category: 'eval',
    text: 'Run evals on every prompt change. A one word edit can move accuracy five points in either direction.',
  },
  {
    id: 'eval-04',
    category: 'eval',
    text: 'Always include adversarial cases. Models that score 95 on the happy path can score 30 on edge cases.',
  },
  {
    id: 'eval-05',
    category: 'eval',
    text: 'LLM as judge is fine for scale, but calibrate it against human labels first. Otherwise you are measuring noise.',
  },
  {
    id: 'eval-06',
    category: 'eval',
    text: 'Save every production failure into your eval set. Real bugs are better data than synthetic ones.',
  },

  // general (6)
  {
    id: 'general-01',
    category: 'general',
    text: 'Treat retrieved context as untrusted. A document can hide a prompt injection.',
  },
  {
    id: 'general-02',
    category: 'general',
    text: 'Streaming makes a slow model feel fast. Stream early, even if you batch later.',
  },
  {
    id: 'general-03',
    category: 'general',
    text: 'Never put a model in front of a destructive action without a human in the loop. Soft delete first, ask questions later.',
  },
  {
    id: 'general-04',
    category: 'general',
    text: 'Embeddings are not search. Combine them with keyword retrieval for anything that has proper nouns.',
  },
  {
    id: 'general-05',
    category: 'general',
    text: 'Temperature zero is not deterministic across providers. If you need reproducibility, seed it and log everything.',
  },
  {
    id: 'general-06',
    category: 'general',
    text: 'Ship the dumbest version that could possibly work, then add intelligence. Most AI products are over engineered on day one.',
  },
];

export function tipOfTheDay(now: Date = new Date()): Tip {
  const day = Math.floor(now.getTime() / 86_400_000);
  return TIPS[day % TIPS.length];
}
