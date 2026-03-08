export interface Phase {
  id: string;
  name: string;
  orderIndex: number;
  type: "POOL_PLAY" | "BRACKET" | "PLACEMENT";
}

export interface StandingRow {
  rank: number;
  team: Team;
  gp: number;
  w: number;
  l: number;
  d: number;
  pf: number;
  pa: number;
  pd: number;
}

export interface Tournament {
  id: string;
  name: string;
  seasonYear: number;
  startDate: string;
  endDate: string;
  timezone: string;
  status: string;
}

export interface Division {
  id: string;
  name: string;
  orderIndex: number;
}

export interface Team {
  id: string;
  name: string;
  seed: number;
  club: string | null;
}

export interface Timeslot {
  id: string;
  dayDate: string;
  startTime: string;
  endTime: string;
  label: string | null;
}

export interface Game {
  id: string;
  gameNumber: number | null;
  roundLabel: string | null;
  status: string;
  team1: Team | null;
  team2: Team | null;
  team1Source: string | null;
  team2Source: string | null;
  team1Score: number | null;
  team2Score: number | null;
  timeslot: Timeslot | null;
  pitch: { id: string; name: string } | null;
  poolId: string | null;
}
