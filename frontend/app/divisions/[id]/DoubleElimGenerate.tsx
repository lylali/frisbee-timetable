"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Team } from "@/lib/types";

interface Props {
  phaseId: string;
  teams: Team[];
}

export default function DoubleElimGenerate({ phaseId, teams }: Props) {
  const router = useRouter();
  const [seeds, setSeeds] = useState<Team[]>(
    [...teams].sort((a, b) => (a.seed ?? 99) - (b.seed ?? 99))
  );
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function moveUp(i: number) {
    if (i === 0) return;
    setSeeds((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(i: number) {
    if (i === seeds.length - 1) return;
    setSeeds((prev) => {
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/phases/${phaseId}/double-elim/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamIds: seeds.map((t) => t.id) }),
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
        Double elimination bracket generated!
      </div>
    );
  }

  const validCount = seeds.length === 4 || seeds.length === 8;

  return (
    <div className="space-y-3">
      {!validCount && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          Double elimination requires exactly 4 or 8 teams. Currently {seeds.length} teams.
        </p>
      )}
      <p className="text-xs text-gray-500">Reorder to set seeding. Winners bracket + losers bracket + grand final.</p>

      <ol className="space-y-1.5">
        {seeds.map((team, i) => (
          <li key={team.id} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <span className="w-5 text-center text-xs font-semibold text-gray-400">{i + 1}</span>
            <span className="flex-1 text-sm font-medium text-gray-800">{team.name}</span>
            <div className="flex gap-1">
              <button onClick={() => moveUp(i)} disabled={i === 0}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-20">▲</button>
              <button onClick={() => moveDown(i)} disabled={i === seeds.length - 1}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-20">▼</button>
            </div>
          </li>
        ))}
      </ol>

      <button
        onClick={generate}
        disabled={generating || !validCount}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {generating ? "Generating…" : "Generate Double Elimination"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
