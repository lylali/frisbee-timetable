"use client";

import { useState } from "react";
import { RosterEntry } from "@/lib/types";

export default function RosterManager({
  teamId,
  initialRoster,
}: {
  teamId: string;
  initialRoster: RosterEntry[];
}) {
  const [roster, setRoster] = useState<RosterEntry[]>(initialRoster);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/roster`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName.trim(), playerEmail: playerEmail.trim() || null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message ?? "Failed to add player");
        return;
      }
      const entry = await res.json();
      setRoster([...roster, entry]);
      setPlayerName("");
      setPlayerEmail("");
    } finally {
      setLoading(false);
    }
  }

  async function removePlayer(id: string) {
    const res = await fetch(`/api/roster/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRoster(roster.filter((r) => r.id !== id));
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Player list */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {roster.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">No players yet. Add your first player below.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {roster.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.playerName}</p>
                  {entry.playerEmail && (
                    <p className="text-xs text-gray-400">{entry.playerEmail}</p>
                  )}
                </div>
                <button
                  onClick={() => removePlayer(entry.id)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add player form */}
      <form onSubmit={addPlayer} className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">Add player</h2>
        <div className="flex gap-2">
          <input
            required
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Player name *"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={playerEmail}
            onChange={(e) => setPlayerEmail(e.target.value)}
            placeholder="Email (optional)"
            type="email"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
