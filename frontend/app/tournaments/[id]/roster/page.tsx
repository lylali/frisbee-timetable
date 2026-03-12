import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getRoster, getTournament } from "@/lib/api";
import RosterManager from "./RosterManager";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

async function getTeamById(teamId: string) {
  const res = await fetch(`${BASE}/api/teams/${teamId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function RosterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ teamId?: string }>;
}) {
  const [{ id: tournamentId }, { teamId }, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);

  const userId = cookieStore.get("team_user_id")?.value;
  if (!userId) {
    redirect(`/team-login?redirect=/tournaments/${tournamentId}/roster${teamId ? `?teamId=${teamId}` : ""}`);
  }

  if (!teamId) {
    redirect(`/tournaments/${tournamentId}`);
  }

  const [team, tournament, roster] = await Promise.all([
    getTeamById(teamId),
    getTournament(tournamentId),
    getRoster(teamId),
  ]);

  if (!team) redirect(`/tournaments/${tournamentId}`);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <p className="text-sm text-gray-500 mb-1">{tournament.name}</p>
        <h1 className="text-2xl font-bold text-gray-900">{team.name} — Roster</h1>
        <p className="text-sm text-gray-500 mt-1">{roster.length} player{roster.length !== 1 ? "s" : ""}</p>
      </header>

      <RosterManager teamId={teamId} initialRoster={roster} />
    </div>
  );
}
