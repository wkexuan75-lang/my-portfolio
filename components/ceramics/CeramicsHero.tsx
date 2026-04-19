"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import { CeramicsCracks } from "@/components/ceramics/CeramicsCracks";
import { CeramicsPushWindowHero } from "@/components/ceramics/CeramicsPushWindowHero";
import { CeramicsRuWareNarrative } from "@/components/ceramics/CeramicsRuWareNarrative";

type CrackIntroTimeline = {
  imageStartMs: number;
  textStartMs: number;
  /** After title/subtitle appear — pattern1-1 “pushed in”. */
  pattern11StartMs: number;
};

export function CeramicsHero() {
  const [timeline, setTimeline] = useState<CrackIntroTimeline | null>(null);

  const handleTimelineComputed = useCallback((info: { totalSeconds: number }) => {
    const maxEndSec = info.totalSeconds;
    const imageStartMs = maxEndSec * 1000 + 1500;
    // Background comes in a bit faster, then type fades in.
    const textStartMs = imageStartMs + 1900;
    // After copy is readable (1–2s), push in the secondary motif.
    const pattern11StartMs = textStartMs + 1500;
    setTimeline({ imageStartMs, textStartMs, pattern11StartMs });
  }, []);

  const textDelaySec = timeline ? timeline.textStartMs / 1000 : 0;
  const pattern11DelaySec = timeline ? timeline.pattern11StartMs / 1000 : 0;

  const pattern11Variants = {
    out: { opacity: 0, scale: 0.78, filter: "blur(6px)" },
    in: { opacity: 1, scale: 1, filter: "blur(0px)" },
  } as const;

  return (
    <section
      className="relative overflow-hidden bg-transparent pb-16 pt-12 sm:pb-24 sm:pt-14"
      aria-label="Song dynasty ceramics hero"
    >
      {/* pattern1.png: full-hero background (restored) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={timeline ? { opacity: [0, 0.12, 0.6] } : { opacity: 0 }}
          transition={{
            delay: timeline ? timeline.imageStartMs / 1000 : 0,
            // Slightly faster overall (~1s faster than before), still slow→fast.
            duration: 3.8,
            times: [0, 0.62, 1],
            ease: [
              [0.22, 0, 0.6, 0.35],
              [0.15, 0.85, 0.25, 1],
            ],
          }}
          aria-hidden="true"
        >
          <Image
            src="/images/ceramics/pattern1.png"
            alt=""
            fill
            priority
            className="object-contain object-top"
            sizes="100vw"
          />
        </motion.div>

        <CeramicsCracks
          className="absolute inset-0 z-[7] opacity-[0.85] mix-blend-multiply"
          onTimelineComputed={handleTimelineComputed}
        />
      </div>

      <div className="relative z-10 mx-auto mt-[200px] flex min-h-[min(85vh,900px)] max-w-6xl flex-col px-6 pt-[min(13vh,6.5rem)] sm:pt-[min(16vh,8.5rem)] md:pt-[min(18vh,10rem)]">
        {/* pattern1-1: bottom edge meets title top; extra top padding shifts bowl + titles down */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-end">
          <div className="relative w-[min(94%,593px)] shrink-0 -translate-y-[70px] sm:w-[min(88%,562px)]">
            <div className="relative aspect-[4/3] w-full max-h-[min(31vh,288px)] sm:max-h-[min(34vh,312px)]">
              <motion.div
                className="absolute inset-0 z-[6]"
                style={{ willChange: "transform, opacity, filter" }}
                variants={pattern11Variants}
                initial="out"
                animate={timeline ? "in" : "out"}
                transition={{
                  delay: pattern11DelaySec,
                  duration: 1.25,
                  ease: [0.12, 0.9, 0.18, 1],
                  type: "tween",
                }}
                aria-hidden="true"
              >
                <Image
                  src="/images/ceramics/pattern1-1.png"
                  alt=""
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 94vw, 593px"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* pattern1-1 bottom edge meets title top (original stack) */}
        <motion.div
          className="max-w-2xl shrink-0 -mt-[55px] self-center pb-0 pt-0 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={
            timeline ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
          }
          transition={{
            delay: textDelaySec,
            duration: 0.95,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: textDelaySec + 0.35,
            }}
          >
            <p className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl md:text-6xl [font-family:var(--font-cormorant),serif]">
              <span className="text-neutral-400/90">Pure &amp;</span>{" "}
              <span className="text-neutral-900">Timeless</span>
            </p>
            <p className="mt-4 font-mono text-xs font-medium uppercase tracking-[0.28em] text-neutral-600 sm:text-sm">
              THE SONG DYNASTY CERAMICS
            </p>
          </motion.div>
        </motion.div>

        {/* Ru ware narrative: below hero title + subtitle */}
        <div className="flex w-full shrink-0 flex-col items-center pb-6 sm:pb-10 md:pb-12">
          <CeramicsRuWareNarrative />
        </div>
      </div>

      {/* Five-kiln push window: full width, below Ru ware English paragraph */}
      <div className="relative z-10 w-full">
        <CeramicsPushWindowHero />
      </div>
    </section>
  );
}
