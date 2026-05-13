import { promises as dns } from 'node:dns';
import { Buffer } from 'node:buffer';
import ipaddr from 'ipaddr.js';
import * as cheerio from 'cheerio';

export class UnsafeUrlError extends Error {}
export class FetchSizeError extends Error {}

const MAX_BODY = 256 * 1024;
const TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 3;

function isHttp(u: URL): boolean {
  return u.protocol === 'http:' || u.protocol === 'https:';
}

function isUnsafeIp(addr: string): boolean {
  if (!ipaddr.isValid(addr)) return true;
  try {
    const ip = ipaddr.parse(addr);
    const range = ip.range();
    // ipaddr.js ranges: 'unicast' is what we want; everything else is unsafe.
    if (range !== 'unicast') return true;
    // Block specific metadata-service IPs.
    if (addr === '169.254.169.254') return true;
    return false;
  } catch {
    return true;
  }
}

async function assertSafeHost(host: string): Promise<void> {
  if (!host) throw new UnsafeUrlError('Missing host');
  // Localhost-style names.
  if (/^(localhost|.*\.local|0\.0\.0\.0)$/i.test(host)) {
    throw new UnsafeUrlError('Local hostnames are not allowed');
  }
  const addrs = await dns.lookup(host, { all: true, verbatim: true });
  for (const { address } of addrs) {
    if (isUnsafeIp(address)) {
      throw new UnsafeUrlError(`Resolved IP ${address} is not allowed`);
    }
  }
}

async function safeFetchHtml(targetUrl: string): Promise<{ html: string; finalUrl: string }> {
  let url = targetUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const u = new URL(url);
    if (!isHttp(u)) throw new UnsafeUrlError('Only http(s) URLs are allowed');
    await assertSafeHost(u.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent': 'ai.tools-metadata-fetcher/1.0',
          Accept: 'text/html,application/xhtml+xml',
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get('location');
      if (!next) throw new Error('Redirect with no Location header');
      url = new URL(next, url).toString();
      continue;
    }
    if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);

    const reader = res.body?.getReader();
    if (!reader) return { html: '', finalUrl: url };
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > MAX_BODY) {
          await reader.cancel();
          throw new FetchSizeError('Response too large');
        }
        chunks.push(value);
      }
    }
    const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8');
    return { html, finalUrl: url };
  }
  throw new Error('Too many redirects');
}

export interface FetchMetadataResult {
  title: string | null;
  description: string | null;
  image: string | null;
}

export async function fetchMetadata(targetUrl: string): Promise<FetchMetadataResult> {
  const { html, finalUrl } = await safeFetchHtml(targetUrl);
  const $ = cheerio.load(html);

  const getMeta = (selectors: string[]): string | null => {
    for (const s of selectors) {
      const v = $(s).attr('content');
      if (v) return v.trim();
    }
    return null;
  };

  const titleText = $('title').first().text().trim();
  let title: string | null =
    getMeta(['meta[property="og:title"]', 'meta[name="twitter:title"]']) ??
    (titleText || null);
  if (title === '') title = null;

  let description = getMeta([
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]',
  ]);
  if (description === '') description = null;

  let image = getMeta(['meta[property="og:image"]', 'meta[name="twitter:image"]']);
  if (image) {
    try {
      image = new URL(image, finalUrl).toString();
    } catch {
      image = null;
    }
  }

  return { title, description, image };
}
