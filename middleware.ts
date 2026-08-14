import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Don't run on public/_next/static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const role = req.cookies.get("role")?.value;

  // If no access token present, redirect to login with returnTo param
  if (!accessToken) {
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set(
      "returnTo",
      req.nextUrl.pathname + req.nextUrl.search,
    );
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only enforcement
  if (pathname.startsWith("/admin") && role !== "admin") {
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set(
      "returnTo",
      req.nextUrl.pathname + req.nextUrl.search,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};
