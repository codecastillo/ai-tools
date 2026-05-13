export type Category = 'claude' | 'clis' | 'frameworks' | 'productivity';
export type Pricing = 'free' | 'paid' | 'freemium' | 'oss';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ToolStatus = 'pending' | 'approved' | 'rejected';

export interface Tool {
  id: string;
  slug: string;
  title: string;
  url: string;
  tagline: string | null;
  description: string | null;
  category: Category | null;
  tags: string[];
  install_md: string | null;
  usage_md: string | null;
  cheatsheet_md: string | null;
  asciinema_id: string | null;
  pricing: Pricing | null;
  difficulty: Difficulty | null;
  time_to_value: string | null;
  status: ToolStatus;
  submitter: string | null;
  is_curated: boolean;
  last_verified: string | null;
  created_at: string;
  approved_at: string | null;
}

export interface ToolDetail extends Tool {
  used_in_stacks: Stack[];
}

export interface Stack {
  id: string;
  slug: string;
  name: string | null;
  description: string | null;
  tool_ids: string[];
  is_curated: boolean;
  created_at: string;
}

export interface StackWithTools extends Stack {
  tools: Tool[];
}

export const CATEGORIES: Category[] = ['claude', 'clis', 'frameworks', 'productivity'];

export const CATEGORY_LABELS: Record<Category, string> = {
  claude: 'Claude ecosystem',
  clis: 'AI coding CLIs',
  frameworks: 'AI dev frameworks',
  productivity: 'AI productivity',
};
