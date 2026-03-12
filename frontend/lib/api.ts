import { Division, Field, Game, Phase, RosterEntry, StandingRow, Team, Timeslot, Tournament, User, UserTeamEntry } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
const NO_STORE = { cache: "no-store" } as const;

export async function getTournaments(): Promise<Tournament[]> {
  const res = await fetch(`${BASE}/api/tournaments`, NO_STORE);
  return res.json();
}

export async function getTournament(id: string): Promise<Tournament> {
  const res = await fetch(`${BASE}/api/tournaments/${id}`, NO_STORE);
  return res.json();
}

export async function getDivisions(tournamentId: string): Promise<Division[]> {
  const res = await fetch(`${BASE}/api/tournaments/${tournamentId}/divisions`, NO_STORE);
  return res.json();
}

export async function getDivision(id: string): Promise<Division> {
  const res = await fetch(`${BASE}/api/divisions/${id}`, NO_STORE);
  return res.json();
}

export async function getPhases(divisionId: string): Promise<Phase[]> {
  const res = await fetch(`${BASE}/api/divisions/${divisionId}/phases`, NO_STORE);
  return res.json();
}

export async function getPhase(phaseId: string): Promise<Phase> {
  const res = await fetch(`${BASE}/api/phases/${phaseId}`, NO_STORE);
  return res.json();
}

export async function getGames(divisionId: string): Promise<Game[]> {
  const res = await fetch(`${BASE}/api/divisions/${divisionId}/games`, NO_STORE);
  return res.json();
}

export async function getPhaseGames(phaseId: string): Promise<Game[]> {
  const res = await fetch(`${BASE}/api/phases/${phaseId}/games`, NO_STORE);
  return res.json();
}

export async function getStandings(phaseId: string): Promise<StandingRow[]> {
  const res = await fetch(`${BASE}/api/phases/${phaseId}/standings`, NO_STORE);
  return res.json();
}

export async function getFields(tournamentId: string): Promise<Field[]> {
  const res = await fetch(`${BASE}/api/tournaments/${tournamentId}/fields`, NO_STORE);
  return res.json();
}

export async function getTimeslots(tournamentId: string): Promise<Timeslot[]> {
  const res = await fetch(`${BASE}/api/tournaments/${tournamentId}/timeslots`, NO_STORE);
  return res.json();
}

export async function getTeams(divisionId: string): Promise<Team[]> {
  const res = await fetch(`${BASE}/api/divisions/${divisionId}/teams`, NO_STORE);
  return res.json();
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`${BASE}/api/auth/users/${id}`, NO_STORE);
  return res.json();
}

export async function getUserTeams(userId: string): Promise<UserTeamEntry[]> {
  const res = await fetch(`${BASE}/api/auth/users/${userId}/teams`, NO_STORE);
  return res.json();
}

export async function getRoster(teamId: string): Promise<RosterEntry[]> {
  const res = await fetch(`${BASE}/api/teams/${teamId}/roster`, NO_STORE);
  return res.json();
}
