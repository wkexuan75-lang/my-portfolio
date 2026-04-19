"use client";

import { motion } from "framer-motion";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
} as const;

/**
 * Song Ware / Song Dynasty intro — under the hero bowl (`pattern1-1`), centered.
 */
export function CeramicsRuWareNarrative() {
  return (
    <motion.div
      className="w-full max-w-[min(94vw,593px)] shrink-0 px-0 pt-10 sm:max-w-[min(88vw,562px)] sm:pt-14"
      {...reveal}
    >
      <div className="text-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em] text-emerald-800/50">
          Song Ware
        </p>

        <h2 className="mx-auto mb-8 max-w-lg border-b-2 border-emerald-100 pb-4 font-serif text-2xl italic text-gray-800">
          Song Ware
        </h2>

        <p className="mx-auto max-w-md text-sm font-light leading-loose text-gray-600">
          The Song Dynasty (960–1279) marks the pinnacle of Chinese ceramic art.
          Exemplified by the renowned &ldquo;Five Great Kilns&rdquo; — Ru, Guan,
          Ge, Jun, and Ding — this period embraced an aesthetic of refined
          simplicity, understated elegance, and quiet restraint, celebrating
          harmonious forms and the natural beauty of glaze.
        </p>
      </div>
    </motion.div>
  );
}
