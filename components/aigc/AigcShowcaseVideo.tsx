"use client";

const PAGE_GUTTER = "px-[clamp(15px,2.8vw,30px)]";

const YOUTUBE_EMBED = "https://www.youtube.com/embed/2XuiztFjnQo";

export function AigcShowcaseVideo() {
  return (
    <section
      id="aigc-showcase"
      className={`border-t border-white/10 bg-black ${PAGE_GUTTER} py-12 sm:py-16 md:py-20`}
      aria-labelledby="aigc-showcase-heading"
    >
      <div className="mx-auto max-w-5xl text-center">
        <h2
          id="aigc-showcase-heading"
          lang="zh-Hans"
          className="text-xl font-semibold tracking-wide text-white md:text-2xl"
        >
          成果展示
        </h2>
        <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-white/45 md:text-[0.85rem]">
          Final Showcase
        </p>

        <div className="relative mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-lg md:mt-10">
          <iframe
            title="Lunar New Year Echoes — final showcase"
            src={YOUTUBE_EMBED}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}
