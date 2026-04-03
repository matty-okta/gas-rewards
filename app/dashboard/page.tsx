import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { getUserZipCode, getUserLoyaltyData } from "@/lib/auth-utils";

export default async function Dashboard() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = session.user;
  const zipCode = getUserZipCode(user);
  const loyalty = getUserLoyaltyData(user);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Welcome back, {user.name || user.email}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* User Info Card */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Account</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-slate-400">Name</dt>
              <dd className="text-white">{user.name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">Email</dt>
              <dd className="text-white">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">Zip Code</dt>
              <dd className="text-white">{zipCode || "Not set"}</dd>
            </div>
          </dl>
        </div>

        {/* Loyalty Tier Card */}
        <div
          className={`rounded-xl border p-6 ${
            loyalty?.tier === "premium"
              ? "border-amber-500/30 bg-amber-500/5"
              : "border-slate-700 bg-slate-800/50"
          }`}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Loyalty Tier</h2>
          {loyalty ? (
            <>
              <div className="mb-4">
                {loyalty.tier === "premium" ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-amber-400 text-sm font-semibold">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                    PREMIUM
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-600/30 px-4 py-1.5 text-slate-300 text-sm font-semibold">
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                    STANDARD
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm">
                {loyalty.tier === "premium"
                  ? "You have access to premium rewards including extra cents-off per gallon and exclusive partner offers."
                  : "Earn rewards on every fill-up. Upgrade to premium by visiting a participating station in a premium market."}
              </p>
              {loyalty.city && (
                <p className="text-slate-500 text-xs mt-3">
                  Market: {loyalty.state ? `${loyalty.city}, ${loyalty.state}` : loyalty.city}
                </p>
              )}
            </>
          ) : (
            <p className="text-slate-400 text-sm">
              No zip code on file. Contact support to update your location.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
