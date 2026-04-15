import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const sql = neon(process.env.DATABASE_URL!);

type Article = {
  id: string;
  headline: string;
  subheadline: string | null;
  title: string;
  slug: string;
  author: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = await sql`
    SELECT title, subheadline FROM content_articles WHERE slug = ${slug} AND status = 'published'
  `;
  
  if (!articles.length) {
    return { title: "Article Not Found" };
  }
  
  return {
    title: `${articles[0].title} | BeefPriceTracker`,
    description: articles[0].subheadline || undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  const articles = await sql`
    SELECT * FROM content_articles WHERE slug = ${slug} AND status = 'published'
  `;

  if (!articles.length) {
    notFound();
  }

  const article = articles[0] as Article;
  const publishedDate = new Date(article.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="bg-background min-h-screen">
      {/* Article Header */}
      <section className="hero-gradient py-12 px-6 text-white">
        <div className="max-w-[800px] mx-auto">
          <Link 
            href="/" 
            className="text-sm text-[#8aa8c4] hover:text-white transition mb-6 inline-block"
          >
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {article.headline}
          </h1>
          {article.subheadline && (
            <p className="text-lg text-[#b0c8dc] mb-6">
              {article.subheadline}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-[#8aa8c4]">
            <span>By <span className="text-white font-medium">{article.author}</span></span>
            <span>&bull;</span>
            <span>{publishedDate}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-[800px] mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {article.subheadline || "Article content coming soon..."}
          </p>
          
          {/* Placeholder for full article content */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              Full article content would be displayed here. The current database schema stores headline, subheadline, title, slug, and author. 
              To add full article body content, consider adding a <code className="bg-gray-200 px-1 rounded">body</code> column to the content_articles table.
            </p>
          </div>
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="text-navy hover:text-gold transition font-medium"
            >
              &larr; Back to Home
            </Link>
            <Link 
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-navy transition"
            >
              Edit in Dashboard
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
