import Fuse from 'fuse.js';

interface Candidate {
  slug: string;
  title: string;
  url: string;
}

interface Match {
  slug: string;
  title: string;
  score: number;
}

function normalizeUrl(u: string): string {
  try {
    const url = new URL(u);
    let host = url.host.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    let path = url.pathname.replace(/\/+$/, '');
    return `${host}${path}`;
  } catch {
    return u.toLowerCase().trim();
  }
}

export function findDuplicates(
  input: { title: string; url: string },
  candidates: Candidate[],
): { matches: Match[] } {
  if (candidates.length === 0) return { matches: [] };

  const normalizedInputUrl = normalizeUrl(input.url);
  const exact = candidates.find((c) => normalizeUrl(c.url) === normalizedInputUrl);
  if (exact) {
    return {
      matches: [{ slug: exact.slug, title: exact.title, score: 1 }],
    };
  }

  const fuse = new Fuse(candidates, {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'url', weight: 0.3 },
    ],
    threshold: 0.5,
    includeScore: true,
  });
  const results = fuse.search(`${input.title} ${input.url}`).slice(0, 3);
  return {
    matches: results.map((r) => ({
      slug: r.item.slug,
      title: r.item.title,
      score: 1 - (r.score ?? 1),
    })),
  };
}
