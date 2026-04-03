"use client";

import { useState, FormEvent } from "react";
import { LoyaltyData } from "@/lib/loyalty";

interface LoyaltyResult extends LoyaltyData {
  zipCode: string;
}

interface Props {
  onResult: (result: LoyaltyResult | null) => void;
}

export default function ZipCodeForm({ onResult }: Props) {
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    onResult(null);

    const trimmed = zipCode.trim();
    if (!/^\d{5}$/.test(trimmed)) {
      setError("Please enter a valid 5-digit zip code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty/check?zipCode=${trimmed}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }
      const data = await res.json();
      onResult(data);
    } catch {
      setError("Unable to check loyalty status. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
      <label htmlFor="zipCode" className="text-lg font-medium text-slate-200">
        Enter your zip code to check rewards
      </label>
      <div className="flex w-full gap-2">
        <input
          id="zipCode"
          type="text"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 77002"
          className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg tracking-widest text-center"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Check"}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}
