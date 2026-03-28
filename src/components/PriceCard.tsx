interface PriceCardProps {
  name: string;
  currentPrice: number;
  previousPrice: number;
  unit?: string;
  variant?: "hero" | "default";
}

export default function PriceCard({
  name,
  currentPrice,
  previousPrice,
  unit = "per pound, national avg.",
  variant = "default",
}: PriceCardProps) {
  const change = currentPrice - previousPrice;
  const pctChange = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
  const isUp = change > 0;

  // Split price into dollars and cents
  const dollars = Math.floor(currentPrice);
  const cents = Math.round((currentPrice - dollars) * 100)
    .toString()
    .padStart(2, "0");

  if (variant === "hero") {
    return (
      <div className="price-card-glass rounded-xl p-4 lg:p-5">
        <p className="text-xs text-[#8aa8c4] font-sans uppercase tracking-wider mb-1">
          {name}
        </p>
        <p className="text-3xl lg:text-4xl font-bold text-white">
          ${dollars}
          <sup className="text-base lg:text-lg relative -top-2.5">.{cents}</sup>
        </p>
        <p className="text-xs text-[#7a9bb5] font-sans mt-1">{unit}</p>
        <p
          className={`text-sm font-sans mt-1 ${
            isUp ? "text-price-up" : "text-price-down"
          }`}
        >
          {isUp ? "↑" : "↓"} {isUp ? "+" : ""}${change.toFixed(2)} vs. last week
          ({isUp ? "+" : ""}
          {pctChange.toFixed(1)}%)
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border p-5 hover:shadow-md transition">
      <p className="text-sm text-muted-foreground font-sans mb-1">{name}</p>
      <p className="text-3xl font-bold text-navy">
        ${dollars}
        <sup className="text-sm relative -top-2">.{cents}</sup>
      </p>
      <p className="text-xs text-muted-foreground font-sans mb-2">{unit}</p>
      <div
        className={`inline-flex items-center gap-1 text-sm font-medium font-sans ${
          isUp ? "text-price-up" : "text-price-down"
        }`}
      >
        <span>{isUp ? "↑" : "↓"}</span>
        <span>
          ${Math.abs(change).toFixed(2)} ({Math.abs(pctChange).toFixed(1)}%)
        </span>
      </div>
      <p className="text-xs text-muted-foreground font-sans mt-1">
        vs. previous month
      </p>
    </div>
  );
}
