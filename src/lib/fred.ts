const FRED_API_KEY = process.env.FRED_API_KEY;
const BASE = "https://api.stlouisfed.org/fred/series/observations";

export interface PricePoint {
  date: string;
  value: number;
}

export interface BeefPrices {
  [key: string]: PricePoint[];
}

export const SERIES: Record<string, string> = {
  ground_beef: "APU0000703112",      // Ground Beef, 100%, per lb
  all_steaks: "APU0000FC3101",       // All Uncooked Beef Steaks, per lb
  round_roast: "APU0000703111",      // Beef Round Roast, USDA Choice, per lb
  sirloin_steak: "APU0000703613",    // Beef Sirloin Steak, per lb
  chuck_roast: "APU0000703311",      // Beef Chuck Roast, USDA Choice, per lb
};

export const LABELS: Record<string, string> = {
  ground_beef: "Ground Beef (100%)",
  all_steaks: "All Beef Steaks",
  round_roast: "Round Roast",
  sirloin_steak: "Sirloin Steak",
  chuck_roast: "Chuck Roast",
};

export async function fetchSeries(seriesId: string): Promise<PricePoint[]> {
  if (!FRED_API_KEY) {
    console.warn("FRED_API_KEY not set — using sample data");
    return generateSampleData();
  }
  try {
    const url = `${BASE}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=24`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    if (!data.observations) return generateSampleData();
    return data.observations
      .filter((o: any) => o.value !== ".")
      .map((o: any) => ({ date: o.date, value: parseFloat(o.value) }))
      .reverse();
  } catch {
    return generateSampleData();
  }
}

export async function fetchAllPrices(): Promise<BeefPrices> {
  const results: BeefPrices = {};
  for (const [name, id] of Object.entries(SERIES)) {
    results[name] = await fetchSeries(id);
  }
  return results;
}

function generateSampleData(): PricePoint[] {
  const data: PricePoint[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    data.push({
      date: d.toISOString().split("T")[0],
      value: Math.round((4.5 + Math.random() * 2) * 100) / 100,
    });
  }
  return data;
}
