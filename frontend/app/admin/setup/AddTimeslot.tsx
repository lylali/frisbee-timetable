"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTimeslot({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [dayDate, setDayDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dayDate || !startTime || !endTime) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/timeslots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayDate,
          startTime,
          endTime,
          label: label.trim() || null,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setDayDate(""); setStartTime(""); setEndTime(""); setLabel("");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Add timeslot
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Date</label>
          <input
            type="date" value={dayDate} onChange={(e) => setDayDate(e.target.value)} required
            className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Label (optional)</label>
          <input
            value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Day 1 Round 1"
            className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Start time</label>
          <input
            type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required
            className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">End time</label>
          <input
            type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required
            className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit" disabled={saving}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Add timeslot"}
        </button>
        <button
          type="button" onClick={() => setOpen(false)}
          className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
