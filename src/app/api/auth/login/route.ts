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
      // Build cookie string manually
      const isProduction = process.env.NODE_ENV === "production";
      const maxAge = 60 * 60 * 24 * 7; // 7 days
      const cookieValue = [
        `dashboard_auth=authenticated`,
        `Path=/`,
        `Max-Age=${maxAge}`,
        `HttpOnly`,
        `SameSite=Lax`,
        isProduction ? `Secure` : "",
      ].filter(Boolean).join("; ");
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieValue,
        },
      });
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
