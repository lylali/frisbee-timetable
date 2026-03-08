import Link from "next/link";
import { getDivision, getPhases, getPhaseGames, getStandings, getTeams } from "@/lib/api";
import { Game, Phase, StandingRow } from "@/lib/types";
import BracketGenerate from "./BracketGenerate";

function formatTime(t: string) {
  return t.slice(0, 5);
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

function statusBadge(status: string) {
  if (status === "FINAL")
    return <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700">FINAL</span>;
  if (status === "IN_PROGRESS")
    return <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-700">LIVE</span>;
  return <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500">SCHEDULED</span>;
}

function StandingsTable({ rows }: { rows: StandingRow[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <th className="py-2 pr-3 w-8">#</th>
          <th className="py-2 pr-3">Team</th>
          <th className="py-2 pr-3 text-center">GP</th>
          <th className="py-2 pr-3 text-center">W</th>
          <th className="py-2 pr-3 text-center">L</th>
          <th className="py-2 pr-3 text-center">D</th>
          <th className="py-2 pr-3 text-center">PF</th>
          <th className="py-2 pr-3 text-center">PA</th>
          <th className="py-2 text-center">+/-</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.team.id} className="border-b border-gray-100 last:border-0">
            <td className="py-2 pr-3 text-gray-400 font-medium">{r.rank}</td>
            <td className="py-2 pr-3 font-medium text-gray-900">{r.team.name}</td>
            <td className="py-2 pr-3 text-center text-gray-600">{r.gp}</td>
            <td className="py-2 pr-3 text-center font-semibold text-gray-900">{r.w}</td>
            <td className="py-2 pr-3 text-center text-gray-600">{r.l}</td>
            <td className="py-2 pr-3 text-center text-gray-600">{r.d}</td>
            <td className="py-2 pr-3 text-center text-gray-600">{r.pf}</td>
            <td className="py-2 pr-3 text-center text-gray-600">{r.pa}</td>
            <td className={`py-2 text-center font-semibold ${r.pd > 0 ? "text-green-600" : r.pd < 0 ? "text-red-500" : "text-gray-500"}`}>
              {r.pd > 0 ? `+${r.pd}` : r.pd}
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={9} className="py-4 text-center text-gray-400 text-sm">No results yet</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function GamesTable({ games }: { games: Game[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {games.length === 0 && <p className="text-sm text-gray-400">No games</p>}
      {games.map((g) => (
        <div
          key={g.id}
          className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
            g.status === "FINAL"
              ? "bg-green-50 border-green-200"
              : g.status === "IN_PROGRESS"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div>
            <div className="font-medium text-gray-800">{gameLabel(g)}</div>
            <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
              {g.timeslot && (
                <span>{g.timeslot.dayDate} {formatTime(g.timeslot.startTime)}</span>
              )}
              {g.roundLabel && <span>· {g.roundLabel}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {scoreLabel(g) && (
              <span className="font-semibold text-gray-700 text-sm">{scoreLabel(g)}</span>
            )}
            {statusBadge(g.status)}
          </div>
        </div>
      ))}
    </div>
  );
}

async function PhaseSection({ phase, divisionId }: { phase: Phase; divisionId: string }) {
  const [games, standings, teams] = await Promise.all([
    getPhaseGames(phase.id),
    phase.type === "POOL_PLAY" || phase.type === "PLACEMENT"
      ? getStandings(phase.id)
      : Promise.resolve([] as StandingRow[]),
    phase.type === "BRACKET" ? getTeams(divisionId) : Promise.resolve([]),
  ]);

  const showBracketGenerator = phase.type === "BRACKET" && games.length === 0;

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 className="font-semibold text-gray-900">{phase.name}</h2>
          <span className="text-xs text-gray-400 uppercase tracking-wide">{phase.type.replace("_", " ")}</span>
        </div>
        {phase.type === "BRACKET" && games.length > 0 && (
          <Link
            href={`/phases/${phase.id}/bracket`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View bracket →
          </Link>
        )}
      </div>

      {showBracketGenerator ? (
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Generate Bracket</h3>
          <BracketGenerate phaseId={phase.id} teams={teams} />
        </div>
      ) : (
        <div className="p-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Games</h3>
            <GamesTable games={games} />
          </div>

          {standings.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Standings</h3>
              <StandingsTable rows={standings} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default async function DivisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [division, phases] = await Promise.all([
    getDivision(id),
    getPhases(id),
  ]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Schedule</Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{division.name}</h1>
      </header>

      <div className="flex flex-col gap-6">
        {phases.map((phase) => (
          <PhaseSection key={phase.id} phase={phase} divisionId={id} />
        ))}
        {phases.length === 0 && (
          <p className="text-gray-400">No phases yet.</p>
        )}
      </div>
    </div>
  );
}
