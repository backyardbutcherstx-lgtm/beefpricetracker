import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Meat Company Reviews & Trust Scores 2026",
  description:
    "Independent trust scores for online meat delivery companies. Rated on price transparency, USDA grades, shipping, and customer reviews.",
};

const companies = [
  {
    name: "Porter Road",
    score: 8.1,
    summary:
      "Nashville-based pasture-raised beef. Excellent transparency on sourcing and USDA grading. Higher price point but premium quality.",
    priceTransparency: 9,
    gradeDisclosure: 8,
    shipping: 8,
    customerReviews: 8,
    returnPolicy: 7,
    sourceTransparency: 9,
  },
  {
    name: "Snake River Farms",
    score: 7.6,
    summary:
      "Premium American Wagyu and USDA Prime beef. Excellent grade disclosure but premium pricing limits accessibility.",
    priceTransparency: 7,
    gradeDisclosure: 9,
    shipping: 8,
    customerReviews: 8,
    returnPolicy: 7,
    sourceTransparency: 7,
  },
  {
    name: "Crowd Cow",
    score: 7.2,
    summary:
      "Marketplace model connecting consumers with independent farms. Good variety but inconsistent experience across different suppliers.",
    priceTransparency: 7,
    gradeDisclosure: 7,
    shipping: 7,
    customerReviews: 7,
    returnPolicy: 7,
    sourceTransparency: 8,
  },
  {
    name: "Backyard Butchers",
    score: 6.8,
    summary:
      "Texas-based pop-up and online meat retailer. Strong on price transparency and USDA grade disclosure. Growing online presence.",
    priceTransparency: 9,
    gradeDisclosure: 8,
    shipping: 6,
    customerReviews: 6,
    returnPolicy: 5,
    sourceTransparency: 7,
  },
  {
    name: "Omaha Steaks",
    score: 6.5,
    summary:
      "Legacy mail-order brand with wide selection. Name recognition is high but pricing can be confusing with frequent discount promotions.",
    priceTransparency: 5,
    gradeDisclosure: 6,
    shipping: 7,
    customerReviews: 7,
    returnPolicy: 7,
    sourceTransparency: 5,
  },
  {
    name: "ButcherBox",
    score: 7.4,
    summary:
      "Subscription-based grass-fed and organic beef delivery. Consistent quality but limited flexibility in cut selection.",
    priceTransparency: 6,
    gradeDisclosure: 7,
    shipping: 8,
    customerReviews: 8,
    returnPolicy: 7,
    sourceTransparency: 8,
  },
];

function getScoreColor(score: number) {
  if (score >= 8) return "text-score-green";
  if (score >= 6) return "text-gold";
  return "text-score-red";
}

export default function ReviewsPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-10 py-12">
      <h1 className="text-3xl font-bold text-navy mb-2">
        Online Meat Company Reviews
      </h1>
      <p className="text-muted-foreground font-sans mb-8">
        Independent trust scores based on six transparent criteria. No company
        pays for placement or ratings.
      </p>

      {/* Scoring Criteria */}
      <div className="bg-muted rounded-lg p-6 mb-10">
        <h2 className="font-semibold text-navy mb-3">How We Score Companies</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm font-sans">
          <div>
            <strong className="text-foreground">Price Transparency (25%)</strong>
            <p className="text-muted-foreground">
              Are prices clearly listed? Any hidden fees?
            </p>
          </div>
          <div>
            <strong className="text-foreground">USDA Grade Disclosure (20%)</strong>
            <p className="text-muted-foreground">
              Do they tell you the beef grade?
            </p>
          </div>
          <div>
            <strong className="text-foreground">Shipping & Handling (15%)</strong>
            <p className="text-muted-foreground">
              Cost, speed, and packaging quality.
            </p>
          </div>
          <div>
            <strong className="text-foreground">Customer Reviews (15%)</strong>
            <p className="text-muted-foreground">
              Aggregate score across platforms.
            </p>
          </div>
          <div>
            <strong className="text-foreground">Return/Refund Policy (15%)</strong>
            <p className="text-muted-foreground">
              How easy is it to get a refund?
            </p>
          </div>
          <div>
            <strong className="text-foreground">Source Transparency (10%)</strong>
            <p className="text-muted-foreground">
              Do they say where the beef comes from?
            </p>
          </div>
        </div>
      </div>

      {/* Company Cards */}
      <div className="space-y-6">
        {companies
          .sort((a, b) => b.score - a.score)
          .map((co) => (
            <div
              key={co.name}
              className="bg-background rounded-lg border border-border p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-navy">{co.name}</h3>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <span
                    className={`text-3xl font-bold ${getScoreColor(co.score)}`}
                  >
                    {co.score.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm font-sans">
                    / 10
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground font-sans mb-4">
                {co.summary}
              </p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { label: "Price", val: co.priceTransparency },
                  { label: "Grades", val: co.gradeDisclosure },
                  { label: "Shipping", val: co.shipping },
                  { label: "Reviews", val: co.customerReviews },
                  { label: "Returns", val: co.returnPolicy },
                  { label: "Source", val: co.sourceTransparency },
                ].map((cat) => (
                  <div key={cat.label} className="text-center">
                    <div className="text-lg font-bold text-navy">{cat.val}</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      {cat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="bg-muted rounded-lg p-6 mt-10">
        <h3 className="font-semibold text-navy mb-2">Our Promise</h3>
        <p className="text-sm text-muted-foreground font-sans">
          BeefPriceTracker.org does not accept payment for reviews or ratings.
          All scores are based on publicly available information and consistent
          evaluation criteria applied equally to every company.
        </p>
      </div>
    </div>
  );
}
