import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beef Buying Guides — Expert Tips & Price Data",
  description:
    "Learn how to buy beef smarter with our data-backed buying guides. Bulk buying tips, USDA grades explained, seasonal deals, and more.",
};

const guides = [
  {
    title: "How to Buy Beef in Bulk: The Complete Savings Guide",
    description:
      "Save 30-40% on beef by buying in bulk. We break down exactly how much to buy, how to store it, and where to get the best deals.",
    category: "Buying Tips",
    readTime: "8 min read",
  },
  {
    title: "Understanding USDA Beef Grades: Choice vs Prime vs Select",
    description:
      "What do USDA grades actually mean? We explain the difference in taste, texture, and price so you can make smarter choices.",
    category: "Education",
    readTime: "6 min read",
  },
  {
    title: "Beef Prices in 2026: Complete Price Guide by Cut",
    description:
      "Current retail prices for every major beef cut, with 12-month trend data and regional breakdowns.",
    category: "Price Data",
    readTime: "10 min read",
  },
  {
    title: "Best Steaks for Grilling: A Beginner Price Guide",
    description:
      "Not sure which steak to buy for the grill? We compare ribeye, NY strip, sirloin, and more by taste and price.",
    category: "Buying Tips",
    readTime: "7 min read",
  },
  {
    title: "Why Are Beef Prices So High? A Data-Driven Breakdown",
    description:
      "We dig into USDA data to explain what is driving beef prices up and what experts predict for the next 12 months.",
    category: "Analysis",
    readTime: "9 min read",
  },
  {
    title: "Freezer Beef Guide: How Much Meat Fits and What It Costs",
    description:
      "Planning to stock up? Here is exactly how much beef fits in different freezer sizes and what you should expect to pay.",
    category: "Buying Tips",
    readTime: "6 min read",
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-10 py-12">
      <h1 className="text-3xl font-bold text-navy mb-2">Beef Buying Guides</h1>
      <p className="text-muted-foreground font-sans mb-8">
        Data-backed guides to help you buy beef smarter. Whether you are buying
        for a family BBQ or stocking a freezer, we have got you covered.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <article
            key={guide.title}
            className="bg-background rounded-lg border border-border p-6 hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-muted text-navy text-xs font-medium font-sans px-2 py-1 rounded">
                {guide.category}
              </span>
              <span className="text-xs text-muted-foreground font-sans">
                {guide.readTime}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-navy mb-2">
              {guide.title}
            </h2>
            <p className="text-sm text-muted-foreground font-sans mb-3">
              {guide.description}
            </p>
            <span className="text-gold text-sm font-medium font-sans">
              Read guide →
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
