'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  LLM_RATES,
  FAMILY_LABEL,
  estimateMonthlyCost,
  type LLMRate,
} from '@/lib/llm-rates';
import { cn } from '@/lib/cn';

const DEFAULT_INPUT = 100_000;
const DEFAULT_OUTPUT = 50_000;
const DEFAULT_CACHE = 40;

function formatTokens(n: number): string {
  return n.toLocaleString('en-US');
}

function formatUsd(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function cheapestRate(rates: LLMRate[]): LLMRate {
  return rates.reduce((min, r) => (r.input + r.output < min.input + min.output ? r : min), rates[0]);
}

export default function TokenCalculator() {
  const [inputTokens, setInputTokens] = useState(DEFAULT_INPUT);
  const [outputTokens, setOutputTokens] = useState(DEFAULT_OUTPUT);
  const [cacheHit, setCacheHit] = useState(DEFAULT_CACHE);
  const [selectedId, setSelectedId] = useState(LLM_RATES[0].id);

  const selected = useMemo(
    () => LLM_RATES.find((r) => r.id === selectedId) ?? LLM_RATES[0],
    [selectedId],
  );

  const cacheRate = cacheHit / 100;

  const total = useMemo(
    () =>
      estimateMonthlyCost({
        rate: selected,
        inputTokensPerDay: inputTokens,
        outputTokensPerDay: outputTokens,
        cacheHitRate: cacheRate,
      }),
    [selected, inputTokens, outputTokens, cacheRate],
  );

  const breakdown = useMemo(() => {
    const days = 30;
    const inputMillions = (inputTokens * days) / 1_000_000;
    const outputMillions = (outputTokens * days) / 1_000_000;
    const cachedPart = selected.cached_input != null ? cacheRate : 0;
    const inputBaseline = inputMillions * selected.input;
    const inputBilled =
      selected.cached_input != null
        ? inputMillions *
          (selected.cached_input * cachedPart + selected.input * (1 - cachedPart))
        : inputMillions * selected.input;
    const outputCost = outputMillions * selected.output;
    const cacheSavings = inputBaseline - inputBilled;
    return {
      inputCost: inputBilled,
      outputCost,
      cacheSavings,
      cacheApplies: selected.cached_input != null,
    };
  }, [selected, inputTokens, outputTokens, cacheRate]);

  const cheapest = useMemo(() => cheapestRate(LLM_RATES), []);
  const cheapestCost = useMemo(
    () =>
      estimateMonthlyCost({
        rate: cheapest,
        inputTokensPerDay: inputTokens,
        outputTokensPerDay: outputTokens,
        cacheHitRate: cacheRate,
      }),
    [cheapest, inputTokens, outputTokens, cacheRate],
  );

  return (
    <div className="rounded-xl border border-line bg-surface-1 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-medium text-ink">Token cost calculator</h3>
        <p className="text-xs text-ink-faint">
          as of early 2026, rates change quickly
        </p>
      </div>

      {/* Model strip */}
      <div className="mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {LLM_RATES.map((r) => {
          const active = r.id === selectedId;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedId(r.id)}
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors',
                active
                  ? 'bg-accent text-white'
                  : 'border border-line bg-surface-1 text-ink-dim hover:border-line-3 hover:text-ink',
              )}
            >
              <span className="font-medium">{FAMILY_LABEL[r.family]}</span>
              <span className="ml-1.5 text-[11px] opacity-80">{r.model}</span>
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <SliderField
          label="Input tokens/day"
          value={inputTokens}
          display={formatTokens(inputTokens)}
          min={0}
          max={2_000_000}
          step={10_000}
          onChange={setInputTokens}
        />
        <SliderField
          label="Output tokens/day"
          value={outputTokens}
          display={formatTokens(outputTokens)}
          min={0}
          max={1_000_000}
          step={5_000}
          onChange={setOutputTokens}
        />
        <SliderField
          label="Cache hit rate"
          value={cacheHit}
          display={`${cacheHit}%`}
          min={0}
          max={100}
          step={1}
          onChange={setCacheHit}
        />
      </div>

      {/* Result */}
      <div className="mt-6 rounded-lg border border-line bg-surface-1 p-5">
        <div className="text-xs uppercase tracking-wider text-ink-faint">
          Estimated monthly cost
        </div>
        <div className="mt-1 text-4xl font-medium tracking-tight text-ink">
          {formatUsd(total)}
          <span className="ml-1 text-base text-ink-faint">/mo</span>
        </div>

        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <BreakdownRow label="Input" value={formatUsd(breakdown.inputCost)} />
          <BreakdownRow label="Output" value={formatUsd(breakdown.outputCost)} />
          <BreakdownRow
            label="Cache savings"
            value={
              breakdown.cacheApplies
                ? `-${formatUsd(breakdown.cacheSavings)}`
                : 'n/a'
            }
            tone={breakdown.cacheApplies ? 'success' : 'muted'}
          />
        </div>

        {selected.id !== cheapest.id && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-surface-1 px-3 py-1.5 text-xs text-ink-dim">
            <Sparkles className="h-3 w-3 text-accent" />
            Cheapest option: {cheapest.vendor} {cheapest.model} at{' '}
            <span className="font-medium text-ink">{formatUsd(cheapestCost)}/mo</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-ink-dim">{label}</span>
        <span className="font-mono text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-accent"
      />
    </label>
  );
}

function BreakdownRow({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'muted';
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-line bg-surface-1 px-3 py-2">
      <span className="text-xs uppercase tracking-wider text-ink-faint">
        {label}
      </span>
      <span
        className={cn(
          'font-mono text-sm',
          tone === 'success' && 'text-success',
          tone === 'muted' && 'text-ink-faint',
          tone === 'default' && 'text-ink',
        )}
      >
        {value}
      </span>
    </div>
  );
}
