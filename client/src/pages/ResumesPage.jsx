import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export function ResumesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const { data } = await api.get("/resumes");
      return data.resumes ?? [];
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (resumeId) => {
      await api.delete(`/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const handleDelete = (resumeId) => {
    if (window.confirm("Are you sure you want to delete this résumé?")) {
      deleteMutation.mutate(resumeId);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">My Résumé List</h1>

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          ← Back
        </button>
      </div>

      {resumesQuery.isLoading && <p>Loading resumes...</p>}
      {resumesQuery.isError && (
        <p className="text-red-500">Failed to load resume list.</p>
      )}

      <div className="space-y-4">
        {(resumesQuery.data ?? []).map((resume) => (
          <div
            key={resume._id}
            className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            {/* Resume Info */}
            <div>
              <p className="text-slate-900 font-medium">{resume.filename}</p>
              <p className="text-slate-500 text-sm">
                Uploaded: {new Date(resume.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {/* Download Button */}
              <a
                href={resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Download
              </a>

              {/* 🔥 Delete Button */}
              <button
                onClick={() => handleDelete(resume._id)}
                className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {resumesQuery.data?.length === 0 && (
          <p className="text-slate-500">No resumes uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
