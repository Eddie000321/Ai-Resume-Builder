import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';
import { JobModal } from '../features/job/JobModal';
import { MatchCards } from '../features/match/MatchCards';
import { Link } from "react-router-dom";   

export function Dashboard() {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const resumesQuery = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const { data } = await api.get('/resumes');
      return data.resumes ?? [];
    },
  });

  const matchesQuery = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data } = await api.get('/matches');
      return data.matches ?? [];
    },
    refetchInterval: 5000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const matchMutation = useMutation({
    mutationFn: async ({ resumeId, jobId }) => {
      await api.post('/matches', { resumeId, jobId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
    event.target.value = '';
  };

  const handleJobCreated = (job, resumeId) => {
    if (resumeId) {
      matchMutation.mutate({ jobId: job._id, resumeId });
    }
  };

  const latestResumeName = useMemo(() => {
    if (!resumesQuery.data?.length) return null;
    const [latest] = resumesQuery.data;
    return latest.filename ?? 'New resume';
  }, [resumesQuery.data]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Dashboard Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 mt-4">
        
        {/* Left side */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold text-slate-900">Match Workspace</h1>
        </div>

       {/* Right side */}
        <div className="ml-auto flex items-center gap-3">

          {/* Upload Resume */}
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Résumé
          </button>

          {/* New Match */}
          <button
            type="button"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setIsJobModalOpen(true)}
          >
            + New Match
          </button>

          

          {/* 🔥 Resume List */}
          <Link
            to="/resumes"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Resume List
          </Link>

          {/* 🔥 My Profile */}
          <Link
            to="/profile"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            My Profile
          </Link>
        </div>
          {/* 🔥 Sign Out */}
          <Link
            to="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Sign Out
          </Link>
        {/* Hidden File Input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleResumeUpload}
        />
      </header>

      {/* Main Content */}
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        
        {/* Latest Resume */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            {latestResumeName
              ? `Latest résumé: ${latestResumeName}`
              : 'Upload a résumé to unlock scoring.'}
          </p>
        </section>

        {/* Matches */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Matches</h2>
          </div>

          <div className="mt-4">
            <MatchCards
              matches={matchesQuery.data ?? []}
              isLoading={matchesQuery.isLoading}
            />
          </div>
        </section>
      </main>

      {/* Job Modal */}
      <JobModal
        open={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        resumes={resumesQuery.data ?? []}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
}
