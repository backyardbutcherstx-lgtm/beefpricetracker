import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Only protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("dashboard_token")?.value;
    const urlToken = searchParams.get("token");
    const expectedToken = process.env.DASHBOARD_PASSWORD;
    
    // If URL has valid token, set cookie and redirect to clean URL
    if (urlToken && urlToken === expectedToken) {
      const cleanUrl = new URL(pathname, request.url);
      cleanUrl.searchParams.delete("token");
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set("dashboard_token", expectedToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return response;
    }
    
    // Skip auth check for login page
    if (pathname === "/dashboard/login") {
      // If already authenticated, redirect to dashboard
      if (authCookie === expectedToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }
    
    // For all other dashboard routes, require auth
    if (authCookie !== expectedToken) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
