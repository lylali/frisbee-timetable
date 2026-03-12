import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, email, password, name } = body;

  const endpoint = action === "register"
    ? `${BASE}/api/auth/register`
    : `${BASE}/api/auth/login`;

  const springRes = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!springRes.ok) {
    const err = await springRes.json().catch(() => ({ message: "Unknown error" }));
    return NextResponse.json(err, { status: springRes.status });
  }

  const user = await springRes.json();
  const res = NextResponse.json(user);
  res.cookies.set("team_user_id", user.id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("team_user_id");
  return res;
}
