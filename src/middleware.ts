import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("dashboard_auth");
    
    // If not authenticated and not on login page, redirect to login
    if (!authCookie?.value && !request.nextUrl.pathname.startsWith("/dashboard/login")) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (authCookie?.value && request.nextUrl.pathname === "/dashboard/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
