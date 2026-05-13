'use client';
import { useActionState, useEffect, useRef } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { subscribeNewsletter, type SubscribeState } from '@/app/actions/newsletter';
import { celebrate } from '@/lib/confetti';

const initialState: SubscribeState = { status: 'idle' };

export default function NewsletterSignup() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const lastCelebratedRef = useRef<SubscribeState | null>(null);

  useEffect(() => {
    if (state.status === 'success' && lastCelebratedRef.current !== state) {
      lastCelebratedRef.current = state;
      void celebrate();
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface-1 p-8 md:p-10 text-center">
      <Mail className="h-6 w-6 text-accent mx-auto" />
      <h2 className="mt-3 text-2xl font-medium text-ink">Get updates</h2>
      <p className="mt-2 text-ink-mute">
        A short email when we add new tools or ship a major round. No marketing fluff.
      </p>

      <form
        ref={formRef}
        action={formAction}
        className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
      >
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          className="flex-1 rounded-md border border-line-2 bg-surface-1 px-4 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none"
        />
        <input type="hidden" name="source" value="homepage" />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright disabled:opacity-60"
        >
          {pending ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {state.status !== 'idle' && state.message ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 flex items-center justify-center gap-2 text-sm"
        >
          {state.status === 'success' ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">{state.message}</span>
            </>
          ) : null}
          {state.status === 'duplicate' ? (
            <span className="text-ink-mute">{state.message}</span>
          ) : null}
          {state.status === 'error' ? (
            <>
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400">{state.message}</span>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
