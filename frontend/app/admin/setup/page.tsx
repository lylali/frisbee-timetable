import { getDivisions, getFields, getTimeslots, getTeams, getPhases } from "@/lib/api";
import { Division } from "@/lib/types";
import AddField from "./AddField";
import AddTimeslot from "./AddTimeslot";
import AddTeam from "./AddTeam";
import AddPhase from "./AddPhase";

const TOURNAMENT_ID = "a0000000-0000-0000-0000-000000000001";

async function DivisionSetup({ division }: { division: Division }) {
  const [teams, phases] = await Promise.all([
    getTeams(division.id),
    getPhases(division.id),
  ]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-900">{division.name}</h2>
      </div>
      <div className="p-4 grid gap-6 md:grid-cols-2">
        {/* Teams */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Teams ({teams.length})
          </h3>
          <ul className="mb-3 space-y-1">
            {teams.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-5 text-center text-xs text-gray-400">{t.seed ?? "—"}</span>
                <span className="font-medium">{t.name}</span>
                {t.club && <span className="text-gray-400">· {t.club}</span>}
              </li>
            ))}
            {teams.length === 0 && <li className="text-sm text-gray-400">No teams yet</li>}
          </ul>
          <AddTeam divisionId={division.id} />
        </div>

        {/* Phases */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Phases ({phases.length})
          </h3>
          <ul className="mb-3 space-y-1">
            {phases.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-xs text-gray-400">{p.orderIndex}</span>
                <span className="font-medium">{p.name}</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                  {p.type.replace("_", " ")}
                </span>
              </li>
            ))}
            {phases.length === 0 && <li className="text-sm text-gray-400">No phases yet</li>}
          </ul>
          <AddPhase divisionId={division.id} nextIndex={phases.length} />
        </div>
      </div>
    </section>
  );
}

export default async function SetupPage() {
  const [divisions, fields, timeslots] = await Promise.all([
    getDivisions(TOURNAMENT_ID),
    getFields(TOURNAMENT_ID),
    getTimeslots(TOURNAMENT_ID),
  ]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tournament Setup</h1>
        <p className="text-sm text-gray-500">Manage fields, timeslots, teams, and phases</p>
      </header>

      <div className="flex flex-col gap-8">
        {/* Fields + Timeslots */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Fields */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Fields</h2>
            </div>
            <div className="p-4">
              <ul className="mb-3 space-y-1">
                {fields.map((f) => (
                  <li key={f.id} className="text-sm font-medium text-gray-700">{f.name}</li>
                ))}
                {fields.length === 0 && <li className="text-sm text-gray-400">No fields yet</li>}
              </ul>
              <AddField tournamentId={TOURNAMENT_ID} />
            </div>
          </section>

          {/* Timeslots */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Timeslots</h2>
            </div>
            <div className="p-4">
              <ul className="mb-3 space-y-1">
                {timeslots.map((ts) => (
                  <li key={ts.id} className="text-sm text-gray-700">
                    <span className="font-medium">{ts.dayDate}</span>
                    {" "}
                    <span className="font-mono">{ts.startTime.slice(0, 5)}–{ts.endTime.slice(0, 5)}</span>
                    {ts.label && <span className="text-gray-400 ml-1">({ts.label})</span>}
                  </li>
                ))}
                {timeslots.length === 0 && <li className="text-sm text-gray-400">No timeslots yet</li>}
              </ul>
              <AddTimeslot tournamentId={TOURNAMENT_ID} />
            </div>
          </section>
        </div>

        {/* Per-division setup */}
        {divisions.map((d) => (
          <DivisionSetup key={d.id} division={d} />
        ))}
      </div>
    </div>
  );
}
