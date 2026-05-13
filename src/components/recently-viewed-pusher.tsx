'use client';

import { useEffect } from 'react';
import { pushRecent } from '@/lib/recently-viewed';

export default function RecentlyViewedPusher({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  useEffect(() => {
    pushRecent({ slug, title });
  }, [slug, title]);
  return null;
}
