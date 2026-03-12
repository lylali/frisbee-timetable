import Link from "next/link";
import { cookies } from "next/headers";
import { getTournaments } from "@/lib/api";
import { Tournament } from "@/lib/types";

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    UPCOMING: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-600",
  };
  return colors[status] ?? "bg-gray-100 text-gray-600";
}

export default async function TournamentsPage() {
  const [tournaments, cookieStore] = await Promise.all([
    getTournaments(),
    cookies(),
  ]);
  const isAdmin = cookieStore.get("admin_auth")?.value === "1";

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tournaments</h1>
          <p className="text-sm text-gray-500">View and register for upcoming tournaments</p>
        </div>
        {isAdmin && (
          <Link
            href="/tournaments/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New tournament
          </Link>
        )}
      </header>

      {tournaments.length === 0 ? (
        <p className="text-gray-500">No tournaments yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t: Tournament) => (
            <Link
              key={t.id}
              href={`/tournaments/${t.id}`}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-semibold text-gray-900 leading-tight">{t.name}</h2>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(t.status)}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{t.seasonYear}</p>
              {t.startDate && (
                <p className="text-sm text-gray-400 mt-1">
                  {t.startDate}{t.endDate && t.endDate !== t.startDate ? ` – ${t.endDate}` : ""}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
