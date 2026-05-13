// Site changelog. Hand authored, one entry per noteworthy shipped change.
// Dates are calendar dates the change went live on production.

export type ChangelogKind = 'feature' | 'design' | 'fix' | 'content';

export interface ChangelogEntry {
  date: string;
  kind: ChangelogKind;
  title: string;
  body: string;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-05-13',
    kind: 'feature',
    title: 'Round 4 overhaul: pricing tiers, calculator, learn paths, glossary',
    body: 'Four new pages, persistent left sidebar, interactive pricing tier cards on every tool, a per-million-token cost calculator, a 30 term glossary with inline tooltips, and four learning paths from beginner to research engineer. Visual cleanup pass removed every static accent border and re centered card content.',
  },
  {
    date: '2026-05-12',
    kind: 'fix',
    title: 'Round 3 stability and pricing accuracy',
    body: 'Killed the terminal cycle that flashed on reload. Code blocks now reveal line by line off the real Shiki HTML. Right rail sticks Quick Info above the TOC. Tool card + button moved to the footer next to "Read guide". Marquee edges fade via CSS mask. Homepage widened to max-w-screen-2xl.',
  },
  {
    date: '2026-05-11',
    kind: 'content',
    title: 'Pricing and resources for all 18 tools',
    body: 'Every tool now carries structured pricing markdown (tier breakdowns, per-million-token rates where applicable) and a curated resources block (docs, GitHub, community, quickstart). Claude Code corrected from "paid" to "freemium".',
  },
  {
    date: '2026-05-10',
    kind: 'design',
    title: 'Bun.sh inspired refresh',
    body: 'Warm coral and amber palette, dot grid backdrop, chunky typography, and magazine style spacing. Replaced the generic dark theme with something with a point of view.',
  },
  {
    date: '2026-05-09',
    kind: 'feature',
    title: 'Package manager tabs in install blocks',
    body: 'Install snippets now offer npm, yarn, pnpm, and bun in a tab strip with the preference saved to localStorage. Legacy `:::os` directive still renders for OS specific instructions.',
  },
  {
    date: '2026-05-08',
    kind: 'feature',
    title: 'Tool of the day and recently viewed',
    body: 'Daily rotation across the curated set, plus a recently viewed strip backed by localStorage. Helps repeat visitors continue where they left off.',
  },
  {
    date: '2026-05-07',
    kind: 'feature',
    title: 'Stack builder and stack share',
    body: 'Drag tools into a draft stack, share via URL. Confetti burst when a stack is published.',
  },
  {
    date: '2026-05-06',
    kind: 'feature',
    title: 'Command palette',
    body: 'Press cmd-k anywhere to fuzzy search tools, categories, and stacks.',
  },
  {
    date: '2026-05-05',
    kind: 'feature',
    title: 'Compare two tools',
    body: 'Pick any two tools and view a side by side comparison at /compare/[a]/vs/[b]. Inputs accept slugs from the URL or a tool picker.',
  },
  {
    date: '2026-05-04',
    kind: 'design',
    title: 'Hover preview cards',
    body: 'Hover any tool name to see a preview card with tagline, pricing, and difficulty without leaving the page.',
  },
  {
    date: '2026-05-03',
    kind: 'content',
    title: 'Eighteen seed tools across four categories',
    body: 'Claude ecosystem, AI coding CLIs, frameworks, and productivity. Each entry hand written with install, usage, cheatsheet, and asciinema demo where available.',
  },
  {
    date: '2026-05-02',
    kind: 'feature',
    title: 'Initial launch',
    body: 'Next.js 16 App Router, Postgres backed catalog, Tailwind v4. Submitted via the public form, curated via the admin route. Deployed on Railway.',
  },
];

export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso + 'T12:00:00Z').getTime();
  const diff = now.getTime() - then;
  const day = 86_400_000;
  if (diff < day) return 'today';
  if (diff < 2 * day) return 'yesterday';
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`;
  if (diff < 30 * day) return `${Math.floor(diff / (7 * day))} weeks ago`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))} months ago`;
  return `${Math.floor(diff / (365 * day))} years ago`;
}
