import type { Category } from './types';

/** Lucide icon identifiers recognised by `path-cards.tsx`. */
export type PathIconName = 'Compass' | 'Bot' | 'Wrench';

export interface PathDef {
  slug: string;
  /** Lucide icon component name. Resolved to a JSX component in `path-cards.tsx`. */
  iconName: PathIconName;
  title: string;
  description: string;
  /** Href the path's CTA links to. */
  href: string;
  /** Category color used for the accent dot + glow. Falls back to default. */
  category?: Category;
}

/**
 * Quick-start entry points shown right under the hero. Each routes to a real
 * curated stack page so newcomers land on a concrete walk-through, not a
 * filtered home view.
 */
export const PATHS: PathDef[] = [
  {
    slug: 'explore',
    iconName: 'Compass',
    title: 'Just exploring',
    description: 'New to AI tools? Browse a starter pack of must-tries.',
    href: '/stacks/student-productivity',
  },
  {
    slug: 'agents',
    iconName: 'Bot',
    title: 'Building agents',
    description: 'Claude Code, Agent SDK, MCP, and the frameworks people actually ship with.',
    href: '/stacks/claude-native',
    category: 'claude',
  },
  {
    slug: 'devloop',
    iconName: 'Wrench',
    title: 'Daily devloop',
    description: 'Coding CLIs that live in your shell. Cursor, Aider, Codex, and the rest.',
    href: '/stacks/vibe-coding',
    category: 'clis',
  },
];
