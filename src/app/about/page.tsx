import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BeefPriceTracker.org",
  description:
    "BeefPriceTracker.org is an independent beef price resource using USDA and Federal Reserve data to help consumers make informed decisions.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-10 py-12">
      <h1 className="text-3xl font-bold text-navy mb-6">
        About BeefPriceTracker.org
      </h1>

      <div className="space-y-4 text-muted-foreground">
        <p className="text-lg">
          BeefPriceTracker.org is an independent resource dedicated to bringing
          transparency to beef pricing in the United States. We believe every
          consumer deserves access to real market data when making purchasing
          decisions.
        </p>

        <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Our Mission</h2>
        <p>
          The beef market can be confusing. Prices vary dramatically between
          retailers, cuts are labeled inconsistently, and it is hard to know if
          you are getting a fair deal. We built BeefPriceTracker to solve that
          problem.
        </p>
        <p>
          By pulling data directly from the Federal Reserve Economic Data (FRED)
          database and USDA reports, we provide consumers with objective,
          government-sourced price information that cuts through the marketing
          noise.
        </p>

        <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
          Our Data Sources
        </h2>
        <p>We rely on three primary sources:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Federal Reserve (FRED)</strong>{" "}
            — Retail beef prices by cut, updated monthly from the Bureau of
            Labor Statistics Consumer Price Index survey.
          </li>
          <li>
            <strong className="text-foreground">
              USDA Agricultural Marketing Service
            </strong>{" "}
            — Wholesale boxed beef prices including Choice and Select cutout
            values.
          </li>
          <li>
            <strong className="text-foreground">
              USDA Economic Research Service
            </strong>{" "}
            — Farm-to-retail price spreads showing the full supply chain cost
            breakdown.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-navy mt-8 mb-4">
          Independence & Editorial Policy
        </h2>
        <p>
          BeefPriceTracker.org does not accept payment for reviews, ratings, or
          placement. Our company trust scores are based on consistent,
          transparent criteria applied equally to every company we evaluate. No
          exceptions.
        </p>
        <p>
          We are committed to editorial independence and data accuracy. If we
          make a mistake, we correct it publicly.
        </p>
      </div>
    </div>
  );
}
