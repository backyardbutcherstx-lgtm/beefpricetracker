interface PriceCardProps {
  name: string;
  currentPrice: number;
  previousPrice: number;
  unit?: string;
}

export default function PriceCard({
  name,
  currentPrice,
  previousPrice,
  unit = "per lb",
}: PriceCardProps) {
  const change = currentPrice - previousPrice;
  const pctChange = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
  const isUp = change > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
      <p className="text-sm text-gray-500 mb-1">{name}</p>
      <p className="text-3xl font-bold text-[#1B2A4A]">
        ${currentPrice.toFixed(2)}
      </p>
      <p className="text-xs text-gray-400 mb-2">{unit}</p>
      <div
        className={`inline-flex items-center gap-1 text-sm font-medium ${
          isUp ? "text-red-500" : "text-green-600"
        }`}
      >
        <span>{isUp ? "▲" : "▼"}</span>
        <span>
          ${Math.abs(change).toFixed(2)} ({Math.abs(pctChange).toFixed(1)}%)
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">vs. previous month</p>
    </div>
  );
}
