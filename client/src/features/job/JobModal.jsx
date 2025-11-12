import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../lib/api';

export function JobModal({ open, onClose, resumes, onJobCreated }) {
  const [form, setForm] = useState({ title: '', company: '', rawText: '', resumeId: '' });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/jobs', {
        title: form.title || undefined,
        company: form.company || undefined,
        rawText: form.rawText,
      });
      return data.job;
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      onJobCreated?.(job, form.resumeId || undefined);
      setForm({ title: '', company: '', rawText: '', resumeId: '' });
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">New Match</h2>
            <p className="text-sm text-slate-500">Paste the job description and choose a résumé.</p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-500">
            Close
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Job Title</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="AI Engineer"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Company</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              placeholder="NeoTech Labs"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Job Description</label>
            <textarea
              className="min-h-[160px] rounded-lg border border-slate-200 px-3 py-2"
              value={form.rawText}
              onChange={(event) => setForm((prev) => ({ ...prev, rawText: event.target.value }))}
              placeholder="Responsibilities..."
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Résumé</label>
            <select
              className="rounded-lg border border-slate-200 px-3 py-2"
              value={form.resumeId}
              onChange={(event) => setForm((prev) => ({ ...prev, resumeId: event.target.value }))}
            >
              <option value="">Select a resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.filename ?? 'Untitled'} ({new Date(resume.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          disabled={!form.rawText || !form.resumeId || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="mt-6 w-full rounded-full bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {mutation.isPending ? 'Creating...' : 'Create Match'}
        </button>
      </div>
    </div>
  );
}
