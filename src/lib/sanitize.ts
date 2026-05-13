import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize a snippet of HTML for safe rendering via dangerouslySetInnerHTML.
 *
 * Allows the tags + attributes Shiki actually emits (pre, code, span with
 * style/class) and strips everything else. Blocks script, iframe, on* handlers,
 * data: and javascript: URLs by default via DOMPurify.
 */
export function sanitizeShikiHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['pre', 'code', 'span', 'br', 'div'],
    ALLOWED_ATTR: ['class', 'style', 'data-line'],
    KEEP_CONTENT: true,
  });
}

/**
 * Generic sanitize for trusted markdown output (curator-controlled).
 * Still strips scripts as a defence-in-depth measure.
 */
export function sanitizeMarkdownHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}
