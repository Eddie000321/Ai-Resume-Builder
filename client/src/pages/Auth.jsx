import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authKeys, login, signup } from '../lib/auth';
import { useResumeDraft } from '../context/ResumeDraftContext';
import { api } from '../lib/api';

export function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { file, clear } = useResumeDraft();

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === 'login') {
        return login({ email: form.email, password: form.password });
      }
      return signup({ email: form.email, password: form.password, name: form.name || undefined });
    },
    onSuccess: async () => {
      setError('');
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          await api.post('/resumes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          clear();
        } catch (uploadError) {
          console.error('Failed to auto-upload resume', uploadError);
        }
      }
      const redirectTo = location.state?.from?.pathname ?? '/app';
      navigate(redirectTo, { replace: true });
    },
    onError: (err) => {
      setError(err.response?.data?.message ?? 'Authentication failed');
    },
  });

  const disabled =
    !form.email || !form.password || (mode === 'signup' && form.name.trim().length < 2);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <button
          type="button"
          className="text-xs uppercase tracking-[0.3em] text-slate-400"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">
          {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {file
            ? 'Got your résumé ready. Sign in so we can finish the upload.'
            : 'Sign in to access your scoring dashboard.'}
        </p>

        <div className="mt-8 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-slate-600">Name</label>
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Ada Lovelace"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          type="button"
          disabled={disabled || mutation.isPending}
          className="mt-6 w-full rounded-full bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60"
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? 'Processing…' : mode === 'login' ? 'Login' : 'Create account'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === 'login' ? 'Need an account?' : 'Already onboard?'}{' '}
          <button
            type="button"
            className="font-semibold text-brand"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
