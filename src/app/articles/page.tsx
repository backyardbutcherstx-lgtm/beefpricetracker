import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Beef Price Tracker",
  description: "Expert analysis, buying guides, and money-saving tips for navigating today's beef market.",
};

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

type Article = {
  id: string;
  headline: string;
  subheadline: string | null;
  title: string;
  slug: string;
  author: string;
  category: string;
  created_at: string;
};

async function getArticles(): Promise<Article[]> {
  try {
    const articles = await sql`
      SELECT id, headline, subheadline, title, slug, author, category, created_at
      FROM content_articles 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    return articles as Article[];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const result = await sql`
      SELECT DISTINCT category FROM content_articles 
      WHERE status = 'published' AND category IS NOT NULL
      ORDER BY category
    `;
    return result.map((r: { category: string }) => r.category);
  } catch {
    return [];
  }
}

const categoryColors: Record<string, string> = {
  "Market Analysis": "bg-navy text-white",
  "Saving Money": "bg-teal text-white",
  "Buying Guide": "bg-gold text-white",
  "Consumer Guide": "bg-navy-dark text-white",
  "Price Analysis": "bg-price-up text-white",
};

const categoryImages: Record<string, string> = {
  "Market Analysis": "/images/article-market-analysis.jpg",
  "Saving Money": "/images/article-saving-money.jpg",
  "Buying Guide": "/images/article-buying-guide.jpg",
  "Consumer Guide": "/images/article-consumer-guide.jpg",
  "Price Analysis": "/images/article-price-analysis.jpg",
  "Company Profile": "/images/article-buying-guide.jpg",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories()
  ]);

  const selectedCategory = params.category;
  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  return (
    <div className="bg-background-warm min-h-screen">
      {/* Header */}
      <section className="hero-gradient py-10 px-6">
        <div className="max-w-[1100px] mx-auto">
          <nav className="text-sm text-[#8aa8c4] mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Articles</span>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Beef Market <span className="text-gold">Articles</span>
          </h1>
          <p className="text-lg text-[#b0c8dc]">
            Expert analysis, buying guides, and money-saving tips for navigating today&apos;s beef market.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground mr-2">Filter by:</span>
          <Link
            href="/articles"
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !selectedCategory 
                ? "bg-navy text-white" 
                : "bg-white text-muted-foreground hover:bg-gray-100 border border-border"
            }`}
          >
            All Articles
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/articles?category=${encodeURIComponent(category)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category 
                  ? categoryColors[category] || "bg-navy text-white"
                  : "bg-white text-muted-foreground hover:bg-gray-100 border border-border"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-[1100px] mx-auto px-6 pb-12">
        {selectedCategory && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} in <strong>{selectedCategory}</strong>
          </p>
        )}

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-border"
              >
                {/* Article Thumbnail */}
                <div className="h-[160px] overflow-hidden relative">
                  <img 
                    src={categoryImages[article.category] || "/images/article-market-analysis.jpg"}
                    alt={article.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${categoryColors[article.category] || "bg-navy text-white"}`}>
                    {article.category}
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-foreground mb-2 leading-snug line-clamp-2">
                    {article.headline}
                  </h2>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {article.subheadline}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                    <span>{article.author}</span>
                    <span>
                      {new Date(article.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles found{selectedCategory ? ` in "${selectedCategory}"` : ''}.</p>
            {selectedCategory && (
              <Link href="/articles" className="text-navy font-semibold hover:underline mt-2 inline-block">
                View all articles
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
