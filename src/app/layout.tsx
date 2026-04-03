import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BeefPriceTracker.org — Live USDA Beef Prices",
    template: "%s | BeefPriceTracker.org",
  },
  description:
    "Track real-time beef prices by cut. Updated with official USDA data. Compare ground beef, steak, and roast prices nationwide.",
  openGraph: {
    siteName: "BeefPriceTracker.org",
    type: "website",
    url: "https://beefpricetracker.org",
  },
};

function TopBar() {
  return (
    <div className="bg-navy-dark py-1.5 text-center text-xs text-[#8aa8c4] font-sans tracking-wide">
      Independent Consumer Beef Intelligence — Updated Weekly with USDA Data
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b-3 border-navy shadow-sm">
      <div className="max-w-[1100px] mx-auto px-10 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-navy rounded-md flex items-center justify-center text-white font-bold text-base font-sans">
            BPT
          </div>
          <span className="text-[22px] font-bold text-navy tracking-tight">
            BeefPrice<span className="text-gold">Tracker</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-7 font-sans text-sm font-medium">
          <Link
            href="/"
            className="text-navy border-b-2 border-gold pb-1 hover:text-navy transition"
          >
            Price Index
          </Link>
          <Link
            href="/guides"
            className="text-foreground border-b-2 border-transparent pb-1 hover:text-navy hover:border-navy transition"
          >
            Buying Guides
          </Link>
          <Link
            href="/compare"
            className="text-foreground border-b-2 border-transparent pb-1 hover:text-navy hover:border-navy transition"
          >
            Pop-Up Events
          </Link>
          <Link
            href="/reviews"
            className="text-foreground border-b-2 border-transparent pb-1 hover:text-navy hover:border-navy transition"
          >
            Company Profiles
          </Link>
          <Link
            href="/prices"
            className="text-foreground border-b-2 border-transparent pb-1 hover:text-navy hover:border-navy transition"
          >
            Meat Quality
          </Link>
          <Link
            href="/about"
            className="text-foreground border-b-2 border-transparent pb-1 hover:text-navy hover:border-navy transition"
          >
            About
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2">
          <input
            type="text"
            placeholder="Search articles..."
            className="border border-border rounded px-3 py-1.5 text-sm font-sans w-[180px] focus:outline-none focus:border-navy"
          />
          <button className="bg-navy text-white rounded px-3.5 py-1.5 text-sm font-sans hover:bg-navy-dark transition">
            Search
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-dark text-[#8aa8c4]">
      <div className="max-w-[1100px] mx-auto px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <h4 className="text-white font-sans text-sm uppercase tracking-wide mb-3">
              BeefPriceTracker.org
            </h4>
            <p className="font-sans text-sm text-[#6a8ea8] leading-relaxed">
              Independent consumer beef price intelligence. We track retail beef
              prices, review meat delivery companies, and help consumers make
              informed purchasing decisions.
            </p>
            <p className="font-sans text-sm text-[#6a8ea8] mt-3">
              Data sourced from USDA ERS, BLS, and proprietary market research.
              Updated weekly.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-sans text-sm uppercase tracking-wide mb-3">
              Resources
            </h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Beef Price Index
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Buying Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Pop-Up Event Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Company Profiles
                </Link>
              </li>
              <li>
                <Link
                  href="/prices"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Meat Quality Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-sans text-sm uppercase tracking-wide mb-3">
              Company
            </h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Editorial Standards
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Trending */}
          <div>
            <h4 className="text-white font-sans text-sm uppercase tracking-wide mb-3">
              Trending
            </h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/guides"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Why Is Beef So Expensive?
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Meat Truck Red Flags
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Frozen vs. Fresh Science
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Best Meat Delivery 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/prices"
                  className="font-sans text-sm text-[#6a8ea8] hover:text-gold transition"
                >
                  Steak Price Forecast
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclosure */}
        <div className="mt-8 pt-5 border-t border-white/10">
          <p className="font-sans text-xs text-[#4a6a82] leading-relaxed">
            BeefPriceTracker.org is an independent consumer resource supported
            in part by Backyard Butchers, a national meat retailer. Our
            editorial standards ensure all content is independently researched,
            fact-checked, and unbiased. Supporting companies do not influence
            our ratings, reviews, or recommendations. For more information, see
            our{" "}
            <Link href="/about" className="text-[#6a8ea8] hover:text-gold">
              Editorial Standards
            </Link>{" "}
            and{" "}
            <Link href="/about" className="text-[#6a8ea8] hover:text-gold">
              About
            </Link>{" "}
            pages. © {year} BeefPriceTracker.org. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TopBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
