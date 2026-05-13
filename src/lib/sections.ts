import type { Category, Tool } from './types';
import { CATEGORIES, CATEGORY_LABELS } from './types';

export interface CategorySection {
  category: Category;
  label: string;
  short: string;
  subtitle: string;
  tools: Tool[];
}

const SUBTITLES: Record<Category, string> = {
  claude: 'Anthropic\'s stack. Claude Code, the API, MCP, and the Agent SDK.',
  clis: 'Coding assistants that live in your terminal.',
  frameworks: 'Libraries for building AI-powered apps and agents.',
  productivity: 'Tools to think, research, and ship faster.',
};

const SHORT_LABELS: Record<Category, string> = {
  claude: 'Claude ecosystem',
  clis: 'AI coding CLIs',
  frameworks: 'AI dev frameworks',
  productivity: 'AI productivity',
};

/**
 * Groups approved tools by category, preserving the ordering in CATEGORIES.
 * Returns only categories that have at least one tool.
 */
export function groupByCategory(tools: Tool[]): CategorySection[] {
  const byCat: Record<Category, Tool[]> = {
    claude: [],
    clis: [],
    frameworks: [],
    productivity: [],
  };
  for (const t of tools) {
    if (t.category && t.category in byCat) {
      byCat[t.category].push(t);
    }
  }
  return CATEGORIES.flatMap((c) => {
    const list = byCat[c];
    if (list.length === 0) return [];
    return [
      {
        category: c,
        label: CATEGORY_LABELS[c],
        short: SHORT_LABELS[c],
        subtitle: SUBTITLES[c],
        tools: list,
      },
    ];
  });
}
