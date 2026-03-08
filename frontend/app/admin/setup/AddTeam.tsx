"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTeam({ divisionId }: { divisionId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [seed, setSeed] = useState("");
  const [club, setClub] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/divisions/${divisionId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          seed: seed ? parseInt(seed) : null,
          club: club.trim() || null,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setName(""); setSeed(""); setClub("");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Name *</label>
        <input
          value={name} onChange={(e) => setName(e.target.value)} required
          placeholder="Team name"
          className="w-32 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Seed</label>
        <input
          type="number" min={1} value={seed} onChange={(e) => setSeed(e.target.value)}
          placeholder="1"
          className="w-14 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Club</label>
        <input
          value={club} onChange={(e) => setClub(e.target.value)}
          placeholder="Optional"
          className="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="submit" disabled={saving || !name.trim()}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {saving ? "…" : "Add team"}
      </button>
      {error && <p className="text-xs text-red-500 w-full">{error}</p>}
    </form>
  );
}
