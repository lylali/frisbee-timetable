import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import { getTournament } from "@/lib/api";

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
  const tournament = await getTournament(TOURNAMENT_ID);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <NavBar tournamentName={tournament.name} />
        <main className="mx-auto max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
