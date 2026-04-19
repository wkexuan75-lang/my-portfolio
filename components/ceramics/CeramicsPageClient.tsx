"use client";

import Link from "next/link";

import { CeramicsHero } from "@/components/ceramics/CeramicsHero";
import { CeramicsGuanNarrative } from "@/components/ceramics/CeramicsGuanNarrative";

export function CeramicsPageClient() {
  return (
    <div className="relative min-h-screen bg-[#F6F1E8] text-neutral-900">
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-[#F6F1E8]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              ← Back
            </Link>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Echoes of Song
            </span>
          </div>
        </header>

        <CeramicsHero />
        <CeramicsGuanNarrative />
      </div>
    </div>
  );
}
