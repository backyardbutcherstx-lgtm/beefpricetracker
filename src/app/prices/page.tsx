import { fetchAllPrices, LABELS } from "@/lib/fred";
import PriceCard from "@/components/PriceCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Beef Prices by Cut — Updated 2026",
  description:
    "Track beef prices for ground beef, sirloin steak, round roast, and more. Real USDA data updated monthly.",
};

export const revalidate = 86400;

export default async function PricesPage() {
  const prices = await fetchAllPrices();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#1B2A4A] mb-2">
        Live Beef Prices
      </h1>
      <p className="text-gray-600 mb-8">
        Real retail beef prices from the Federal Reserve Economic Data (FRED)
        database. Updated monthly as new data is released.
      </p>

      {/* Current Prices Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
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

      {/* Price History Tables */}
      <h2 className="text-2xl font-bold text-[#1B2A4A] mb-6">
        Price History (Last 12 Months)
      </h2>
      {Object.entries(prices).map(([key, data]) => (
        <div key={key} className="mb-8">
          <h3 className="text-lg font-semibold text-[#2E75B6] mb-3">
            {LABELS[key] || key}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-right">Price/lb</th>
                  <th className="px-4 py-2 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-12).reverse().map((point, idx) => {
                  const prevIdx = data.length - 1 - idx - 1;
                  const prev = prevIdx >= 0 ? data[prevIdx]?.value : point.value;
                  const change = point.value - (prev ?? point.value);
                  return (
                    <tr
                      key={point.date}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2">
                        {new Date(point.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        ${point.value.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-2 text-right ${
                          change > 0
                            ? "text-red-500"
                            : change < 0
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {change !== 0 ? `$${change.toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="bg-[#F2F7FB] rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-[#1B2A4A] mb-2">
          About This Data
        </h3>
        <p className="text-sm text-gray-600">
          Prices shown are national average retail prices per pound from the
          Bureau of Labor Statistics, accessed via the Federal Reserve Economic
          Data (FRED) API. Data is published monthly and reflects average prices
          paid by urban consumers across the United States.
        </p>
      </div>
    </div>
  );
}
