import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ArticleBody from "@/components/ArticleBody";
import PriceSidebar from "@/components/PriceSidebar";

const sql = neon(process.env.DATABASE_URL!);

type Article = {
  id: string;
  headline: string;
  subheadline: string | null;
  title: string;
  slug: string;
  author: string;
  status: string;
  body: string | null;
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
    <main className="min-h-screen" style={{ background: "#f5f4f0" }}>
      {/* Article Header */}
      <section className="hero-gradient py-12 lg:py-16 px-6 text-white">
        <div className="max-w-[1200px] mx-auto">
          <Link 
            href="/" 
            className="text-sm text-[#8aa8c4] hover:text-white transition mb-6 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <div className="max-w-[800px]">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-4 leading-tight font-serif">
              {article.headline}
            </h1>
            {article.subheadline && (
              <p className="text-lg lg:text-xl text-[#b0c8dc] mb-6 leading-relaxed">
                {article.subheadline}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8aa8c4]">
              <span>By <span className="text-white font-medium">{article.author}</span></span>
              <span className="hidden sm:inline">&bull;</span>
              <span>{publishedDate}</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="text-gold font-medium">Market Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content - Two Column Layout */}
      <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {article.body ? (
              <ArticleBody content={article.body} />
            ) : (
              <p className="text-gray-500 leading-relaxed text-lg font-serif">
                Article content coming soon...
              </p>
            )}

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link 
                  href="/"
                  className="text-navy hover:text-gold transition font-medium inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
                <div className="flex items-center gap-6 text-sm">
                  <Link 
                    href="/dashboard"
                    className="text-muted-foreground hover:text-navy transition"
                  >
                    Edit Article
                  </Link>
                  <span className="text-gray-300">|</span>
                  <button className="text-muted-foreground hover:text-navy transition inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <PriceSidebar />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
