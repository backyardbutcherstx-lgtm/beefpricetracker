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
    const updates: string[] = [];
    const values: unknown[] = [];

    // Build dynamic update query
    if (body.headline !== undefined) {
      updates.push("headline");
      values.push(body.headline);
    }
    if (body.subheadline !== undefined) {
      updates.push("subheadline");
      values.push(body.subheadline);
    }
    if (body.title !== undefined) {
      updates.push("title");
      values.push(body.title);
    }
    if (body.slug !== undefined) {
      updates.push("slug");
      values.push(body.slug);
    }
    if (body.author !== undefined) {
      updates.push("author");
      values.push(body.author);
    }
    if (body.status !== undefined) {
      updates.push("status");
      values.push(body.status);
    }
    if (body.body !== undefined) {
      updates.push("body");
      values.push(body.body);
    }
    if (body.category !== undefined) {
      updates.push("category");
      values.push(body.category);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // For simplicity, handle common update cases
    if (body.status && Object.keys(body).length === 1) {
      // Status-only update
      await sql`
        UPDATE content_articles 
        SET status = ${body.status}, updated_at = NOW()
        WHERE id = ${id}
      `;
    } else {
      // Full update
      await sql`
        UPDATE content_articles 
        SET 
          headline = COALESCE(${body.headline}, headline),
          subheadline = COALESCE(${body.subheadline}, subheadline),
          title = COALESCE(${body.title}, title),
          slug = COALESCE(${body.slug}, slug),
          author = COALESCE(${body.author}, author),
          body = COALESCE(${body.body}, body),
          category = COALESCE(${body.category}, category),
          status = COALESCE(${body.status}, status),
          updated_at = NOW()
        WHERE id = ${id}
      `;
    }

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
