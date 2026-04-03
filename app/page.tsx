"use client";

import { useState } from "react";
import ZipCodeForm from "@/components/ZipCodeForm";
import LoyaltyResult from "@/components/LoyaltyResult";
import { LoyaltyData } from "@/lib/loyalty";

interface LoyaltyResultData extends LoyaltyData {
  zipCode: string;
}

export default function Home() {
  const [result, setResult] = useState<LoyaltyResultData | null>(null);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Save More at <span className="text-amber-400">Every Fill-Up</span>
          </h1>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Join thousands of drivers earning rewards on fuel purchases. Check if premium
            rewards are available in your area.
          </p>

          <div className="flex flex-col items-center gap-8">
            <ZipCodeForm onResult={setResult} />
            {result && <LoyaltyResult {...result} />}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Save Per Gallon</h3>
            <p className="text-slate-400 text-sm">
              Earn cents off per gallon with every qualifying purchase at participating stations.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Find Stations</h3>
            <p className="text-slate-400 text-sm">
              Thousands of participating locations across the country with real-time pricing.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Premium Perks</h3>
            <p className="text-slate-400 text-sm">
              Unlock extra discounts and exclusive offers in select markets with premium tier.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
