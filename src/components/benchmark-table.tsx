'use client';

import { useMemo, useState } from 'react';
import { Award } from 'lucide-react';
import {
  BENCHMARKS,
  BENCHMARK_LABEL,
  BENCHMARK_TOOLTIP,
  getScore,
  leaderByAxis,
  type BenchmarkAxis,
  type BenchmarkRow,
} from '@/lib/benchmarks';
import BenchmarkRadar from '@/components/benchmark-radar';

type SortKey = BenchmarkAxis | 'overall';

const AXES: BenchmarkAxis[] = [
  'mmlu',
  'humaneval',
  'math',
  'gpqa',
  'swebench',
  'mtbench',
];

const MAX_OVERLAY = 4;

function overallScore(row: BenchmarkRow): number {
  return AXES.reduce((acc, axis) => acc + getScore(row, axis), 0);
}

export default function BenchmarkTable() {
  const [sortBy, setSortBy] = useState<SortKey>('overall');
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set<string>(['claude-opus-4', 'gpt-5'])
  );

  const sortedRows = useMemo(() => {
    const rows = [...BENCHMARKS];
    if (sortBy === 'overall') {
      rows.sort((a, b) => overallScore(b) - overallScore(a));
    } else {
      rows.sort((a, b) => getScore(b, sortBy) - getScore(a, sortBy));
    }
    return rows;
  }, [sortBy]);

  const leaderId = useMemo(() => {
    if (sortBy === 'overall') return null;
    const leader = leaderByAxis(sortBy);
    return leader?.model_id ?? null;
  }, [sortBy]);

  const overlayRows = useMemo(
    () => BENCHMARKS.filter((r) => selected.has(r.model_id)),
    [selected]
  );

  function toggleSelected(modelId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        if (next.size >= MAX_OVERLAY) return prev;
        next.add(modelId);
      }
      return next;
    });
  }

  const showAllScores = sortBy === 'overall';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSortBy('overall')}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            sortBy === 'overall'
              ? 'border-accent bg-accent text-white'
              : 'border-line bg-surface-1 text-ink-dim hover:border-line-2 hover:text-ink'
          }`}
        >
          Overall
        </button>
        {AXES.map((axis) => (
          <button
            key={axis}
            type="button"
            onClick={() => setSortBy(axis)}
            title={BENCHMARK_TOOLTIP[axis]}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              sortBy === axis
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-surface-1 text-ink-dim hover:border-line-2 hover:text-ink'
            }`}
          >
            {BENCHMARK_LABEL[axis]}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface-1 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink-faint">
            Pick up to {MAX_OVERLAY} models to overlay.
          </p>
          <p className="text-xs text-ink-faint">
            {selected.size} / {MAX_OVERLAY} selected
          </p>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {BENCHMARKS.map((row) => {
            const isChecked = selected.has(row.model_id);
            const disabled = !isChecked && selected.size >= MAX_OVERLAY;
            return (
              <li key={row.model_id}>
                <label
                  className={`flex items-center gap-2 text-xs ${
                    disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-accent"
                    checked={isChecked}
                    disabled={disabled}
                    onChange={() => toggleSelected(row.model_id)}
                  />
                  <span className="text-ink">{row.model}</span>
                  <span className="text-ink-faint">{row.vendor}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Release</th>
              {showAllScores ? (
                AXES.map((axis) => (
                  <th
                    key={axis}
                    className="px-2 py-3 text-right font-medium"
                    title={BENCHMARK_TOOLTIP[axis]}
                  >
                    {BENCHMARK_LABEL[axis]}
                  </th>
                ))
              ) : (
                <th
                  className="px-4 py-3 text-right font-medium"
                  title={BENCHMARK_TOOLTIP[sortBy]}
                >
                  {BENCHMARK_LABEL[sortBy]}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const isLeader = leaderId === row.model_id;
              return (
                <tr
                  key={row.model_id}
                  className="border-b border-line last:border-b-0 hover:bg-surface-1"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isLeader && (
                        <Award
                          className="h-3 w-3 text-amber-400"
                          aria-label="Leader"
                        />
                      )}
                      <span className="text-ink">{row.model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-dim">{row.vendor}</td>
                  <td className="px-4 py-3 text-ink-faint">{row.release}</td>
                  {showAllScores ? (
                    AXES.map((axis) => (
                      <td
                        key={axis}
                        className="px-2 py-3 text-right font-mono text-xs text-ink-dim tabular-nums"
                      >
                        {getScore(row, axis).toFixed(0)}
                      </td>
                    ))
                  ) : (
                    <td className="px-4 py-3 text-right font-mono text-ink tabular-nums">
                      {getScore(row, sortBy).toFixed(0)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected.size > 0 && (
        <div className="mt-8 rounded-xl border border-line bg-surface-1 p-6">
          <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-4">
            Overlay
          </h3>
          <BenchmarkRadar rows={overlayRows} />
        </div>
      )}
    </div>
  );
}
