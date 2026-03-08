"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Team } from "@/lib/types";

interface Props {
  phaseId: string;
  teams: Team[];
}

export default function BracketGenerate({ phaseId, teams }: Props) {
  const router = useRouter();
  // Start with teams sorted by seed ascending
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
      const res = await fetch(`/api/phases/${phaseId}/bracket/generate`, {
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
        Bracket generated! Scroll up to see the games, or{" "}
        <a href="#" onClick={() => router.refresh()} className="underline">refresh</a>.
      </div>
    );
  }

  const isPowerOf2 = seeds.length >= 2 && (seeds.length & (seeds.length - 1)) === 0;

  return (
    <div className="space-y-3">
      {!isPowerOf2 && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          Bracket generation requires a power-of-2 team count (2, 4, 8, 16…). Currently {seeds.length} teams.
        </p>
      )}

      <p className="text-xs text-gray-500">Drag to reorder seeds. Seed 1 is the top seed.</p>

      <ol className="space-y-1.5">
        {seeds.map((team, i) => (
          <li key={team.id} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <span className="w-5 text-center text-xs font-semibold text-gray-400">{i + 1}</span>
            <span className="flex-1 text-sm font-medium text-gray-800">{team.name}</span>
            <div className="flex gap-1">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-20"
                title="Move up"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(i)}
                disabled={i === seeds.length - 1}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-20"
                title="Move down"
              >
                ▼
              </button>
            </div>
          </li>
        ))}
      </ol>

      <button
        onClick={generate}
        disabled={generating || !isPowerOf2}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {generating ? "Generating…" : "Generate bracket"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
