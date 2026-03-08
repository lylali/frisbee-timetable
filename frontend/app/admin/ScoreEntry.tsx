"use client";

import { useState } from "react";
import { Game } from "@/lib/types";

interface Props {
  game: Game;
  label: string;
  time?: string;
}

export default function ScoreEntry({ game, label, time }: Props) {
  const [open, setOpen] = useState(false);
  const [score1, setScore1] = useState(game.team1Score?.toString() ?? "");
  const [score2, setScore2] = useState(game.team2Score?.toString() ?? "");
  const [status, setStatus] = useState(game.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/games/${game.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1Score: score1 !== "" ? parseInt(score1) : null,
          team2Score: score2 !== "" ? parseInt(score2) : null,
          status,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSaved(true);
      setOpen(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const statusColor =
    status === "FINAL"
      ? "bg-green-50 border-green-200"
      : status === "IN_PROGRESS"
      ? "bg-yellow-50 border-yellow-200"
      : "bg-white";

  return (
    <div className={`px-4 py-3 ${statusColor}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-center justify-between"
      >
        <div>
          <div className="font-medium text-gray-800">{label}</div>
          <div className="text-xs text-gray-400 mt-0.5 flex gap-2">
            {time && <span>{time}</span>}
            {game.roundLabel && <span>· {game.roundLabel}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4 shrink-0">
          {(game.team1Score != null && game.team2Score != null) || saved ? (
            <span className="font-semibold text-gray-700 text-sm">
              {score1} – {score2}
            </span>
          ) : null}
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
              status === "FINAL"
                ? "bg-green-100 text-green-700"
                : status === "IN_PROGRESS"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {status}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">
                {game.team1?.name ?? game.team1Source ?? "Team 1"}
              </label>
              <input
                type="number"
                min={0}
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                className="w-16 rounded border border-gray-300 px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="0"
              />
            </div>

            <span className="text-gray-400 pb-1.5 font-medium">–</span>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">
                {game.team2?.name ?? game.team2Source ?? "Team 2"}
              </label>
              <input
                type="number"
                min={0}
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                className="w-16 rounded border border-gray-300 px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="0"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="FINAL">FINAL</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="ml-auto rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          {saved && <p className="mt-2 text-xs text-green-600">Saved!</p>}
        </div>
      )}
    </div>
  );
}
