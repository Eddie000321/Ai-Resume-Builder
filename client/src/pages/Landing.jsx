import { NavBar } from "../components/NavBar.jsx";
import { ResumeDropzone } from "../features/resume/ResumeDropzone";
import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 md:flex-row">
        <div className="md:w-1/2">
          <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            ATS ready in minutes
          </span>

          <h2 className="mt-4 text-4xl font-semibold text-slate-900">
            Drop your résumé, get instant fit scores, and actionable rewrite tips.
          </h2>
          <p className="text-sm text-slate-500 mt-2">
               This update is for CI/CD demonstration.
          </p>


          <p className="mt-4 text-lg text-slate-500">
            We analyze your PDF against any job description, score semantic overlap,
            keyword coverage, and ATS compliance, then surface concrete improvements.
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
            No account yet? Drop your résumé to start — we will ask you to sign in next.
          </p>
        </div>
      </main>
    </div>
  );
}
