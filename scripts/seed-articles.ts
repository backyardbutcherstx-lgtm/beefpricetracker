import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const articles = [
  {
    headline: "Why Beef Prices Are Skyrocketing in 2025: Understanding the Forces Behind the Surge",
    subheadline: "From drought conditions to supply chain disruptions, learn what's driving beef prices to historic highs and what experts predict for the coming months.",
    title: "Why Beef Prices Are Skyrocketing in 2025",
    slug: "why-beef-prices-skyrocketing-2025",
    author: "BeefPriceTracker Team",
    status: "published"
  },
  {
    headline: "10 Smart Strategies to Save Money on Beef Without Sacrificing Quality",
    subheadline: "Discover proven tactics from buying in bulk to exploring alternative cuts that can slash your beef budget by up to 40% while still enjoying delicious meals.",
    title: "10 Smart Strategies to Save Money on Beef",
    slug: "save-money-on-beef-strategies",
    author: "BeefPriceTracker Team",
    status: "published"
  },
  {
    headline: "The Complete Guide to Budget-Friendly Beef Cuts: Hidden Gems at the Butcher Counter",
    subheadline: "Overlooked cuts like chuck eye, flat iron, and tri-tip offer ribeye-level flavor at a fraction of the price. Here's how to find, cook, and enjoy them.",
    title: "Guide to Budget-Friendly Beef Cuts",
    slug: "budget-friendly-beef-cuts-guide",
    author: "BeefPriceTracker Team",
    status: "published"
  },
  {
    headline: "Buying Beef in Bulk: How to Purchase a Quarter or Half Cow and Save Hundreds",
    subheadline: "A step-by-step guide to buying beef directly from ranchers, including costs, storage requirements, and how to calculate your true per-pound savings.",
    title: "Buying Beef in Bulk Guide",
    slug: "buying-beef-bulk-quarter-half-cow",
    author: "BeefPriceTracker Team",
    status: "published"
  }
];

async function seedArticles() {
  console.log("Starting to seed articles...");
  
  for (const article of articles) {
    try {
      // Check if article already exists
      const existing = await sql`
        SELECT id FROM content_articles WHERE slug = ${article.slug}
      `;
      
      if (existing.length > 0) {
        console.log(`Article "${article.slug}" already exists, skipping...`);
        continue;
      }
      
      await sql`
        INSERT INTO content_articles (headline, subheadline, title, slug, author, status)
        VALUES (
          ${article.headline},
          ${article.subheadline},
          ${article.title},
          ${article.slug},
          ${article.author},
          ${article.status}
        )
      `;
      console.log(`Created article: ${article.title}`);
    } catch (error) {
      console.error(`Error creating article "${article.title}":`, error);
    }
  }
  
  console.log("Finished seeding articles!");
}

seedArticles();
