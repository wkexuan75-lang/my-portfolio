"use client";

import Image from "next/image";
import Link from "next/link";

import { AigcShowcaseVideo } from "@/components/aigc/AigcShowcaseVideo";
import { LunarNewYearNarrative } from "@/components/aigc/LunarNewYearNarrative";
import { MythArtifactColumns } from "@/components/aigc/MythArtifactColumns";
import { NezhaCinematicSection } from "@/components/nezha/NezhaCinematicSection";

const F1_W = 856;
const F1_H = 647;
/** Slightly larger than design width; keeps 856:647 */
const F1_MAX_W = 920;
/** Design text anchor on f1 (px); use % so layout scales with f1 box */
const TEXT_LEFT_PCT = (90 / F1_W) * 100;
const TEXT_TOP_PCT = (462 / F1_H) * 100;

const F1_OVERLAY_COPY = `Key Process: Script Design
Picture prompts
Video prompts

Tools: Midjourney, Pika,
Pixverse,Runaway

Video Thesis: Chinese Traditional Customs

Chinese Mythology`;

const CAROUSEL_W = 368;
const CAROUSEL_H = 200;

const CAROUSEL_IMAGES = [
  { key: "f2", src: "/images/myths/f2.png" },
  { key: "f3", src: "/images/myths/f3.png" },
  { key: "f4", src: "/images/myths/f4.png" },
] as const;

/** ~15–30px side margins, full-bleed content width inside */
const PAGE_GUTTER = "px-[clamp(15px,2.8vw,30px)]";

export function AigcVideoProductionClient() {
  const loop = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <div className="relative min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-md">
        <div
          className={`mx-auto flex w-full max-w-none items-center justify-between py-4 ${PAGE_GUTTER}`}
        >
          <Link
            href="/"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            ← Back
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
            AIGC
          </span>
        </div>
      </header>

      <main
        className={`mx-auto w-full max-w-none py-10 sm:py-12 lg:py-14 ${PAGE_GUTTER}`}
      >
        <div className="mb-5 w-full sm:mb-6 lg:mb-8">
          <h1 className="text-left font-sans text-2xl font-bold uppercase leading-tight tracking-[0.14em] text-white sm:text-3xl md:text-4xl lg:text-[2.35rem] lg:leading-[1.1]">
            AIGC Video Production
          </h1>
          <p className="mt-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-white/50 sm:text-sm">
            Part I NeZha Cinematic Section
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-3 xl:gap-4">
          {/* Left — f1；图上文案锚点 (90, 462) */}
          <section className="flex min-w-0 w-full flex-col lg:items-end">
            <div
              className="relative w-full max-w-[min(100%,920px)] overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-lg"
              style={{ aspectRatio: `${F1_W} / ${F1_H}` }}
            >
              <Image
                src="/images/myths/f1.png"
                alt=""
                fill
                priority
                className="object-cover"
                sizes={`(max-width: 1024px) 100vw, ${F1_MAX_W}px`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

              <div
                className="absolute z-10 max-w-[calc(100%-6rem)] pr-4 text-left sm:max-w-[min(26rem,calc(100%-5rem))]"
                style={{
                  left: `${TEXT_LEFT_PCT}%`,
                  top: `${TEXT_TOP_PCT}%`,
                }}
              >
                <p
                  lang="en"
                  className="whitespace-pre-line font-sans text-[11px] leading-snug tracking-wide text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] sm:text-xs md:text-sm"
                >
                  {F1_OVERLAY_COPY}
                </p>
              </div>
            </div>
          </section>

          {/* Right — 每张 368×200，纵向轮播 */}
          <section className="flex w-full min-w-0 flex-col items-center justify-start lg:w-[368px] lg:shrink-0 lg:items-stretch">
            <div className="relative h-[min(72vh,680px)] w-full max-w-[368px] overflow-hidden rounded-xl border border-white/10 bg-neutral-950/90 shadow-inner lg:max-w-none">
              <div className="aigc-marquee-y flex flex-col items-center gap-4 p-3 sm:gap-5 sm:p-4">
                {loop.map((item, i) => (
                  <div
                    key={`${item.key}-${i}`}
                    className="relative w-full max-w-[368px] shrink-0"
                    style={{
                      aspectRatio: `${CAROUSEL_W} / ${CAROUSEL_H}`,
                    }}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className="object-contain object-center"
                      sizes="368px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <NezhaCinematicSection />
      <MythArtifactColumns />
      <LunarNewYearNarrative />
      <AigcShowcaseVideo />
    </div>
  );
}
