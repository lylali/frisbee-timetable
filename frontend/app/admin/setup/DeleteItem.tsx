"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteItem({ url, label }: { url: string; label: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function doDelete() {
    setBusy(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`${res.status}`);
      router.refresh();
    } catch {
      alert(`Failed to delete ${label}`);
      setBusy(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={doDelete}
          disabled={busy}
          className="rounded px-1.5 py-0.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? "…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="ml-auto rounded p-0.5 text-gray-300 hover:text-red-500 hover:bg-red-50"
      title={`Delete ${label}`}
    >
      ×
    </button>
  );
}
