"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPhase({ divisionId, nextIndex }: { divisionId: string; nextIndex: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("POOL_PLAY");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/divisions/${divisionId}/phases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), type, orderIndex: nextIndex }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setName("");
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
          placeholder="e.g. Pool Play"
          className="w-36 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Type</label>
        <select
          value={type} onChange={(e) => setType(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="POOL_PLAY">POOL PLAY</option>
          <option value="BRACKET">BRACKET</option>
          <option value="PLACEMENT">PLACEMENT</option>
        </select>
      </div>
      <button
        type="submit" disabled={saving || !name.trim()}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {saving ? "…" : "Add phase"}
      </button>
      {error && <p className="text-xs text-red-500 w-full">{error}</p>}
    </form>
  );
}
