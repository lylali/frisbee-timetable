"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserTeamEntry } from "@/lib/types";

export default function RegisterForm({
  tournamentId,
  divisionId,
  userId,
  previousTeams,
}: {
  tournamentId: string;
  divisionId: string | null;
  userId: string;
  previousTeams: UserTeamEntry[];
}) {
  const router = useRouter();
  const [selectedDivision, setSelectedDivision] = useState(divisionId ?? "");
  const [name, setName] = useState("");
  const [club, setClub] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill from a previous team
  function prefill(team: UserTeamEntry) {
    setName(team.teamName);
    setClub(team.club ?? "");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const divId = selectedDivision || divisionId;
    if (!divId) {
      setError("Please select a division");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/divisions/${divId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), club: club.trim() || null, leaderId: userId }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message ?? "Registration failed");
        return;
      }
      const team = await res.json();
      router.push(`/tournaments/${tournamentId}/roster?teamId=${team.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Previous teams shortcut */}
      {previousTeams.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Re-use a previous team name</p>
          <div className="flex flex-wrap gap-2">
            {previousTeams.map((t) => (
              <button
                key={t.teamId}
                type="button"
                onClick={() => prefill(t)}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                {t.teamName} {t.club ? `(${t.club})` : ""}
                <span className="text-gray-400 ml-1">· {t.tournamentName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {!divisionId && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Division *</label>
            <input
              required
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              placeholder="Division ID"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Team name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Canberra Surge"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Club (optional)</label>
          <input
            value={club}
            onChange={(e) => setClub(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Canberra Ultimate"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registering…" : "Register & add players"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
