import type { Category } from './types';

export interface PathDef {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  /** Href the path's CTA links to. */
  href: string;
  /** Category color used for the accent dot + glow. Falls back to default. */
  category?: Category;
}

/**
 * Quick-start entry points shown right under the hero. Each routes to a
 * pre-filtered view of the catalog so newcomers know where to begin.
 */
export const PATHS: PathDef[] = [
  {
    slug: 'explore',
    emoji: '🪐',
    title: 'Just exploring',
    description: 'New to AI tools? Browse the catalog and pick something that looks fun.',
    href: '/',
  },
  {
    slug: 'agents',
    emoji: '🤖',
    title: 'Building agents',
    description: 'Claude Code, Agent SDK, MCP, and the frameworks people actually ship with.',
    href: '/?category=claude',
    category: 'claude',
  },
  {
    slug: 'devloop',
    emoji: '🛠️',
    title: 'Daily devloop',
    description: "Coding CLIs that live in your shell — Cursor, Aider, Codex, and the rest.",
    href: '/?category=clis',
    category: 'clis',
  },
];
