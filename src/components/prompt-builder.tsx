'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  User,
  ListChecks,
  Quote,
  Code2,
  Bug,
  BookOpen,
  TestTube2,
  FileText,
  Network,
  Bot,
  HelpCircle,
  GraduationCap,
  Eye,
  Brain,
  AlertTriangle,
  List,
  ListOrdered,
  Hash,
  Braces,
  Square,
  AlignLeft,
  Save,
} from 'lucide-react';

type StepNum = 1 | 2 | 3 | 4 | 5;

interface OptionDef {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TASK_OPTIONS: OptionDef[] = [
  {
    id: 'refactor',
    label: 'Refactor code',
    description: 'Improve structure without changing behavior.',
    icon: Code2,
  },
  {
    id: 'debug',
    label: 'Debug an issue',
    description: 'Find a root cause and propose a fix.',
    icon: Bug,
  },
  {
    id: 'explain',
    label: 'Explain code',
    description: 'Walk through what a snippet does and why.',
    icon: BookOpen,
  },
  {
    id: 'tests',
    label: 'Write tests',
    description: 'Generate unit or integration tests.',
    icon: TestTube2,
  },
  {
    id: 'docs',
    label: 'Write documentation',
    description: 'Draft a README, API doc, or guide.',
    icon: FileText,
  },
  {
    id: 'design',
    label: 'Design a system',
    description: 'Sketch architecture or trade-offs.',
    icon: Network,
  },
  {
    id: 'agent',
    label: 'Build an agent',
    description: 'Plan tools, prompts, and control flow.',
    icon: Bot,
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else.',
    icon: HelpCircle,
  },
];

const TASK_DESCRIPTIONS: Record<string, string> = {
  refactor:
    'Refactor the code I share to improve clarity and structure without changing observable behavior',
  debug: 'Debug the issue I describe by locating the root cause and proposing a concrete fix',
  explain: 'Explain the code I share clearly, walking through what it does and why',
  tests: 'Write thorough tests for the code or behavior I describe',
  docs: 'Write clear, accurate documentation for the code or feature I describe',
  design: 'Help me design a system, weighing architectural trade-offs explicitly',
  agent: 'Help me build an agent, planning tools, prompts, and control flow',
  other: 'Help me with the task I describe below',
};

const ROLE_OPTIONS: OptionDef[] = [
  {
    id: 'senior',
    label: 'Senior engineer',
    description: 'Pragmatic, opinionated, ships working code.',
    icon: User,
  },
  {
    id: 'reviewer',
    label: 'Code reviewer',
    description: 'Reads carefully, flags risks, suggests fixes.',
    icon: Eye,
  },
  {
    id: 'tutor',
    label: 'Tutor',
    description: 'Patient teacher who explains step by step.',
    icon: GraduationCap,
  },
  {
    id: 'expert',
    label: 'Domain expert',
    description: 'Deep knowledge in the relevant domain.',
    icon: Brain,
  },
  {
    id: 'critic',
    label: 'Skeptical critic',
    description: 'Challenges assumptions and stress-tests ideas.',
    icon: AlertTriangle,
  },
  {
    id: 'custom',
    label: 'Other',
    description: 'Describe a custom role.',
    icon: Sparkles,
  },
];

const ROLE_TONES: Record<string, string> = {
  senior:
    'Be pragmatic and direct. Prefer working code and clear reasoning over hedging',
  reviewer:
    'Read carefully, call out risks, edge cases, and unclear assumptions, then suggest concrete fixes',
  tutor:
    'Teach patiently. Explain step by step and check that each idea is grounded before moving on',
  expert:
    'Apply deep domain knowledge. Cite the relevant concepts and call out where intuition can mislead',
  critic:
    'Stress-test the idea. Challenge assumptions, surface failure modes, and push back on weak reasoning',
};

const FORMAT_OPTIONS: OptionDef[] = [
  {
    id: 'bullets',
    label: 'Bullet list',
    description: 'Short bulleted points.',
    icon: List,
  },
  {
    id: 'numbered',
    label: 'Numbered steps',
    description: 'Ordered, step-by-step instructions.',
    icon: ListOrdered,
  },
  {
    id: 'markdown',
    label: 'Markdown sections',
    description: 'Headed sections with prose.',
    icon: Hash,
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'A single JSON object, nothing else.',
    icon: Braces,
  },
  {
    id: 'code',
    label: 'Code block only',
    description: 'Just a fenced code block.',
    icon: Square,
  },
  {
    id: 'freeform',
    label: 'Free-form',
    description: 'Prose, no fixed structure.',
    icon: AlignLeft,
  },
];

const FORMAT_DETAILS: Record<string, string> = {
  bullets: 'Return your answer as a concise bullet list',
  numbered: 'Return your answer as a numbered, step-by-step list',
  markdown:
    'Return your answer as Markdown with clear section headings (use `##` for top-level sections)',
  json: 'Return your answer as a single JSON object and nothing else. No prose, no code fences',
  code: 'Return your answer as a single fenced code block. No surrounding prose',
  freeform: 'Return your answer as clear prose. No required structure',
};

interface HistoryEntry {
  id: string;
  timestamp: number;
  task: string;
  role: string;
  customRole: string;
  format: string;
  context: string;
  prompt: string;
}

const STORAGE_KEY = 'aitools_prompt_history';
const MAX_HISTORY = 5;

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is HistoryEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as HistoryEntry).id === 'string' &&
        typeof (e as HistoryEntry).prompt === 'string',
    );
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // ignore
  }
}

