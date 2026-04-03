"use client";

import { LoyaltyData } from "@/lib/loyalty";

interface Props extends LoyaltyData {
  zipCode: string;
}

export default function LoyaltyResult({ zipCode, city, state, hasExtra, tier }: Props) {
  const location = state ? `${city}, ${state}` : city;

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center backdrop-blur">
      <div className="mb-4">
        {tier === "premium" ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-amber-400 text-sm font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            PREMIUM REWARDS
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-600/30 px-4 py-1.5 text-slate-300 text-sm font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
            STANDARD REWARDS
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-1">{location}</h3>
      <p className="text-slate-400 text-sm mb-4">Zip code {zipCode}</p>

      {hasExtra ? (
        <p className="text-amber-300 font-medium mb-6">
          Extra rewards are available in your area! Sign up to save more at the pump.
        </p>
      ) : (
        <p className="text-slate-300 mb-6">
          Earn rewards on every fill-up. Sign up to start saving today.
        </p>
      )}

      <a
        href={`/auth/login?screen_hint=signup&ext-zipcode=${zipCode}`}
        className="inline-block w-full py-3 px-6 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-colors text-lg"
      >
        Get Started
      </a>
    </div>
  );
}
