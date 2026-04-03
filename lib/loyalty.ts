export interface LoyaltyData {
  city: string;
  state: string;
  hasExtra: boolean;
  tier: "premium" | "standard";
}

const loyaltyMap: Record<string, LoyaltyData> = {
  "77002": { city: "Houston", state: "TX", hasExtra: true, tier: "premium" },
  "77001": { city: "Houston", state: "TX", hasExtra: true, tier: "premium" },
  "77003": { city: "Houston", state: "TX", hasExtra: true, tier: "premium" },
  "79901": { city: "El Paso", state: "TX", hasExtra: false, tier: "standard" },
  "73301": { city: "Austin", state: "TX", hasExtra: true, tier: "premium" },
  "70112": { city: "New Orleans", state: "LA", hasExtra: true, tier: "premium" },
  "73102": { city: "Oklahoma City", state: "OK", hasExtra: true, tier: "premium" },
  "80202": { city: "Denver", state: "CO", hasExtra: true, tier: "premium" },
  "82001": { city: "Cheyenne", state: "WY", hasExtra: false, tier: "standard" },
  "58501": { city: "Bismarck", state: "ND", hasExtra: true, tier: "premium" },
  "59601": { city: "Helena", state: "MT", hasExtra: false, tier: "standard" },
  "99501": { city: "Anchorage", state: "AK", hasExtra: true, tier: "premium" },
  "90210": { city: "Beverly Hills", state: "CA", hasExtra: false, tier: "standard" },
  "10001": { city: "New York", state: "NY", hasExtra: false, tier: "standard" },
  "60601": { city: "Chicago", state: "IL", hasExtra: false, tier: "standard" },
};

export function lookupLoyalty(zipCode: string): LoyaltyData | null {
  if (!/^\d{5}$/.test(zipCode)) return null;

  if (loyaltyMap[zipCode]) return loyaltyMap[zipCode];

  // Fallback: any valid 5-digit zip gets standard tier
  return {
    city: "Your Area",
    state: "",
    hasExtra: false,
    tier: "standard",
  };
}
