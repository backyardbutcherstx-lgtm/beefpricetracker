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
      SELECT * FROM content_articles WHERE id = ${parseInt(id)}
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
    if (body.title !== undefined) {
      updates.push("title");
      values.push(body.title);
    }
    if (body.slug !== undefined) {
      updates.push("slug");
      values.push(body.slug);
    }
    if (body.content !== undefined) {
      updates.push("content");
      values.push(body.content);
    }
    if (body.excerpt !== undefined) {
      updates.push("excerpt");
      values.push(body.excerpt);
    }
    if (body.category !== undefined) {
      updates.push("category");
      values.push(body.category);
    }
    if (body.author !== undefined) {
      updates.push("author");
      values.push(body.author);
    }
    if (body.meta_title !== undefined) {
      updates.push("meta_title");
      values.push(body.meta_title);
    }
    if (body.meta_description !== undefined) {
      updates.push("meta_description");
      values.push(body.meta_description);
    }
    if (body.status !== undefined) {
      updates.push("status");
      values.push(body.status);
      
      // Set published_at when publishing
      if (body.status === "published") {
        updates.push("published_at");
        values.push(new Date().toISOString());
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // For simplicity, handle common update cases
    if (body.status && Object.keys(body).length === 1) {
      // Status-only update
      if (body.status === "published") {
        await sql`
          UPDATE content_articles 
          SET status = ${body.status}, published_at = NOW(), updated_at = NOW()
          WHERE id = ${parseInt(id)}
        `;
      } else {
        await sql`
          UPDATE content_articles 
          SET status = ${body.status}, updated_at = NOW()
          WHERE id = ${parseInt(id)}
        `;
      }
    } else {
      // Full update
      await sql`
        UPDATE content_articles 
        SET 
          title = COALESCE(${body.title}, title),
          slug = COALESCE(${body.slug}, slug),
          content = COALESCE(${body.content}, content),
          excerpt = COALESCE(${body.excerpt}, excerpt),
          category = COALESCE(${body.category}, category),
          author = COALESCE(${body.author}, author),
          meta_title = COALESCE(${body.meta_title}, meta_title),
          meta_description = COALESCE(${body.meta_description}, meta_description),
          status = COALESCE(${body.status}, status),
          updated_at = NOW()
        WHERE id = ${parseInt(id)}
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
    await sql`DELETE FROM content_articles WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
