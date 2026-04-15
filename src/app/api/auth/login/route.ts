import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.DASHBOARD_PASSWORD;
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: "Dashboard password not configured. Please set DASHBOARD_PASSWORD in environment variables." },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set cookie on the response - this is the correct way in Route Handlers
      response.cookies.set({
        name: "dashboard_auth",
        value: "authenticated",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      
      return response;
    }

    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
