import Link from "next/link";
import { getPhase, getPhaseGames } from "@/lib/api";
import { Game } from "@/lib/types";

function teamName(g: Game, side: "team1" | "team2") {
  const team = g[side];
  const source = g[`${side}Source`];
  return team?.name ?? source ?? "TBD";
}

function scoreDisplay(g: Game) {
  if (g.team1Score == null || g.team2Score == null) return null;
  return { t1: g.team1Score, t2: g.team2Score };
}

function GameCard({ game }: { game: Game }) {
  const score = scoreDisplay(game);
  const t1Win = score && score.t1 > score.t2;
  const t2Win = score && score.t2 > score.t1;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden w-48">
      {/* Team 1 row */}
      <div className={`flex items-center justify-between px-3 py-2 border-b border-gray-100 ${t1Win ? "bg-green-50" : ""}`}>
        <span className={`text-sm truncate ${t1Win ? "font-semibold text-green-800" : "text-gray-700"}`}>
          {teamName(game, "team1")}
        </span>
        {score && (
          <span className={`ml-2 text-sm font-bold ${t1Win ? "text-green-700" : "text-gray-400"}`}>
            {score.t1}
          </span>
        )}
      </div>
      {/* Team 2 row */}
      <div className={`flex items-center justify-between px-3 py-2 ${t2Win ? "bg-green-50" : ""}`}>
        <span className={`text-sm truncate ${t2Win ? "font-semibold text-green-800" : "text-gray-700"}`}>
          {teamName(game, "team2")}
        </span>
        {score && (
          <span className={`ml-2 text-sm font-bold ${t2Win ? "text-green-700" : "text-gray-400"}`}>
            {score.t2}
          </span>
        )}
      </div>
      {/* Footer */}
      <div className="px-3 py-1 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">#{game.gameNumber}</span>
        {game.status === "FINAL" && (
          <span className="text-[10px] font-medium text-green-600">FINAL</span>
        )}
        {game.status === "IN_PROGRESS" && (
          <span className="text-[10px] font-medium text-yellow-600">LIVE</span>
        )}
      </div>
    </div>
  );
}

function buildRounds(games: Game[]): Game[][] {
  if (games.length === 0) return [];

  // Group games by round based on roundLabel order
  // Games are ordered by gameNumber ascending, so round 1 is the first n/2 games, etc.
  const total = games.length; // total games = 2^n - 1 for n-team bracket
  // Determine bracket size: total games for n teams = n-1
  // Rounds: n/2 teams → n/4 teams → ... → 1 (final)
  // e.g. 4 teams: 2 + 1 = 3 games, rounds [2, 1]
  // e.g. 8 teams: 4 + 2 + 1 = 7 games, rounds [4, 2, 1]

  const rounds: Game[][] = [];
  let remaining = games;
  let roundSize = Math.pow(2, Math.ceil(Math.log2(total + 1)) - 1);

  while (remaining.length > 0) {
    rounds.push(remaining.slice(0, roundSize));
    remaining = remaining.slice(roundSize);
    roundSize = Math.floor(roundSize / 2);
  }

  return rounds;
}

export default async function BracketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [phase, games] = await Promise.all([getPhase(id), getPhaseGames(id)]);

  const rounds = buildRounds(games);

  const roundNames = rounds.map((r) => r[0]?.roundLabel ?? "Round");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Schedule</Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{phase.name}</h1>
        <p className="text-sm text-gray-500 uppercase tracking-wide">Bracket</p>
      </header>

      {rounds.length === 0 ? (
        <p className="text-gray-400">No bracket games yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-flex gap-12 items-start pb-4">
            {rounds.map((round, ri) => (
              <div key={ri} className="flex flex-col gap-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 text-center">
                  {roundNames[ri]}
                </div>
                <div
                  className="flex flex-col"
                  style={{ gap: `${Math.pow(2, ri) * 12}px` }}
                >
                  {round.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
