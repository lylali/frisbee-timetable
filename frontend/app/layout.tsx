import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import { getTournament } from "@/lib/api";
import { cookies } from "next/headers";

const TOURNAMENT_ID = "a0000000-0000-0000-0000-000000000001";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frisbee Timetable",
  description: "Tournament schedule and score tracking",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tournament, cookieStore] = await Promise.all([
    getTournament(TOURNAMENT_ID),
    cookies(),
  ]);
  const isAdmin = cookieStore.get("admin_auth")?.value === "1";
  const teamUserId = cookieStore.get("team_user_id")?.value;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <NavBar tournamentName={tournament.name} isAdmin={isAdmin} teamUserId={teamUserId} />
        <main className="mx-auto max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
