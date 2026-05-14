export interface FamilyNode {
  id: string;
  label: string;
  release: string;
  notes: string;
  family: 'gpt' | 'claude' | 'llama' | 'gemini' | 'mistral' | 'deepseek' | 'qwen' | 'grok';
  parent?: string;
}

export const FAMILY_NODES: FamilyNode[] = [
  // GPT lineage
  { id: 'gpt-3',    family: 'gpt', label: 'GPT-3',    release: '2020-06', notes: 'First model to popularize the modern API era.' },
  { id: 'gpt-3-5',  family: 'gpt', label: 'GPT-3.5',  release: '2022-11', parent: 'gpt-3', notes: 'Chat-tuned base for ChatGPT launch.' },
  { id: 'gpt-4',    family: 'gpt', label: 'GPT-4',    release: '2023-03', parent: 'gpt-3-5', notes: 'Major jump in reasoning and accuracy.' },
  { id: 'gpt-4o',   family: 'gpt', label: 'GPT-4o',   release: '2024-05', parent: 'gpt-4', notes: 'Native multimodal, lower latency.' },
  { id: 'gpt-5',    family: 'gpt', label: 'GPT-5',    release: '2025-08', parent: 'gpt-4o', notes: 'Frontier reasoning, 400K context.' },

  // Claude lineage
  { id: 'claude-1', family: 'claude', label: 'Claude 1', release: '2023-03', notes: 'Anthropic\'s first public model.' },
  { id: 'claude-2', family: 'claude', label: 'Claude 2', release: '2023-07', parent: 'claude-1', notes: '100K context, constitutional AI training.' },
  { id: 'claude-3', family: 'claude', label: 'Claude 3', release: '2024-03', parent: 'claude-2', notes: 'Opus / Sonnet / Haiku family debut.' },
  { id: 'claude-3-5', family: 'claude', label: 'Claude 3.5', release: '2024-06', parent: 'claude-3', notes: 'Sonnet 3.5 dominated coding benchmarks.' },
  { id: 'claude-4', family: 'claude', label: 'Claude 4', release: '2025-09', parent: 'claude-3-5', notes: 'Opus / Sonnet / Haiku 4 with extended thinking.' },

  // Llama lineage
  { id: 'llama-1',  family: 'llama', label: 'Llama 1',  release: '2023-02', notes: 'Open weights research only.' },
  { id: 'llama-2',  family: 'llama', label: 'Llama 2',  release: '2023-07', parent: 'llama-1', notes: 'First commercially usable Llama.' },
  { id: 'llama-3',  family: 'llama', label: 'Llama 3',  release: '2024-04', parent: 'llama-2', notes: '70B model competitive with GPT-4.' },
  { id: 'llama-4',  family: 'llama', label: 'Llama 4',  release: '2025-10', parent: 'llama-3', notes: 'Maverick variant matches frontier.' },

  // Gemini lineage
  { id: 'palm-2',     family: 'gemini', label: 'PaLM 2',    release: '2023-05', notes: 'Google\'s previous flagship.' },
  { id: 'gemini-1',   family: 'gemini', label: 'Gemini 1',  release: '2023-12', parent: 'palm-2', notes: 'Multimodal from day one.' },
  { id: 'gemini-1-5', family: 'gemini', label: 'Gemini 1.5',release: '2024-02', parent: 'gemini-1', notes: '1M context, sparse MoE.' },
  { id: 'gemini-2',   family: 'gemini', label: 'Gemini 2',  release: '2024-12', parent: 'gemini-1-5', notes: 'Flash and Pro variants.' },
  { id: 'gemini-2-5', family: 'gemini', label: 'Gemini 2.5',release: '2025-11', parent: 'gemini-2', notes: '2M context window.' },

  // Mistral lineage
  { id: 'mistral-7b',    family: 'mistral', label: 'Mistral 7B',     release: '2023-09', notes: 'Apache-licensed 7B that punched above its weight.' },
  { id: 'mixtral-8x7b',  family: 'mistral', label: 'Mixtral 8x7B',   release: '2023-12', parent: 'mistral-7b', notes: 'First popular sparse MoE.' },
  { id: 'mistral-large', family: 'mistral', label: 'Mistral Large',  release: '2024-02', parent: 'mixtral-8x7b', notes: 'API-only flagship.' },
  { id: 'mistral-large-2',family: 'mistral',label: 'Mistral Large 2',release: '2024-07', parent: 'mistral-large', notes: 'Closes the gap with frontier.' },

  // DeepSeek lineage
  { id: 'deepseek-v2', family: 'deepseek', label: 'DeepSeek V2', release: '2024-05', notes: 'Open weights MoE.' },
  { id: 'deepseek-v3', family: 'deepseek', label: 'DeepSeek V3', release: '2025-12', parent: 'deepseek-v2', notes: '671B params, aggressive pricing.' },

  // Qwen lineage
  { id: 'qwen-1', family: 'qwen', label: 'Qwen 1', release: '2023-09', notes: 'Alibaba\'s first open weights model.' },
  { id: 'qwen-2', family: 'qwen', label: 'Qwen 2', release: '2024-06', parent: 'qwen-1', notes: 'Improved multilingual coverage.' },
  { id: 'qwen-3', family: 'qwen', label: 'Qwen 3', release: '2026-01', parent: 'qwen-2', notes: 'Strongest open weights multilingual scores.' },

  // Grok lineage
  { id: 'grok-1', family: 'grok', label: 'Grok 1', release: '2023-11', notes: 'xAI launches with X/Twitter integration.' },
  { id: 'grok-2', family: 'grok', label: 'Grok 2', release: '2024-08', parent: 'grok-1', notes: 'Closed real-time data advantage.' },
  { id: 'grok-3', family: 'grok', label: 'Grok 3', release: '2025-02', parent: 'grok-2', notes: 'Frontier-tier reasoning.' },
  { id: 'grok-4', family: 'grok', label: 'Grok 4', release: '2025-11', parent: 'grok-3', notes: '256K context, native search.' },
];

export const FAMILY_LABEL: Record<FamilyNode['family'], string> = {
  gpt: 'OpenAI GPT',
  claude: 'Anthropic Claude',
  llama: 'Meta Llama',
  gemini: 'Google Gemini',
  mistral: 'Mistral AI',
  deepseek: 'DeepSeek',
  qwen: 'Alibaba Qwen',
  grok: 'xAI Grok',
};
