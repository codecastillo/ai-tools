'use client';

import { useMemo, useState } from 'react';
import { Users, MessageSquare, Brain, Zap, Sparkles } from 'lucide-react';
import { LLM_RATES, type LLMRate } from '@/lib/llm-rates';

const DEFAULT_USERS_LOG = 3; // 1,000 users
const DEFAULT_MSG_PER_DAY = 20;
const DEFAULT_AVG_INPUT = 1_000;
const DEFAULT_AVG_OUTPUT = 500;
const DEFAULT_CACHE_HIT = 30;

interface ModelCost {
  rate: LLMRate;
  cost: number;
  family: LLMRate['family'];
}

function formatUsd(cost: number): string {
  if (cost < 1) return cost.toFixed(2);
  return Math.round(cost).toLocaleString('en-US');
}

export default function CostSimulator() {
  const [usersLog, setUsersLog] = useState(DEFAULT_USERS_LOG);
  const [msgPerUserPerDay, setMsgPerUserPerDay] = useState(DEFAULT_MSG_PER_DAY);
  const [avgInputTokens, setAvgInputTokens] = useState(DEFAULT_AVG_INPUT);
  const [avgOutputTokens, setAvgOutputTokens] = useState(DEFAULT_AVG_OUTPUT);
  const [cacheHitPct, setCacheHitPct] = useState(DEFAULT_CACHE_HIT);

  const users = useMemo(() => Math.round(Math.pow(10, usersLog)), [usersLog]);
  const cacheHit = cacheHitPct / 100;

  const results = useMemo<ModelCost[]>(() => {
    const inputTokensMonth =
      users * msgPerUserPerDay * 30 * avgInputTokens;
    const outputTokensMonth =
      users * msgPerUserPerDay * 30 * avgOutputTokens;

    return LLM_RATES.map((rate) => {
      const cachedInputCost = rate.cached_input ?? rate.input;
      const effectiveInputPrice =
        cacheHit * cachedInputCost + (1 - cacheHit) * rate.input;
      const cost =
        (inputTokensMonth / 1_000_000) * effectiveInputPrice +
        (outputTokensMonth / 1_000_000) * rate.output;
      return { rate, cost, family: rate.family };
    }).sort((a, b) => a.cost - b.cost);
  }, [
    users,
    msgPerUserPerDay,
    avgInputTokens,
    avgOutputTokens,
    cacheHit,
  ]);

  const maxCost = results.length > 0 ? results[results.length - 1].cost : 1;
  const cheapest = results[0];

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-medium text-ink">Cost simulator</h2>
        <p className="mt-2 text-sm text-ink-dim">
          Estimate monthly API spend across providers.
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-5">
        {/* Sliders column */}
        <div className="space-y-5 md:col-span-2">
          <label className="block">
            <div className="flex justify-between text-xs text-ink-dim">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-accent" /> Users
              </span>
              <span className="font-mono">{users.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.01}
              value={usersLog}
              onChange={(e) => setUsersLog(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>

          <label className="block">
            <div className="flex justify-between text-xs text-ink-dim">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-accent" /> Messages /
                user / day
              </span>
              <span className="font-mono">{msgPerUserPerDay}</span>
            </div>
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={msgPerUserPerDay}
              onChange={(e) => setMsgPerUserPerDay(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>

          <label className="block">
            <div className="flex justify-between text-xs text-ink-dim">
              <span className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-accent" /> Avg input tokens
              </span>
              <span className="font-mono">
                {avgInputTokens.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={8000}
              step={100}
              value={avgInputTokens}
              onChange={(e) => setAvgInputTokens(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>

          <label className="block">
            <div className="flex justify-between text-xs text-ink-dim">
              <span className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-accent" /> Avg output tokens
              </span>
              <span className="font-mono">
                {avgOutputTokens.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={4000}
              step={100}
              value={avgOutputTokens}
              onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>

          <label className="block">
            <div className="flex justify-between text-xs text-ink-dim">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-accent" /> Cache hit rate
              </span>
              <span className="font-mono">{cacheHitPct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={1}
              value={cacheHitPct}
              onChange={(e) => setCacheHitPct(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>
        </div>

        {/* Chart column */}
        <div className="md:col-span-3">
          {cheapest && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-surface-1 px-4 py-3">
              <Sparkles className="h-4 w-4 text-accent" />
              <div className="text-sm text-ink-dim">
                Cheapest:{' '}
                <strong className="text-ink">{cheapest.rate.model}</strong> at{' '}
                <strong className="text-ink">
                  ${formatUsd(cheapest.cost)}/mo
                </strong>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {results.map(({ rate, cost }) => (
              <div
                key={rate.id}
                className="grid grid-cols-[120px_1fr_80px] items-center gap-3 text-xs"
              >
                <span className="truncate text-ink-dim" title={rate.model}>
                  {rate.model}
                </span>
                <div className="relative h-5 rounded-md bg-surface-2">
                  <div
                    className="absolute inset-y-0 left-0 rounded-md bg-accent/60"
                    style={{
                      width: `${
                        maxCost > 0 ? (cost / maxCost) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-right font-mono text-ink-mute">
                  ${formatUsd(cost)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
