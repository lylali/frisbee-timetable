"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Team } from "@/lib/types";

interface Props {
  phaseId: string;
  teams: Team[];
}

export default function PagePlayoffGenerate({ phaseId, teams }: Props) {
  const router = useRouter();
  const [seeds, setSeeds] = useState<Team[]>(
    [...teams].sort((a, b) => (a.seed ?? 99) - (b.seed ?? 99)).slice(0, 4)
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
      const res = await fetch(`/api/phases/${phaseId}/page-playoff/generate`, {
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
        Page playoff generated!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Reorder to set seeds 1–4. Format: P1 (S1vS2), P2 (S3vS4), Semi (L1 vs W2), Final (W1 vs W-Semi).
      </p>

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
        disabled={generating || seeds.length !== 4}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {generating ? "Generating…" : "Generate Page Playoff"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
