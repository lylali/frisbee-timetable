import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth API routes and login pages through
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname === "/team-login" ||
    pathname.startsWith("/api/team/login")
  ) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const auth = req.cookies.get("admin_auth");
    if (!auth || auth.value !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect /tournaments/new (admin only)
  if (pathname === "/tournaments/new") {
    const auth = req.cookies.get("admin_auth");
    if (!auth || auth.value !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect team leader routes: register and roster
  if (
    pathname.match(/^\/tournaments\/[^/]+\/register/) ||
    pathname.match(/^\/tournaments\/[^/]+\/roster/)
  ) {
    const teamUser = req.cookies.get("team_user_id");
    if (!teamUser) {
      const url = req.nextUrl.clone();
      const redirect = pathname + (req.nextUrl.search ?? "");
      url.pathname = "/team-login";
      url.search = `?redirect=${encodeURIComponent(redirect)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/tournaments/:path*", "/team-login"],
};
