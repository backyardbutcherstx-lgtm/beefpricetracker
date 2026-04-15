import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.DASHBOARD_PASSWORD;
    
    console.log("[v0] DASHBOARD_PASSWORD exists:", !!adminPassword);
    console.log("[v0] Password provided:", !!password);
    console.log("[v0] Password match:", password === adminPassword);
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: "Dashboard password not configured. Please set DASHBOARD_PASSWORD in environment variables." },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set auth cookie - expires in 7 days
      response.cookies.set("dashboard_auth", "authenticated", {
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
