"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Schedule" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/admin", label: "Score entry" },
  { href: "/admin/setup", label: "Setup" },
];

export default function NavBar({
  tournamentName,
  isAdmin,
  teamUserId,
}: {
  tournamentName: string;
  isAdmin: boolean;
  teamUserId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function adminLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  async function teamLogout() {
    await fetch("/api/team/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <span className="font-semibold text-gray-900 truncate shrink-0">{tournamentName}</span>
        <div className="flex gap-1 ml-2 flex-1">
          {links.map(({ href, label }) => {
            const active = pathname === href ||
              (href !== "/" && href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          {teamUserId ? (
            <button
              onClick={teamLogout}
              className="text-xs text-gray-400 hover:text-gray-700"
            >
              Team log out
            </button>
          ) : (
            <Link
              href="/team-login"
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Team login
            </Link>
          )}
          {isAdmin && (
            <button
              onClick={adminLogout}
              className="text-xs text-gray-400 hover:text-gray-700"
            >
              Admin log out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
