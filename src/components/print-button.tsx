'use client';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs text-ink-dim transition hover:bg-surface-3 hover:text-ink"
    >
      <Printer className="h-3.5 w-3.5" /> Print
    </button>
  );
}
