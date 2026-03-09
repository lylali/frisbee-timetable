import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and the login API route through
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const auth = req.cookies.get("admin_auth");
    if (!auth || auth.value !== "1") {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
