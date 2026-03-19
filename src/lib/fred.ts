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
  ground_beef: "APU0000FC3101",
  ground_chuck: "APU0000703112",
  round_roast: "APU0000703111",
  sirloin_steak: "APU0000703613",
  all_roasts: "APU0000FF1101",
};

export const LABELS: Record<string, string> = {
  ground_beef: "Ground Beef",
  ground_chuck: "Ground Chuck",
  round_roast: "Round Roast",
  sirloin_steak: "Sirloin Steak",
  all_roasts: "Beef Roasts (Avg)",
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
