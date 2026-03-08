import React from "react";
import Link from "next/link";
import { Division, Game, Tournament } from "@/lib/types";

const TOURNAMENT_ID = "a0000000-0000-0000-0000-000000000001";
const BASE = "http://localhost:8080";

async function getTournament(): Promise<Tournament> {
  const res = await fetch(`${BASE}/api/tournaments/${TOURNAMENT_ID}`, {
    cache: "no-store",
  });
  return res.json();
}

async function getDivisions(): Promise<Division[]> {
  const res = await fetch(
    `${BASE}/api/tournaments/${TOURNAMENT_ID}/divisions`,
    { cache: "no-store" }
  );
  return res.json();
}

async function getGames(divisionId: string): Promise<Game[]> {
  const res = await fetch(`${BASE}/api/divisions/${divisionId}/games`, {
    cache: "no-store",
  });
  return res.json();
}

function formatTime(t: string) {
  return t.slice(0, 5); // "09:00:00" → "09:00"
}

function gameLabel(g: Game) {
  const t1 = g.team1?.name ?? g.team1Source ?? "TBD";
  const t2 = g.team2?.name ?? g.team2Source ?? "TBD";
  return `${t1} vs ${t2}`;
}

function scoreLabel(g: Game) {
  if (g.team1Score == null || g.team2Score == null) return null;
  return `${g.team1Score} – ${g.team2Score}`;
}

function statusColor(status: string) {
  if (status === "FINAL") return "bg-green-50 border-green-300";
  if (status === "IN_PROGRESS") return "bg-yellow-50 border-yellow-300";
  return "bg-white border-gray-200";
}

type SlotKey = string; // "2026-06-01|09:00"
type DivisionGames = Map<SlotKey, Game[]>;

function groupBySlot(games: Game[]): DivisionGames {
  const map = new Map<SlotKey, Game[]>();
  for (const g of games) {
    if (!g.timeslot) continue;
    const key = `${g.timeslot.dayDate}|${g.timeslot.startTime}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(g);
  }
  return map;
}

export default async function SchedulePage() {
  const [tournament, divisions] = await Promise.all([
    getTournament(),
    getDivisions(),
  ]);

  const allGames = await Promise.all(divisions.map((d) => getGames(d.id)));

  // Collect all unique timeslot keys in chronological order
  const slotMeta = new Map<
    SlotKey,
    { dayDate: string; startTime: string; label: string | null }
  >();
  allGames.flat().forEach((g) => {
    if (!g.timeslot) return;
    const key = `${g.timeslot.dayDate}|${g.timeslot.startTime}`;
    if (!slotMeta.has(key)) {
      slotMeta.set(key, {
        dayDate: g.timeslot.dayDate,
        startTime: g.timeslot.startTime,
        label: g.timeslot.label,
      });
    }
  });
  const slots = [...slotMeta.entries()].sort(([a], [b]) => a.localeCompare(b));

  const divisionGameMaps = divisions.map((_, i) => groupBySlot(allGames[i]));

  // Group slots by day
  const days = [...new Set(slots.map(([k]) => k.split("|")[0]))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tournament.name}</h1>
          <p className="text-sm text-gray-500">
            {tournament.startDate} – {tournament.endDate} · {tournament.timezone}
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50"
        >
          Score entry
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-32 py-3 pl-4 pr-2 text-left font-semibold text-gray-600">
                Time
              </th>
              {divisions.map((d) => (
                <th
                  key={d.id}
                  className="px-4 py-3 text-left font-semibold text-gray-600"
                >
                  <Link href={`/divisions/${d.id}`} className="hover:text-blue-600 hover:underline">
                    {d.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const daySlots = slots.filter(([k]) => k.startsWith(day));
              return (
                <React.Fragment key={day}>
                  <tr className="border-b border-gray-100 bg-gray-100">
                    <td
                      colSpan={divisions.length + 1}
                      className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {new Date(day + "T00:00:00").toLocaleDateString("en-AU", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                  {daySlots.map(([key, meta]) => (
                    <tr
                      key={key}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 pl-4 pr-2 align-top">
                        <div className="font-mono font-medium text-gray-800">
                          {formatTime(meta.startTime)}
                        </div>
                        {meta.label && (
                          <div className="text-xs text-gray-400">
                            {meta.label}
                          </div>
                        )}
                      </td>
                      {divisions.map((d, i) => {
                        const games = divisionGameMaps[i].get(key) ?? [];
                        return (
                          <td key={d.id} className="px-3 py-2 align-top">
                            <div className="flex flex-col gap-1.5">
                              {games.length === 0 ? (
                                <span className="text-gray-300">—</span>
                              ) : (
                                games.map((g) => (
                                  <div
                                    key={g.id}
                                    className={`rounded-lg border px-3 py-2 ${statusColor(g.status)}`}
                                  >
                                    <div className="font-medium text-gray-800">
                                      {gameLabel(g)}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      {g.roundLabel && (
                                        <span>{g.roundLabel}</span>
                                      )}
                                      {scoreLabel(g) && (
                                        <span className="font-semibold text-gray-700">
                                          {scoreLabel(g)}
                                        </span>
                                      )}
                                      <span
                                        className={`ml-auto rounded px-1 py-0.5 text-[10px] font-medium ${
                                          g.status === "FINAL"
                                            ? "bg-green-100 text-green-700"
                                            : g.status === "IN_PROGRESS"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        {g.status}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
