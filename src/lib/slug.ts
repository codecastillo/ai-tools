import slugify from 'slugify';

export function toSlug(input: string): string {
  const s = slugify(input, { lower: true, strict: true, trim: true });
  return s || 'tool';
}

export function isUniqueViolation(err: unknown): boolean {
  return (
    !!err &&
    typeof err === 'object' &&
    'code' in err &&
    (err as { code?: string }).code === '23505'
  );
}

export async function insertWithSlugRetry<T>(
  base: string,
  insert: (slug: string) => Promise<T>,
  maxAttempts = 5,
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    try {
      return await insert(slug);
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      last = err;
    }
  }
  throw last ?? new Error('Could not allocate a unique slug');
}
