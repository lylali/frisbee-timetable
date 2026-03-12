"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PHASE_TYPES = ["POOL_PLAY", "BRACKET", "PLACEMENT", "PAGE_PLAYOFF", "DOUBLE_ELIMINATION"];

interface DivisionInput {
  name: string;
  phaseType: string;
}

export default function NewTournamentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [seasonYear, setSeasonYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timezone, setTimezone] = useState("Australia/Sydney");
  const [status, setStatus] = useState("UPCOMING");
  const [divisions, setDivisions] = useState<DivisionInput[]>([{ name: "", phaseType: "POOL_PLAY" }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addDivision() {
    setDivisions([...divisions, { name: "", phaseType: "POOL_PLAY" }]);
  }

  function removeDivision(i: number) {
    setDivisions(divisions.filter((_, idx) => idx !== i));
  }

  function updateDivision(i: number, field: keyof DivisionInput, value: string) {
    setDivisions(divisions.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Create tournament
      const tRes = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, seasonYear, startDate, endDate, timezone, status }),
      });
      if (!tRes.ok) {
        setError("Failed to create tournament");
        return;
      }
      const tournament = await tRes.json();

      // Create divisions
      for (let i = 0; i < divisions.length; i++) {
        const d = divisions[i];
        if (!d.name.trim()) continue;
        const dRes = await fetch(`/api/tournaments/${tournament.id}/divisions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: d.name.trim(), orderIndex: i }),
        });
        if (!dRes.ok) continue;
        const division = await dRes.json();
        // Create initial phase
        await fetch(`/api/divisions/${division.id}/phases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: d.phaseType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), orderIndex: 0, type: d.phaseType }),
        });
      }

      router.push(`/tournaments/${tournament.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Tournament</h1>
      </header>

      <form onSubmit={submit} className="max-w-xl space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tournament name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Season year *</label>
            <input
              type="number"
              required
              value={seasonYear}
              onChange={(e) => setSeasonYear(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Timezone</label>
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Australia/Sydney"
          />
        </div>

        {/* Divisions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Divisions</h2>
          <div className="space-y-3">
            {divisions.map((d, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  placeholder="Division name (e.g. Open, Women)"
                  value={d.name}
                  onChange={(e) => updateDivision(i, "name", e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={d.phaseType}
                  onChange={(e) => updateDivision(i, "phaseType", e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PHASE_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt.replace(/_/g, " ")}</option>
                  ))}
                </select>
                {divisions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDivision(i)}
                    className="text-gray-400 hover:text-red-500 px-1 py-2 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addDivision}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            + Add division
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create tournament"}
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
