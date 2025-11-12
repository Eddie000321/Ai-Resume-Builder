export function ScoreGauge({ value = 0, label }) {
  const normalized = Math.round((value ?? 0) * 100);

  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
        <svg className="absolute inset-0" viewBox="0 0 36 36">
          <path
            className="text-slate-200"
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="text-brand"
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${normalized}, 100`}
          />
        </svg>
        <span className="text-2xl font-bold text-slate-900">{normalized}%</span>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
