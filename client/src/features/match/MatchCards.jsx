import { ScoreGauge } from '../../components/ScoreGauge';

const scoreLabels = [
  { key: 'semantic', label: 'Semantic' },
  { key: 'keyword', label: 'Keyword' },
  { key: 'experience', label: 'Experience' },
  { key: 'ats', label: 'ATS' },
];

export function MatchCards({ matches = [], isLoading }) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading matches...</p>;
  }

  if (!matches.length) {
    return <p className="text-sm text-slate-400">No matches yet. Create one to see insights.</p>;
  }

  return (
    <div className="grid gap-6">
      {matches.map((match) => (
        <div key={match._id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Result • {new Date(match.createdAt).toLocaleString()}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                Overall score {Math.round((match.scores?.overall ?? 0) * 100)}%
              </h3>
            </div>
            <ScoreGauge value={match.scores?.overall} label="Overall" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {scoreLabels.map((score) => (
              <div key={score.key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase text-slate-500">{score.label}</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {Math.round((match.scores?.[score.key] ?? 0) * 100)}%
                </p>
              </div>
            ))}
          </div>
          {match.suggestions && match.suggestions.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">Suggestions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
                {match.suggestions.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
