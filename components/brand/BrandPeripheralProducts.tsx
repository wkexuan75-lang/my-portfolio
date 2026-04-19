"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const P8 = {
  src: "/images/graphics/p8.png",
  w: 4485,
  h: 2061,
} as const;

const P5 = {
  src: "/images/graphics/p5.png",
  w: 3000,
  h: 2008,
} as const;

/** Masonry order: p2 → p3 → p4 */
const MASONRY_TILES = [
  {
    src: "/images/graphics/p2.png",
    w: 4000,
    h: 5000,
    sizes: "(max-width: 640px) 100vw, 50vw",
  },
  {
    src: "/images/graphics/p3.png",
    w: 3500,
    h: 1968,
    sizes: "(max-width: 640px) 100vw, 50vw",
  },
  {
    src: "/images/graphics/p4.png",
    w: 3125,
    h: 2023,
    sizes: "(max-width: 640px) 100vw, 50vw",
  },
] as const;

function openLightboxPayload(
  setSrc: (s: string) => void,
  setMeta: (m: { w: number; h: number }) => void,
  tile: { src: string; w: number; h: number },
) {
  setSrc(tile.src);
  setMeta({ w: tile.w, h: tile.h });
}

export function BrandPeripheralProducts() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxMeta, setLightboxMeta] = useState<{
    w: number;
    h: number;
  } | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null);
    setLightboxMeta(null);
  }, []);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxSrc, closeLightbox]);

  const masonryParentClass = [
    "max-sm:columns-1 sm:columns-2",
    "[column-gap:15px]",
    "[&:has(>button:hover)>button:not(:hover)]:opacity-60",
  ].join(" ");

  const tileButtonClass = [
    "relative mb-[15px] w-full break-inside-avoid overflow-hidden rounded-sm bg-neutral-950 p-0 text-left",
    "transition-[opacity,filter] duration-300 ease-out",
    "hover:z-10 hover:brightness-110",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
  ].join(" ");

  return (
    <section
      className="w-full border-t border-white/10 bg-black text-white"
      aria-labelledby="peripheral-products-heading"
    >
      {/* 主标题 */}
      <div className="mx-auto max-w-3xl px-6 pt-14 text-center md:px-10 md:pt-16">
        <h2
          id="peripheral-products-heading"
          lang="zh-Hans"
          className="text-2xl font-semibold tracking-wide md:text-3xl"
          style={{
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          周边产品
        </h2>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/55 md:text-base">
          Peripheral products
        </p>
      </div>

      {/* 全画幅 p8：无水平内边距、无 hover，仅点击 lightbox */}
      <button
        type="button"
        onClick={() => openLightboxPayload(setLightboxSrc, setLightboxMeta, P8)}
        className="relative mt-8 block w-full cursor-zoom-in border-0 bg-neutral-950 p-0 text-left md:mt-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35"
        aria-label="Open food truck scene"
      >
        <span
          className="relative block w-full overflow-hidden"
          style={{ aspectRatio: `${P8.w} / ${P8.h}` }}
        >
          <Image
            src={P8.src}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
        </span>
      </button>

      <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-4 md:px-6">
        {/* 与 Part I 文案间隔 ~15px */}
        <div className="h-[15px] shrink-0" aria-hidden />

        {/* Part I：居中双语 */}
        <div className="mx-auto max-w-3xl px-4 pb-10 text-center md:px-6 md:pb-12">
          <h3
            lang="zh-Hans"
            className="text-lg font-semibold md:text-xl"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            Part I：餐车周边
          </h3>
          <p
            lang="en"
            className="mt-2 text-sm font-normal text-white/60 [font-family:var(--font-cormorant),serif] md:text-base"
          >
            Part I: Food truck peripherals
          </p>

          <p
            lang="zh-Hans"
            className="mx-auto mt-6 max-w-2xl text-[0.95rem] leading-[1.9] text-white/85 md:text-base"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            餐车内与品牌名称与 logo
            相关的周边产品，以餐车本身、店员的围裙、打包餐盒、咖啡杯与杯垫作为代表。
          </p>
          <p
            lang="en"
            className="mx-auto mt-4 max-w-2xl border-t border-white/10 pt-4 text-[0.92rem] leading-relaxed text-white/75 [font-family:var(--font-geist-sans),system-ui,sans-serif] md:text-[0.95rem]"
          >
            Branded touchpoints tied to the name and logo include the food truck
            itself, staff aprons, takeout boxes, coffee cups, and coasters—each
            extending the identity across service and packaging.
          </p>
        </div>

        {/* 与 masonry 间隔 ~15px */}
        <div className="h-[15px] shrink-0" aria-hidden />

        {/* p2 p3 p4 — 两列 masonry，15px gap，悬停聚焦 + lightbox contain */}
        <div className={masonryParentClass}>
          {MASONRY_TILES.map((tile) => (
            <button
              key={tile.src}
              type="button"
              onClick={() =>
                openLightboxPayload(setLightboxSrc, setLightboxMeta, tile)
              }
              className={tileButtonClass}
              aria-label="Open image"
            >
              <span
                className="relative block w-full overflow-hidden rounded-sm"
                style={{ aspectRatio: `${tile.w} / ${tile.h}` }}
              >
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes={tile.sizes}
                />
              </span>
            </button>
          ))}
        </div>

        {/* Part II：宠物周边 — 双语 */}
        <div className="mx-auto max-w-3xl border-t border-white/10 px-4 pb-10 pt-12 text-center md:px-6 md:pb-12 md:pt-14">
          <h3
            id="part-ii-peripherals"
            lang="zh-Hans"
            className="text-lg font-semibold md:text-xl"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            Part II：宠物周边
          </h3>
          <p
            lang="en"
            className="mt-2 text-sm font-normal text-white/60 [font-family:var(--font-cormorant),serif] md:text-base"
          >
            Part II: Pet peripherals
          </p>

          <p
            lang="zh-Hans"
            className="mx-auto mt-6 max-w-2xl text-[0.95rem] leading-[1.9] text-white/85 md:text-base"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            为顾客限量赠送本品牌的宠物罐头，飞盘，以及宠物餐具等周边产品。
          </p>
          <p
            lang="en"
            className="mx-auto mt-4 max-w-2xl border-t border-white/10 pt-4 text-[0.92rem] leading-relaxed text-white/75 [font-family:var(--font-geist-sans),system-ui,sans-serif] md:text-[0.95rem]"
          >
            Limited complimentary gifts for customers include the brand’s pet
            food cans, frisbees, and pet dining accessories—among other branded
            pet peripherals.
          </p>
        </div>

        {/* Part II 紧接：p5 居中 + 图下英文说明 */}
        <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-2 md:px-6 md:pb-12">
          <button
            type="button"
            onClick={() =>
              openLightboxPayload(setLightboxSrc, setLightboxMeta, P5)
            }
            className="relative mx-auto block w-full cursor-zoom-in border-0 bg-neutral-950 p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35"
            aria-label="Open pet merchandise image"
          >
            <span
              className="relative block w-full overflow-hidden rounded-sm"
              style={{ aspectRatio: `${P5.w} / ${P5.h}` }}
            >
              <Image
                src={P5.src}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </span>
          </button>
          <p
            lang="en"
            className="mx-auto mt-6 max-w-[min(100%,72rem)] text-center text-[0.82rem] leading-snug text-white/80 [font-family:var(--font-geist-sans),system-ui,sans-serif] sm:text-[0.88rem] md:mt-8 md:text-[0.92rem] lg:whitespace-nowrap lg:text-[0.95rem]"
          >
            While owners enjoy delicious meals, their dogs won&apos;t go hungry, thanks to our specially crafted pet canned food.
          </p>
        </div>
      </div>

      {lightboxSrc && lightboxMeta ? (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image"
          onClick={closeLightbox}
        >
          <div
            className="relative max-h-[min(92dvh,100%)] w-full max-w-[min(92vw,100%)]"
            style={{ aspectRatio: `${lightboxMeta.w} / ${lightboxMeta.h}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt=""
              fill
              className="object-contain object-center"
              sizes="92vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
