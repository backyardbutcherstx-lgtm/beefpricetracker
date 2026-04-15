import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, title, slug, status, category, author, created_at, updated_at, published_at
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
    const body = await request.json();
    const { title, slug, content, excerpt, category, author, meta_title, meta_description, status } = body;

    const result = await sql`
      INSERT INTO content_articles (title, slug, content, excerpt, category, author, meta_title, meta_description, status, published_at)
      VALUES (
        ${title}, 
        ${slug}, 
        ${content}, 
        ${excerpt || null}, 
        ${category}, 
        ${author}, 
        ${meta_title || null}, 
        ${meta_description || null}, 
        ${status || "draft"},
        ${status === "published" ? new Date().toISOString() : null}
      )
      RETURNING id
    `;

    return NextResponse.json({ id: result[0].id, success: true });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
