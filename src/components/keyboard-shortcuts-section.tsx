interface KeyboardShortcutsSectionProps {
  cheatsheet: string | null;
}

interface ShortcutRow {
  cmd: string;
  desc: string;
}

/**
 * Parse a markdown table whose first column header is "Command" (case-insensitive).
 * Returns the two-column rows (command, description) or [] if no such table exists.
 */
function parseCommandTable(md: string): ShortcutRow[] {
  const lines = md.split('\n');
  const headerIdx = lines.findIndex((l) => /^\|\s*command\s*\|/i.test(l));
  if (headerIdx < 0) return [];
  const rows: ShortcutRow[] = [];
  // Skip the header line itself and the separator (|---|---|) on the next line.
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|')) break;
    const parts = line.split('|').map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) break;
    const cmd = parts[0].replace(/`/g, '');
    const desc = parts[1];
    if (cmd && desc) rows.push({ cmd, desc });
  }
  return rows;
}

export default function KeyboardShortcutsSection({
  cheatsheet,
}: KeyboardShortcutsSectionProps) {
  if (!cheatsheet) return null;
  const rows = parseCommandTable(cheatsheet);
  if (rows.length === 0) return null;
  return (
    <section className="mt-10">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
        Shortcuts &amp; commands
      </p>
      <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map(({ cmd, desc }) => (
          <div
            key={cmd}
            className="flex items-baseline justify-between gap-3 border-b border-white/[0.06] pb-2"
          >
            <kbd className="rounded border border-white/[0.14] bg-white/[0.04] px-2 py-0.5 font-mono text-[12px] text-ink">
              {cmd}
            </kbd>
            <span className="text-right text-sm text-ink-dim">{desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
