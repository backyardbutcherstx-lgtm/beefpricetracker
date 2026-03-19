import type { Metadata } from "next";
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

function Header() {
  return (
    <header className="bg-[#1B2A4A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            🥩 Beef<span className="text-[#E8792F]">Price</span>Tracker
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/prices" className="hover:text-[#E8792F] transition">
            Price Tracker
          </a>
          <a href="/guides" className="hover:text-[#E8792F] transition">
            Buying Guides
          </a>
          <a href="/reviews" className="hover:text-[#E8792F] transition">
            Company Reviews
          </a>
          <a href="/compare" className="hover:text-[#E8792F] transition">
            Compare Prices
          </a>
          <a href="/about" className="hover:text-[#E8792F] transition">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#1B2A4A] text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-3">
              BeefPriceTracker.org
            </h3>
            <p className="text-sm leading-relaxed">
              Your independent source for real beef price data. We track USDA
              and Federal Reserve data so you can make smarter buying decisions.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/prices" className="hover:text-[#E8792F]">
                  Live Prices
                </a>
              </li>
              <li>
                <a href="/guides" className="hover:text-[#E8792F]">
                  Buying Guides
                </a>
              </li>
              <li>
                <a href="/reviews" className="hover:text-[#E8792F]">
                  Company Reviews
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#E8792F]">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Data Sources</h3>
            <ul className="space-y-2 text-sm">
              <li>Federal Reserve (FRED)</li>
              <li>USDA Agricultural Marketing Service</li>
              <li>USDA Economic Research Service</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 pt-6 text-center text-sm">
          <p>
            © {year} BeefPriceTracker.org — An independent beef price resource.
            Not affiliated with any meat retailer.
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
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
