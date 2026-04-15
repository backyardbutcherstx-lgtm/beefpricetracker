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
      // Return the token - middleware will handle setting the cookie
      return NextResponse.json({ success: true, token: adminPassword });
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
