import { fetchAllPrices, LABELS, type BeefPrices } from "@/lib/fred";
import PriceCard from "@/components/PriceCard";
import { OrganizationSchema } from "@/components/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beef Prices Today | Live USDA Price Tracker 2026",
  description:
    "Track real-time beef prices by cut. Updated with official USDA data. Compare ground beef, steak, and roast prices nationwide.",
};

export const revalidate = 86400;

// Helper to get current and previous price from FRED data
function getPriceData(prices: BeefPrices, key: string) {
  const data = prices[key];
  if (!data || data.length < 2) {
    return { current: 0, previous: 0 };
  }
  const current = data[data.length - 1]?.value ?? 0;
  const previous = data[data.length - 2]?.value ?? current;
  return { current, previous };
}

// Get formatted date from the latest price data
function getLatestDate(prices: BeefPrices): string {
  const firstKey = Object.keys(prices)[0];
  if (!firstKey || !prices[firstKey]?.length) return "Current Week";
  const latestDate = prices[firstKey][prices[firstKey].length - 1]?.date;
  if (!latestDate) return "Current Week";
  const date = new Date(latestDate);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const trendingArticles = [
  {
    title: "How to Tell a Legitimate Meat Truck from a Scam: 7 Red Flags",
    category: "Pop-Up Events",
    reads: "14,200 reads",
    href: "/guides",
  },
  {
    title: "Frozen vs. Fresh Meat: What the Science Actually Says",
    category: "Meat Quality",
    reads: "11,800 reads",
    href: "/guides",
  },
  {
    title: 'The Economics of "20 Ribeyes for $40": What You\'re Actually Getting',
    category: "Consumer Guide",
    reads: "9,600 reads",
    href: "/guides",
  },
  {
    title: "Backyard Butchers vs. Good Ranchers: Which Is Right for You?",
    category: "Company Comparison",
    reads: "7,400 reads",
    href: "/reviews",
  },
  {
    title: "USDA Beef Grades Explained: Choice vs. Prime vs. Select",
    category: "Buying Guide",
    reads: "6,900 reads",
    href: "/guides",
  },
];

const companyScores = [
  { name: "ButcherBox", score: 8.4, color: "green" },
  { name: "Good Ranchers", score: 8.1, color: "green" },
  { name: "Crowd Cow", score: 7.9, color: "green" },
  { name: "Omaha Steaks", score: 7.2, color: "yellow" },
  { name: "Backyard Butchers", score: 6.8, color: "yellow" },
  { name: "Rastelli's", score: 6.5, color: "yellow" },
];

const quickReads = [
  {
    tag: "Consumer Guide",
    title: "Pop-Up Meat Events: A Consumer Protection Guide",
    desc: "Everything you need to know before buying from a parking lot meat sale, including what questions to ask and red flags to watch for.",
    href: "/guides",
  },
  {
    tag: "New Article",
    title: "Smash Burger Mania: Why It's the #1 Food Trend of 2026",
    desc: "The NRA named it the top trend. Here's what's driving the craze and how to get the best value on patties.",
    href: "/guides",
  },
  {
    tag: "Data Brief",
    title: "Beef Tallow: From Kitchen Waste to $15B Industry",
    desc: "How the tallow renaissance is changing consumer behavior and creating new market opportunities.",
    href: "/guides",
  },
];

const featuredArticles = [
  {
    category: "Price Analysis",
    title: "Ground Beef Price by State: March 2026 Regional Breakdown",
    desc: "From $5.89/lb in Nebraska to $8.12/lb in Hawaii, where you live dramatically impacts what you pay. See every state ranked.",
    gradient: "featured-img-blue",
    href: "/prices",
  },
  {
    category: "Company Profile",
    title: "Backyard Butchers: Independent Review & Consumer Analysis",
    desc: "We analyze the $40M pop-up meat retailer's pricing, quality, customer satisfaction data, and how their model compares to subscription boxes.",
    gradient: "featured-img-green",
    href: "/reviews",
  },
  {
    category: "Consumer Guide",
    title: "How to Buy Meat in Bulk Without Getting Ripped Off",
    desc: "Warehouse clubs, online subscriptions, pop-up events, and farm-direct: we break down the real cost per pound for each channel.",
    gradient: "featured-img-gold",
    href: "/guides",
  },
];

// priceTableData is now built dynamically from live FRED data in the component

export default async function HomePage() {
  const prices = await fetchAllPrices();
  const latestDate = getLatestDate(prices);
  
  // Build hero price cards from live FRED data
  const heroPrices = [
    { name: "Ground Beef", key: "ground_beef" },
    { name: "Sirloin Steak", key: "sirloin_steak" },
    { name: "Round Roast", key: "round_roast" },
    { name: "Ground Chuck", key: "ground_chuck" },
  ].map(item => {
    const { current, previous } = getPriceData(prices, item.key);
    return {
      name: LABELS[item.key] || item.name,
      current,
      previous,
    };
  });

  // Build price table from live FRED data
  const liveTableData = Object.entries(prices).map(([key, data]) => {
    const current = data[data.length - 1]?.value ?? 0;
    const yearAgo = data[0]?.value ?? current;
    const change = current - yearAgo;
    const pct = yearAgo > 0 ? ((change / yearAgo) * 100) : 0;
    return {
      cut: LABELS[key] || key,
      price: current,
      change: Math.abs(change),
      pct: Math.abs(pct),
      isUp: change >= 0,
    };
  });

  return (
    <>
      <OrganizationSchema />

      {/* Hero Section with Price Cards */}
      <section className="hero-gradient py-12 px-10 text-white">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-xs text-[#8aa8c4] font-sans uppercase tracking-wider mb-2">
            Data as of {latestDate} &bull; Source: USDA ERS &amp; BLS
          </p>
          <h1 className="text-4xl lg:text-[38px] font-bold tracking-tight mb-2">
            U.S. Beef <span className="text-gold">Price Index</span>
          </h1>
          <p className="text-lg text-[#b0c8dc] font-sans mb-8">
            Real-time tracking of retail beef prices across major cuts and
            regions. Updated every Monday.
          </p>

          {/* Price Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {heroPrices.map((item) => (
              <PriceCard
                key={item.name}
                name={item.name}
                currentPrice={item.current}
                previousPrice={item.previous}
                variant="hero"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <div className="max-w-[1100px] mx-auto px-10 py-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Main Content */}
        <div>
          {/* Featured Article */}
          <h2 className="text-2xl lg:text-[26px] font-bold text-navy border-b-2 border-border pb-2.5 mb-4">
            Why Beef Prices Hit a 70-Year High — And What Consumers Can Do About
            It
          </h2>
          <div className="flex flex-wrap items-center gap-4 font-sans text-sm text-muted-foreground mb-5">
            <span className="text-navy font-semibold">
              By Sarah Mitchell, Food Economics Editor
            </span>
            <span>March 14, 2026</span>
            <span>8 min read</span>
            <span className="bg-[#e8f4f8] text-navy px-2 py-0.5 rounded text-xs font-semibold">
              PRICE ANALYSIS
            </span>
          </div>

          <p className="mb-4">
            American consumers are paying more for beef than at any point since
            the Korean War era. With ground beef averaging $6.89 per pound
            nationally and choice ribeye cresting $14.49, the question on every
            family&apos;s mind is straightforward: why, and what can you actually do
            about it?
          </p>
          <p className="mb-6">
            The answer is a convergence of three structural forces that the
            USDA&apos;s Economic Research Service has been tracking since 2022:
            historically low cattle inventory (86.2 million head, the smallest
            since 1951), persistent drought conditions across key ranching
            states, and surging global demand from markets that are outbidding
            American processors.
          </p>

          {/* Key Takeaways */}
          <div className="bg-[#f0f7f0] border-l-4 border-teal-light rounded-r-lg p-5 mb-6">
            <h4 className="font-sans text-xs uppercase tracking-wider text-teal-light font-bold mb-2.5">
              Key Takeaways
            </h4>
            <ul className="space-y-1">
              <li className="pl-5 relative font-sans text-[15px] text-foreground before:content-['✓'] before:absolute before:left-0 before:text-teal-light before:font-bold">
                U.S. cattle herd at 86.2M head — lowest since 1951, driving
                structural supply shortage
              </li>
              <li className="pl-5 relative font-sans text-[15px] text-foreground before:content-['✓'] before:absolute before:left-0 before:text-teal-light before:font-bold">
                Ground beef up 19.3% year-over-year; USDA forecasts another 5.5%
                increase through 2026
              </li>
              <li className="pl-5 relative font-sans text-[15px] text-foreground before:content-['✓'] before:absolute before:left-0 before:text-teal-light before:font-bold">
                Consumers can save 15-30% by purchasing through direct-to-consumer
                channels, bulk buying, and flash-frozen delivery
              </li>
              <li className="pl-5 relative font-sans text-[15px] text-foreground before:content-['✓'] before:absolute before:left-0 before:text-teal-light before:font-bold">
                Price-lock subscriptions from several meat retailers now offer
                protection against further inflation
              </li>
            </ul>
          </div>

          {/* Price Table */}
          <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
            The Numbers: Current Retail Beef Prices
          </h3>
          <div className="overflow-x-auto mb-2">
            <table className="w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-3.5 py-2.5 font-semibold text-xs uppercase tracking-wide">
                    Cut
                  </th>
                  <th className="text-left px-3.5 py-2.5 font-semibold text-xs uppercase tracking-wide">
                    National Avg. ($/lb)
                  </th>
                  <th className="text-left px-3.5 py-2.5 font-semibold text-xs uppercase tracking-wide">
                    vs. Year Ago
                  </th>
                  <th className="text-left px-3.5 py-2.5 font-semibold text-xs uppercase tracking-wide">
                    12-Month Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {liveTableData.map((row) => (
                  <tr
                    key={row.cut}
                    className="border-b border-border hover:bg-[#f8fafe] transition"
                  >
                    <td className="px-3.5 py-2.5 text-muted-foreground">
                      {row.cut}
                    </td>
                    <td className="px-3.5 py-2.5 font-bold text-foreground">
                      ${row.price.toFixed(2)}
                    </td>
                    <td className={`px-3.5 py-2.5 font-semibold ${row.isUp ? "text-price-up" : "text-price-down"}`}>
                      {row.isUp ? "+" : "-"}${row.change.toFixed(2)}
                    </td>
                    <td className={`px-3.5 py-2.5 font-semibold ${row.isUp ? "text-price-up" : "text-price-down"}`}>
                      {row.isUp ? "+" : "-"}{row.pct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-sans text-xs text-muted-foreground italic mb-8">
            Source: USDA Economic Research Service, Meat Price Spreads dataset.
            Bureau of Labor Statistics CPI. Compiled by BeefPriceTracker.org.
          </p>

          {/* Chart placeholder */}
          <div className="bg-[#f8fafe] border border-[#e0e8f0] rounded-lg p-5 mb-6">
            <div className="w-full h-[220px] relative overflow-hidden">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                <defs>
                  <linearGradient
                    id="lineGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#1a5276" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1a5276" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="50" y1="20" x2="580" y2="20" stroke="#eee" strokeWidth="1" />
                <line x1="50" y1="60" x2="580" y2="60" stroke="#eee" strokeWidth="1" />
                <line x1="50" y1="100" x2="580" y2="100" stroke="#eee" strokeWidth="1" />
                <line x1="50" y1="140" x2="580" y2="140" stroke="#eee" strokeWidth="1" />
                <line x1="50" y1="180" x2="580" y2="180" stroke="#eee" strokeWidth="1" />
                {/* Y axis labels */}
                <text x="10" y="24" fontFamily="Arial" fontSize="10" fill="#999">$7.00</text>
                <text x="10" y="64" fontFamily="Arial" fontSize="10" fill="#999">$6.50</text>
                <text x="10" y="104" fontFamily="Arial" fontSize="10" fill="#999">$6.00</text>
                <text x="10" y="144" fontFamily="Arial" fontSize="10" fill="#999">$5.50</text>
                <text x="10" y="184" fontFamily="Arial" fontSize="10" fill="#999">$5.00</text>
                {/* X axis labels */}
                <text x="70" y="198" fontFamily="Arial" fontSize="10" fill="#999">Mar 25</text>
                <text x="160" y="198" fontFamily="Arial" fontSize="10" fill="#999">May 25</text>
                <text x="250" y="198" fontFamily="Arial" fontSize="10" fill="#999">Jul 25</text>
                <text x="340" y="198" fontFamily="Arial" fontSize="10" fill="#999">Sep 25</text>
                <text x="430" y="198" fontFamily="Arial" fontSize="10" fill="#999">Nov 25</text>
                <text x="520" y="198" fontFamily="Arial" fontSize="10" fill="#999">Jan 26</text>
                {/* Area fill */}
                <path d="M70,150 L130,142 L190,145 L250,130 L310,105 L370,75 L430,55 L490,40 L550,25 L550,180 L70,180 Z" fill="url(#lineGrad)" />
                {/* Line */}
                <polyline points="70,150 130,142 190,145 250,130 310,105 370,75 430,55 490,40 550,25" fill="none" stroke="#1a5276" strokeWidth="2.5" strokeLinejoin="round" />
                {/* Data points */}
                <circle cx="70" cy="150" r="4" fill="#1a5276" />
                <circle cx="130" cy="142" r="4" fill="#1a5276" />
                <circle cx="190" cy="145" r="4" fill="#1a5276" />
                <circle cx="250" cy="130" r="4" fill="#1a5276" />
                <circle cx="310" cy="105" r="4" fill="#1a5276" />
                <circle cx="370" cy="75" r="4" fill="#1a5276" />
                <circle cx="430" cy="55" r="4" fill="#1a5276" />
                <circle cx="490" cy="40" r="4" fill="#1a5276" />
                <circle cx="550" cy="25" r="4" fill="#e74c3c" />
                {/* Current price label */}
                <rect x="510" y="6" width="60" height="18" rx="3" fill="#e74c3c" />
                <text x="540" y="18" fontFamily="Arial" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="700">$6.89</text>
              </svg>
            </div>
            <p className="text-center font-sans text-xs text-muted-foreground mt-2">
              Ground Beef (80/20) — National Average Price Per Pound, 12-Month Trend
            </p>
          </div>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
            What Consumers Can Do
          </h3>
          <p className="mb-4">
            With prices unlikely to decline before mid-2027 at the earliest
            (USDA projects the cattle herd won&apos;t begin meaningful recovery
            until 2028), consumers have several strategies worth considering.
            Buying in bulk, whether through wholesale clubs, direct-from-ranch
            programs, or pop-up meat events, typically saves 15-30% versus
            grocery retail pricing. Flash-frozen meat delivered
            direct-to-consumer has also emerged as a viable option, with several
            companies now offering price-lock guarantees that protect
            subscribers against further inflation.
          </p>

          {/* Editor's Note */}
          <div className="bg-[#fff9e6] border border-[#f0e0a0] rounded-lg p-5 my-6">
            <p className="font-sans text-sm text-muted-foreground">
              <strong className="text-foreground">Editor&apos;s Note:</strong>{" "}
              Several direct-to-consumer meat companies now offer price-lock
              subscription models, including{" "}
              <Link href="/reviews" className="text-navy underline">
                Backyard Butchers
              </Link>{" "}
              (Steakholder Membership),{" "}
              <Link href="/reviews" className="text-navy underline">
                Good Ranchers
              </Link>{" "}
              (American Hero Club), and{" "}
              <Link href="/reviews" className="text-navy underline">
                ButcherBox
              </Link>{" "}
              (Custom Box). We&apos;ve profiled each in our{" "}
              <Link href="/reviews" className="text-navy underline">
                Company Profiles
              </Link>{" "}
              section with independent price-per-pound analysis. For a full
              comparison, see our{" "}
              <Link href="/compare" className="text-navy underline">
                Meat Delivery Services Compared
              </Link>{" "}
              guide.
            </p>
          </div>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
            Methodology
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            Prices reported by BeefPriceTracker.org are sourced from the USDA
            Economic Research Service Meat Price Spreads dataset, supplemented
            by Bureau of Labor Statistics Consumer Price Index data for beef and
            veal. Regional data is compiled from USDA Agricultural Marketing
            Service weekly retail reports. All prices reflect national averages
            for conventional (non-organic) retail products. Data is updated
            every Monday by 9:00 AM ET. For full methodology, see our{" "}
            <Link href="/about" className="text-navy underline">
              Methodology page
            </Link>
            .
          </p>
        </div>

        {/* Sidebar */}
        <aside>
          {/* Newsletter Box */}
          <div className="newsletter-gradient rounded-xl p-6 text-white mb-5">
            <h4 className="text-lg font-bold mb-1.5">Weekly Beef Price Alert</h4>
            <p className="font-sans text-sm text-[#b0d4c8] mb-4">
              Get the latest prices, market analysis, and consumer tips
              delivered every Monday morning.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-3 py-2.5 rounded text-sm font-sans text-foreground mb-2 border-none focus:outline-none bg-white"
            />
            <button className="w-full bg-gold text-white font-bold font-sans py-2.5 rounded text-sm hover:bg-[#c4940f] transition">
              Subscribe Free
            </button>
          </div>

          {/* Trending Articles */}
          <h3 className="font-sans text-sm uppercase tracking-wider text-navy font-bold border-b-2 border-gold pb-1.5 mb-4">
            Trending Articles
          </h3>
          <ul className="mb-6">
            {trendingArticles.map((article) => (
              <li key={article.title} className="border-b border-border py-2.5 last:border-b-0">
                <Link
                  href={article.href}
                  className="text-sm text-foreground hover:text-navy transition block"
                >
                  {article.title}
                </Link>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">
                  {article.category} &bull; {article.reads}
                </p>
              </li>
            ))}
          </ul>

          {/* Company Trust Scores */}
          <h3 className="font-sans text-sm uppercase tracking-wider text-navy font-bold border-b-2 border-gold pb-1.5 mb-3">
            Company Trust Scores
          </h3>
          <p className="font-sans text-xs text-muted-foreground mb-3">
            Based on pricing transparency, customer reviews, return policy, and
            sourcing documentation.
          </p>
          <div className="space-y-0">
            {companyScores.map((company) => (
              <div
                key={company.name}
                className="flex items-center gap-2.5 py-2.5 border-b border-border last:border-b-0"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      company.color === "green"
                        ? "#1e8449"
                        : company.color === "yellow"
                        ? "#d4a017"
                        : "#c0392b",
                  }}
                />
                <span className="font-sans text-sm text-foreground font-medium">
                  {company.name}
                </span>
                <span
                  className="font-sans text-sm font-bold ml-auto"
                  style={{
                    color:
                      company.color === "green"
                        ? "#1e8449"
                        : company.color === "yellow"
                        ? "#d4a017"
                        : "#c0392b",
                  }}
                >
                  {company.score}/10
                </span>
              </div>
            ))}
          </div>
          <p className="font-sans text-xs text-muted-foreground mt-2 mb-6">
            <Link href="/reviews" className="text-navy hover:underline">
              View all company profiles →
            </Link>
          </p>

          {/* Quick Reads */}
          <h3 className="font-sans text-sm uppercase tracking-wider text-navy font-bold border-b-2 border-gold pb-1.5 mb-4">
            Quick Reads
          </h3>
          <div className="space-y-4">
            {quickReads.map((item) => (
              <div
                key={item.title}
                className="bg-muted rounded-lg p-4"
              >
                <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                  {item.tag}
                </p>
                <h4 className="text-[15px] font-bold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="font-sans text-sm text-muted-foreground mb-1.5">
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  className="font-sans text-sm text-navy font-semibold hover:underline"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Featured Articles Section */}
      <section className="bg-muted py-12 px-10">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-6">
            Latest from BeefPriceTracker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`h-[140px] flex items-center justify-center text-4xl text-white/30 ${article.gradient}`}
                >
                  {article.category === "Price Analysis" && "📊"}
                  {article.category === "Company Profile" && "✅"}
                  {article.category === "Consumer Guide" && "🛡️"}
                </div>
                <div className="p-5">
                  <p className="font-sans text-xs text-navy uppercase tracking-wider font-bold mb-1.5">
                    {article.category}
                  </p>
                  <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {article.desc}
                  </p>
                  <span className="inline-block mt-3 font-sans text-sm text-navy font-semibold">
                    Read full {article.category.toLowerCase()} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
