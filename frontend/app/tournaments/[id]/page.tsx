import Link from "next/link";
import { cookies } from "next/headers";
import { getDivisions, getTeams, getTournament } from "@/lib/api";
import { Division } from "@/lib/types";

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tournament, divisions, cookieStore] = await Promise.all([
    getTournament(id),
    getDivisions(id),
    cookies(),
  ]);

  const isTeamLeader = !!cookieStore.get("team_user_id")?.value;

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              <Link href="/tournaments" className="hover:underline">Tournaments</Link> /
            </p>
            <h1 className="text-2xl font-bold text-gray-900">{tournament.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {tournament.seasonYear}
              {tournament.startDate && ` · ${tournament.startDate}`}
              {tournament.endDate && tournament.endDate !== tournament.startDate && ` – ${tournament.endDate}`}
              {tournament.timezone && ` · ${tournament.timezone}`}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {tournament.status}
          </span>
        </div>
      </header>

      <div className="space-y-6">
        {divisions.map((division: Division) => (
          <DivisionSection key={division.id} division={division} tournamentId={id} isTeamLeader={isTeamLeader} />
        ))}
        {divisions.length === 0 && (
          <p className="text-gray-500">No divisions yet.</p>
        )}
      </div>
    </div>
  );
}

async function DivisionSection({
  division,
  tournamentId,
  isTeamLeader,
}: {
  division: Division;
  tournamentId: string;
  isTeamLeader: boolean;
}) {
  const teams = await getTeams(division.id);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{division.name}</h2>
        {isTeamLeader ? (
          <Link
            href={`/tournaments/${tournamentId}/register?divisionId=${division.id}`}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            Register team
          </Link>
        ) : (
          <Link
            href={`/team-login?redirect=/tournaments/${tournamentId}/register?divisionId=${division.id}`}
            className="rounded-md border border-blue-300 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
          >
            Log in to register
          </Link>
        )}
      </div>
      <div className="p-4">
        {teams.length === 0 ? (
          <p className="text-sm text-gray-400">No teams registered yet.</p>
        ) : (
          <ul className="space-y-1">
            {teams.map((t) => (
              <li key={t.id} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="w-5 text-center text-xs text-gray-400">{t.seed ?? "—"}</span>
                <span className="font-medium">{t.name}</span>
                {t.club && <span className="text-gray-400">· {t.club}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
