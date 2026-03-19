import { NextResponse } from "next/server";
import { fetchAllPrices } from "@/lib/fred";

export const revalidate = 86400; // refresh once per day

export async function GET() {
  try {
    const prices = await fetchAllPrices();
    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
