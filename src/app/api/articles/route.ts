import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, headline, subheadline, title, slug, author, status, created_at, updated_at
      FROM content_articles
      ORDER BY updated_at DESC
    `;
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const { headline, subheadline, title, slug, author, body, status } = reqBody;

    const result = await sql`
      INSERT INTO content_articles (headline, subheadline, title, slug, author, body, status)
      VALUES (
        ${headline}, 
        ${subheadline || null}, 
        ${title}, 
        ${slug}, 
        ${author}, 
        ${body || null},
        ${status || "draft"}
      )
      RETURNING id
    `;

    return NextResponse.json({ id: result[0].id, success: true });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
