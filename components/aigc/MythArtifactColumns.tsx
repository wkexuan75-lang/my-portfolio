"use client";

import Image from "next/image";

const SLIDES = [
  "/images/myths/p1.png",
  "/images/myths/p2.png",
  "/images/myths/p3.png",
  "/images/myths/p4.png",
  "/images/myths/p5.png",
] as const;

/** 与 AIGC 主内容区左右边距一致 */
const PAGE_GUTTER = "px-[clamp(15px,2.8vw,30px)]";

export function MythArtifactColumns() {
  const loop = [...SLIDES, ...SLIDES];

  return (
    <section
      className="border-t border-white/[0.06] bg-[#121716] pb-10 sm:pb-12 md:pb-14"
      aria-label="Myth stills carousel"
    >
      <div
        className={`${PAGE_GUTTER} pt-10 pb-3 text-left sm:pt-12 sm:pb-4 md:pt-14`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 sm:text-sm">
          Part II Lunar New Year Echoes
        </p>
      </div>
      <div className="w-full overflow-hidden px-2 py-4 sm:px-3 sm:py-5">
        <div className="myth-marquee-track flex w-max flex-nowrap gap-4 sm:gap-5 md:gap-6">
          {loop.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="myth-marquee-slide relative z-0 h-[min(42vw,220px)] w-[min(72vw,320px)] shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/[0.08] bg-black/40 shadow-lg transition-transform duration-300 ease-out will-change-transform hover:z-20 hover:scale-[1.045] sm:h-[200px] sm:w-[280px] md:h-[220px] md:w-[300px] lg:h-[240px] lg:w-[340px]"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 640px) 72vw, 340px"
                className="object-cover object-center"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
