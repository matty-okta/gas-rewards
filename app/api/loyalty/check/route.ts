import { NextRequest, NextResponse } from "next/server";
import { lookupLoyalty } from "@/lib/loyalty";

export async function GET(req: NextRequest) {
  const zipCode = req.nextUrl.searchParams.get("zipCode");

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    return NextResponse.json(
      { error: "Please enter a valid 5-digit zip code." },
      { status: 400 }
    );
  }

  const data = lookupLoyalty(zipCode);
  return NextResponse.json({ zipCode, ...data });
}
