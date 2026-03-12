import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDivision, getTournament, getUserTeams } from "@/lib/api";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ divisionId?: string }>;
}) {
  const [{ id: tournamentId }, { divisionId }, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);

  const userId = cookieStore.get("team_user_id")?.value;
  if (!userId) {
    redirect(`/team-login?redirect=/tournaments/${tournamentId}/register${divisionId ? `?divisionId=${divisionId}` : ""}`);
  }

  const [tournament, previousTeams] = await Promise.all([
    getTournament(tournamentId),
    getUserTeams(userId),
  ]);

  const division = divisionId ? await getDivision(divisionId) : null;

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          {tournament.name} {division ? `· ${division.name}` : ""}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Register Team</h1>
      </header>

      <RegisterForm
        tournamentId={tournamentId}
        divisionId={divisionId ?? null}
        userId={userId}
        previousTeams={previousTeams}
      />
    </div>
  );
}
