"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Schedule" },
  { href: "/admin", label: "Score entry" },
  { href: "/admin/setup", label: "Setup" },
];

export default function NavBar({ tournamentName, isAdmin }: { tournamentName: string; isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <span className="font-semibold text-gray-900 truncate">{tournamentName}</span>
        <div className="flex gap-1 ml-2">
          {links.map(({ href, label }) => {
            const active = pathname === href;
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
        {isAdmin && (
          <button
            onClick={logout}
            className="ml-auto text-xs text-gray-400 hover:text-gray-700"
          >
            Log out
          </button>
        )}
      </div>
    </nav>
  );
}
