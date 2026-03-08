"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Team } from "@/lib/types";

interface Props {
  phaseId: string;
  teams: Team[];
}

export default function PoolPlayGenerate({ phaseId, teams }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const n = teams.length;
  const numRounds = n % 2 === 0 ? n - 1 : n;
  const numGames = (n * (n - 1)) / 2;

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/phases/${phaseId}/pool-play/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamIds: teams.map((t) => t.id) }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server error: ${res.status}`);
      }
      setDone(true);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        Schedule generated! {numGames} games across {numRounds} rounds.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Generate a full round-robin schedule for <strong>{n} teams</strong>:{" "}
        <span className="text-gray-500">{numGames} games across {numRounds} rounds.</span>
      </p>

      <ol className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {teams.map((t) => (
          <li key={t.id} className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-1.5 text-sm">
            <span className="w-4 text-xs text-gray-400">{t.seed ?? "—"}</span>
            <span className="font-medium text-gray-800">{t.name}</span>
          </li>
        ))}
      </ol>

      <button
        onClick={generate}
        disabled={generating || n < 2}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {generating ? "Generating…" : "Generate round-robin schedule"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