function buildPrompt(args: {
  task: string;
  role: string;
  customRole: string;
  format: string;
  context: string;
}): string {
  const roleLabel =
    args.role === 'custom'
      ? args.customRole.trim() || 'helpful assistant'
      : ROLE_OPTIONS.find((r) => r.id === args.role)?.label.toLowerCase() ||
        'helpful assistant';

  const tone =
    args.role === 'custom'
      ? 'Stay in that role consistently throughout your reply'
      : ROLE_TONES[args.role] || '';

  const taskLine = TASK_DESCRIPTIONS[args.task] || TASK_DESCRIPTIONS.other;
  const formatLine = FORMAT_DETAILS[args.format] || FORMAT_DETAILS.freeform;
  const extras = args.context.trim();

  const lines = [
    `You are a ${roleLabel}. ${tone}.`,
    '',
    `Task: ${taskLine}.`,
    '',
    `Output format: ${formatLine}.`,
  ];

  if (extras) {
    lines.push('', extras);
  }

  return lines.join('\n');
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${time}`;
}

function summarize(entry: HistoryEntry): string {
  const taskLabel =
    TASK_OPTIONS.find((t) => t.id === entry.task)?.label || 'Task';
  const roleLabel =
    entry.role === 'custom'
      ? entry.customRole || 'Custom role'
      : ROLE_OPTIONS.find((r) => r.id === entry.role)?.label || 'Role';
  const formatLabel =
    FORMAT_OPTIONS.find((f) => f.id === entry.format)?.label || 'Format';
  return `${taskLabel} - ${roleLabel} - ${formatLabel}`;
}

interface OptionCardProps {
  option: OptionDef;
  selected: boolean;
  onSelect: () => void;
}

function OptionCard({ option, selected, onSelect }: OptionCardProps) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative rounded-xl border p-5 transition text-left cursor-pointer ${
        selected
          ? 'border-accent bg-accent/[0.04]'
          : 'border-line bg-surface-2 hover:bg-surface-3 hover:border-line-2'
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-bg">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      <Icon className="h-5 w-5 text-accent" />
      <div className="mt-3 font-medium text-ink">{option.label}</div>
      <div className="mt-1 text-sm text-ink-mute">{option.description}</div>
    </button>
  );
}

interface StepIndicatorProps {
  step: StepNum;
}

function StepIndicator({ step }: StepIndicatorProps) {
  const displayStep = step === 5 ? 4 : step;
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-wider text-ink-mute">
        Step {displayStep} of 4
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full ${
              i <= displayStep ? 'bg-accent' : 'bg-surface-3'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PromptBuilder() {
  const [step, setStep] = useState<StepNum>(1);
  const [task, setTask] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const prompt = useMemo(
    () => buildPrompt({ task, role, customRole, format, context }),
    [task, role, customRole, format, context],
  );

  const canAdvance = useMemo(() => {
    if (step === 1) return Boolean(task);
    if (step === 2) {
      if (!role) return false;
      if (role === 'custom') return customRole.trim().length > 0;
      return true;
    }
    if (step === 3) return Boolean(format);
    if (step === 4) return true;
    return false;
  }, [step, task, role, customRole, format]);

  function next() {
    if (!canAdvance) return;
    setStep((s) => (Math.min(5, s + 1) as StepNum));
  }

  function back() {
    setStep((s) => (Math.max(1, s - 1) as StepNum));
  }

  function reset() {
    setStep(1);
    setTask('');
    setRole('');
    setCustomRole('');
    setFormat('');
    setContext('');
    setCopied(false);
  }

  function saveCurrent() {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      task,
      role,
      customRole,
      format,
      context,
      prompt,
    };
    const updated = [entry, ...history].slice(0, MAX_HISTORY);
    setHistory(updated);
    saveHistory(updated);
  }

  function saveAndReset() {
    saveCurrent();
    reset();
  }

  function restore(entry: HistoryEntry) {
    setTask(entry.task);
    setRole(entry.role);
    setCustomRole(entry.customRole);
    setFormat(entry.format);
    setContext(entry.context);
    setStep(5);
    setCopied(false);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-8 md:p-12 text-center max-w-3xl mx-auto">
      {step !== 5 && <StepIndicator step={step} />}

      {step === 1 && (
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-medium text-ink text-center">
            What are you trying to do?
          </h2>
          <p className="mt-2 text-ink-mute text-center">
            Pick the task that best fits what you need.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TASK_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.id}
                option={opt}
                selected={task === opt.id}
                onSelect={() => setTask(opt.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-medium text-ink text-center">
            What role should the AI take?
          </h2>
          <p className="mt-2 text-ink-mute text-center">
            A clear persona keeps the response focused.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.id}
                option={opt}
                selected={role === opt.id}
                onSelect={() => setRole(opt.id)}
              />
            ))}
          </div>
          {role === 'custom' && (
            <div className="mt-4">
              <label className="block text-sm text-ink-mute mb-2">
                Describe the custom role
              </label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. staff security engineer reviewing Rust"
                className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
              />
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-medium text-ink text-center">
            How should the response be structured?
          </h2>
          <p className="mt-2 text-ink-mute text-center">
            Pick the shape that fits how you will use the answer.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FORMAT_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.id}
                option={opt}
                selected={format === opt.id}
                onSelect={() => setFormat(opt.id)}
              />
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-medium text-ink text-center">
            Examples or constraints
          </h2>
          <p className="mt-2 text-ink-mute text-center">
            Paste context, examples, or rules to follow. Optional.
          </p>
          <div className="mt-8">
            <label className="flex items-center gap-2 text-sm text-ink-mute mb-2">
              <Quote className="h-4 w-4" />
              Context, examples, or constraints
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={10}
              placeholder="Example: target Python 3.12; do not introduce new dependencies; assume the reader knows async basics."
              className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent font-mono text-sm"
            />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="text-left">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <ListChecks className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-medium text-ink">
              Your prompt is ready
            </h2>
            <p className="mt-2 text-ink-mute">
              Copy it into your favorite assistant, or tweak and save it.
            </p>
          </div>

          <div className="mt-8 relative rounded-xl border border-line bg-surface-2">
            <button
              type="button"
              onClick={copyPrompt}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-3 px-2.5 py-1.5 text-xs text-ink-dim hover:text-ink hover:border-line-2 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
            <pre className="whitespace-pre-wrap break-words p-5 pr-24 text-sm text-ink font-mono">
              {prompt}
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm text-ink hover:bg-surface-3 hover:border-line-2 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" /> Start over
            </button>
            <button
              type="button"
              onClick={saveAndReset}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-bg hover:bg-accent-bright transition cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save and try again
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-10 border-t border-line pt-6">
              <div className="text-xs uppercase tracking-wider text-ink-mute mb-3">
                Recent builds
              </div>
              <ul className="space-y-2">
                {history.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => restore(entry)}
                      className="w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-left hover:bg-surface-3 hover:border-line-2 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-ink">{summarize(entry)}</span>
                        <span className="text-xs text-ink-faint shrink-0">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {step !== 5 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm text-ink hover:bg-surface-3 hover:border-line-2 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface-2 disabled:hover:border-line"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-bg hover:bg-accent-bright transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent"
          >
            {step === 4 ? 'Build prompt' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
