import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Beef Prices Online — Side by Side 2026",
  description:
    "Compare beef prices across online meat delivery companies. See who offers the best value for steaks, ground beef, and more.",
};

const comparisons = [
  {
    cut: "Ribeye Steak (per lb)",
    porterRoad: "$38",
    snakeRiver: "$45",
    crowdCow: "$32",
    backyardButchers: "$28",
    omahasteaks: "$35",
    butcherbox: "$30",
  },
  {
    cut: "NY Strip (per lb)",
    porterRoad: "$34",
    snakeRiver: "$42",
    crowdCow: "$28",
    backyardButchers: "$25",
    omahasteaks: "$33",
    butcherbox: "$28",
  },
  {
    cut: "Ground Beef (per lb)",
    porterRoad: "$10",
    snakeRiver: "$12",
    crowdCow: "$9",
    backyardButchers: "$7",
    omahasteaks: "$11",
    butcherbox: "$9",
  },
  {
    cut: "Filet Mignon (per lb)",
    porterRoad: "$48",
    snakeRiver: "$65",
    crowdCow: "$42",
    backyardButchers: "$35",
    omahasteaks: "$50",
    butcherbox: "$40",
  },
  {
    cut: "Free Shipping Min.",
    porterRoad: "$100",
    snakeRiver: "$149",
    crowdCow: "$99",
    backyardButchers: "N/A (local)",
    omahasteaks: "$69",
    butcherbox: "Included",
  },
];

export default function ComparePage() {
  return (
    <div className="max-w-[1100px] mx-auto px-10 py-12">
      <h1 className="text-3xl font-bold text-navy mb-2">Compare Beef Prices</h1>
      <p className="text-muted-foreground font-sans mb-8">
        Side-by-side pricing from major online meat retailers. Prices are
        approximate and may vary by order size and promotions.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[800px] font-sans">
          <thead>
            <tr className="bg-navy text-white">
              <th className="px-4 py-3 text-left">Cut</th>
              <th className="px-4 py-3 text-center">Porter Road</th>
              <th className="px-4 py-3 text-center">Snake River</th>
              <th className="px-4 py-3 text-center">Crowd Cow</th>
              <th className="px-4 py-3 text-center bg-teal">
                Backyard Butchers
              </th>
              <th className="px-4 py-3 text-center">Omaha Steaks</th>
              <th className="px-4 py-3 text-center">ButcherBox</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, idx) => (
              <tr
                key={row.cut}
                className={idx % 2 === 0 ? "bg-muted" : "bg-background"}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {row.cut}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {row.porterRoad}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {row.snakeRiver}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {row.crowdCow}
                </td>
                <td className="px-4 py-3 text-center font-semibold bg-[#e8f4f8] text-navy">
                  {row.backyardButchers}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {row.omahasteaks}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {row.butcherbox}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-muted rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-navy mb-2">About These Prices</h3>
        <p className="text-sm text-muted-foreground font-sans">
          Prices shown are approximate retail prices as of March 2026, gathered
          from public-facing websites. Actual prices may vary based on order
          size, subscription status, and current promotions. This comparison is
          for informational purposes only.
        </p>
      </div>
    </div>
  );
}
