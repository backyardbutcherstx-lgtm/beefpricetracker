import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const articles = await sql`
      SELECT * FROM content_articles WHERE id = ${id}
    `;
    
    if (articles.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    
    return NextResponse.json({ article: articles[0] });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();

    // Status-only update (e.g. quick publish/archive toggle)
    if (body.status && Object.keys(body).length === 1) {
      await sql`
        UPDATE content_articles 
        SET status = ${body.status}, updated_at = NOW()
        WHERE id = ${id}
      `;
      return NextResponse.json({ success: true });
    }

    // Full update. COALESCE keeps the existing value when a field is omitted.
    await sql`
      UPDATE content_articles 
      SET 
        headline = COALESCE(${body.headline ?? null}, headline),
        subheadline = COALESCE(${body.subheadline ?? null}, subheadline),
        body = COALESCE(${body.body ?? null}, body),
        category = COALESCE(${body.category ?? null}, category),
        image_url = COALESCE(${body.image_url ?? null}, image_url),
        title = COALESCE(${body.title ?? null}, title),
        slug = COALESCE(${body.slug ?? null}, slug),
        author = COALESCE(${body.author ?? null}, author),
        status = COALESCE(${body.status ?? null}, status),
        updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await sql`DELETE FROM content_articles WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
