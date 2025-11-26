import { Link } from "react-router-dom";

export function NavBar() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      {/* Left: Logo + Site Name */}
      <div className="flex items-center gap-3">
        <img
          src="/teamlogo.jpg"  
          alt="Team Logo"
          className="h-20 w-20"
        /> 
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Resume AI Lab
          </p>
          <h1 className="text-xl font-semibold text-slate-900">Match Studio</h1>
        </div>
      </div>

      {/* Right: Navigation Items */}
      <nav className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            <Link
              to="/auth"
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/resumes"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              Resumes
            </Link>

            <Link
              to="/profile"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              My Profile
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              Sign Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
