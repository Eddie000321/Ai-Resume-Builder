import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    alert("Profile saved (this is local only, no backend yet).");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">

      {/* Header + Back button row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">My Profile</h1>

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700">About Me</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
