import { lookupLoyalty, LoyaltyData } from "./loyalty";

// User type from Auth0 v4 SDK - uses generic record
export function getUserZipCode(user: Record<string, unknown>): string | null {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  return (metadata?.zip_code as string) ?? null;
}

export function getUserLoyaltyData(user: Record<string, unknown>): LoyaltyData | null {
  const zip = getUserZipCode(user);
  if (!zip) return null;
  return lookupLoyalty(zip);
}
