import { getDivisions, getGames, getFields, getTimeslots } from "@/lib/api";
import { Division, Game } from "@/lib/types";
import ScoreEntry from "./ScoreEntry";

const TOURNAMENT_ID = "a0000000-0000-0000-0000-000000000001";

function gameLabel(g: Game) {
  const t1 = g.team1?.name ?? g.team1Source ?? "TBD";
  const t2 = g.team2?.name ?? g.team2Source ?? "TBD";
  return `${t1} vs ${t2}`;
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

export default async function AdminPage() {
  const [divisions, fields, timeslots] = await Promise.all([
    getDivisions(TOURNAMENT_ID),
    getFields(TOURNAMENT_ID),
    getTimeslots(TOURNAMENT_ID),
  ]);
  const allGames = await Promise.all(divisions.map((d) => getGames(d.id)));

  const divisionGames: { division: Division; games: Game[] }[] = divisions.map(
    (d, i) => ({ division: d, games: allGames[i] })
  );

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Score Entry</h1>
        <p className="text-sm text-gray-500">Click a game to enter or update scores and scheduling</p>
      </header>

      <div className="flex flex-col gap-8">
        {divisionGames.map(({ division, games }) => (
          <section key={division.id}>
            <h2 className="text-base font-semibold text-gray-700 mb-3">{division.name}</h2>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {games.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-400">No games</p>
              )}
              {games.map((g, idx) => (
                <div
                  key={g.id}
                  className={`${idx < games.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <ScoreEntry
                    game={g}
                    label={gameLabel(g)}
                    time={
                      g.timeslot
                        ? `${g.timeslot.dayDate} ${formatTime(g.timeslot.startTime)}`
                        : undefined
                    }
                    fields={fields}
                    timeslots={timeslots}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
