import { Division, Game, Phase, StandingRow, Tournament } from "./types";

const BASE = "http://localhost:8080";
const NO_STORE = { cache: "no-store" } as const;

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
