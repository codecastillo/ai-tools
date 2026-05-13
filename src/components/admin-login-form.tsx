'use client';

import { useActionState } from 'react';
import { loginAdmin } from '@/app/admin/actions';

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, null);
  return (
    <form action={action} className="mt-5 space-y-3">
      <input
        type="password"
        name="password"
        autoFocus
        autoComplete="current-password"
        placeholder="Password"
        className="w-full rounded-md border border-white/[0.10] bg-white/[0.02] px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-accent/60 focus:outline-none"
      />
      {state && 'error' in state && state.error && (
        <p className="text-sm text-danger">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-bright disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
