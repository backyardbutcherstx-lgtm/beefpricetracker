import { fetchAllPrices, LABELS } from "@/lib/fred";
import PriceCard from "@/components/PriceCard";
import { OrganizationSchema } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beef Prices Today | Live USDA Price Tracker 2026",
  description:
    "Track real-time beef prices by cut. Updated with official USDA data. Compare ground beef, steak, and roast prices nationwide.",
};

export const revalidate = 86400;

export default async function HomePage() {
  const prices = await fetchAllPrices();

  return (
    <>
      <OrganizationSchema />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B2A4A] to-[#2E75B6] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What Does Beef <span className="text-[#E8792F]">Actually</span>{" "}
            Cost?
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mb-8">
            Real prices. Real data. Tracked weekly from USDA and Federal Reserve
            sources so you never overpay for beef again.
          </p>
          <div className="flex gap-4">
            <a
              href="/prices"
              className="bg-[#E8792F] hover:bg-[#d06a25] text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              View Live Prices →
            </a>
            <a
              href="/guides"
              className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Buying Guides
            </a>
          </div>
        </div>
      </section>

      {/* Price Cards */}
      <section className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(prices).map(([key, data]) => {
            const current = data[data.length - 1]?.value ?? 0;
            const prev = data[data.length - 2]?.value ?? current;
            return (
              <PriceCard
                key={key}
                name={LABELS[key] || key}
                currentPrice={current}
                previousPrice={prev}
              />
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#1B2A4A] mb-8 text-center">
          How BeefPriceTracker Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">Government Data</h3>
            <p className="text-gray-600 text-sm">
              We pull prices directly from the Federal Reserve (FRED) and USDA
              databases. No guesswork — just official numbers.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="font-semibold text-lg mb-2">Updated Regularly</h3>
            <p className="text-gray-600 text-sm">
              Prices refresh automatically as new government data is published,
              typically monthly for retail prices.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚖️</div>
            <h3 className="font-semibold text-lg mb-2">Independent Reviews</h3>
            <p className="text-gray-600 text-sm">
              Our company trust scores are based on transparent criteria. No pay
              to play — every company is rated the same way.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="bg-[#F2F7FB] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1B2A4A] mb-8">
            Latest Buying Guides
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "How to Buy Beef in Bulk: The Complete Savings Guide",
                desc: "Save 30-40% on beef by buying in bulk. Here is exactly how to do it right.",
                href: "/guides",
              },
              {
                title:
                  "Understanding USDA Beef Grades: Choice vs Prime vs Select",
                desc: "What the grades actually mean for taste, texture, and your wallet.",
                href: "/guides",
              },
              {
                title: "Beef Prices in 2026: Complete Price Guide by Cut",
                desc: "Every major cut, current price, and 12-month trend data.",
                href: "/prices",
              },
            ].map((guide) => (
              <a
                key={guide.title}
                href={guide.href}
                className="bg-white rounded-lg p-6 hover:shadow-md transition border border-gray-200"
              >
                <h3 className="font-semibold text-[#1B2A4A] mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-600">{guide.desc}</p>
                <span className="text-[#E8792F] text-sm font-medium mt-3 inline-block">
                  Read more →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Score Preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#1B2A4A] mb-2">
          Company Trust Scores
        </h2>
        <p className="text-gray-600 mb-8">
          Independent ratings based on price transparency, USDA grade
          disclosure, shipping, and customer reviews.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Porter Road", score: 8.1 },
            { name: "Snake River Farms", score: 7.6 },
            { name: "Crowd Cow", score: 7.2 },
            { name: "Backyard Butchers", score: 6.8 },
          ].map((co) => (
            <div
              key={co.name}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-[#1B2A4A]">{co.name}</h4>
                <span
                  className="text-2xl font-bold"
                  style={{
                    color:
                      co.score >= 8
                        ? "#22c55e"
                        : co.score >= 6
                        ? "#2E75B6"
                        : "#E8792F",
                  }}
                >
                  {co.score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(co.score / 10) * 100}%`,
                    backgroundColor:
                      co.score >= 8
                        ? "#22c55e"
                        : co.score >= 6
                        ? "#2E75B6"
                        : "#E8792F",
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">out of 10</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <a
            href="/reviews"
            className="text-[#2E75B6] font-semibold hover:underline"
          >
            See all company reviews →
          </a>
        </div>
      </section>
    </>
  );
}
