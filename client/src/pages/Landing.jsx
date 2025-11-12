import { Link } from 'react-router-dom';
import { ResumeDropzone } from '../features/resume/ResumeDropzone';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Resume AI Lab</p>
          <h1 className="text-3xl font-semibold text-slate-900">Match Studio</h1>
        </div>
        <Link
          to="/auth"
          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700"
        >
          Login
        </Link>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 md:flex-row">
        <div className="md:w-1/2">
          <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            ATS ready in minutes
          </span>
          <h2 className="mt-4 text-4xl font-semibold text-slate-900">
            Drop your résumé, get instant fit scores, and actionable rewrite tips.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            We analyze your PDF against any job description, score semantic overlap, keyword
            coverage, and ATS compliance, then surface concrete improvements.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <p>✅ Secure PDF parsing</p>
            <p>✅ Keyword & experience alignment</p>
            <p>✅ AI rewrite suggestions</p>
          </div>
        </div>
        <div className="md:w-1/2">
          <ResumeDropzone />
          <p className="mt-4 text-center text-xs text-slate-400">
            No account yet? Drop your resume to start — we’ll ask you to sign in next.
          </p>
        </div>
      </main>
    </div>
  );
}
