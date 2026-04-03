"use client";

import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Fuel Rewards" width={208} height={40} priority />
          </a>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-5 w-20 bg-slate-700 rounded animate-pulse" />
            ) : user ? (
              <>
                <span className="text-slate-300 text-sm hidden sm:inline">
                  {user.name || user.email}
                </span>
                <a
                  href="/auth/logout"
                  className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Logout
                </a>
              </>
            ) : (
              <a
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-slate-900 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
