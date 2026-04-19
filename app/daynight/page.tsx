import Image from "next/image";
import Link from "next/link";

import PhotoFlipCard from "@/components/PhotoFlipCard";

/** Natural size of `/images/daynight/p12.jpeg` — used for layout without cropping. */
const P12_WIDTH = 1086;
const P12_HEIGHT = 724;

const EDITORIAL_ALLEYS = [
  {
    src: "/images/daynight/p13.jpeg",
    location: "Shanghai, China",
    time: "",
    inspiration: "Morning light on the old storefront.",
  },
  {
    src: "/images/daynight/p14.jpeg",
    location: "Shanghai, China",
    time: "",
    inspiration: "A narrow slice of street—texture, shadow, and everyday rhythm.",
  },
] as const;

/** p7 ≈ spice / sauce jars; p6 ≈ craft stall — swap filenames if your assets differ. */
const EDITORIAL_MARKET = [
  {
    src: "/images/daynight/p7.png",
    location: "Local Market",
    time: "",
    inspiration: "The rhythm of organized colors.",
  },
  {
    src: "/images/daynight/p6.png",
    location: "Local Market",
    time: "",
    inspiration: "Handwork and texture under the market awning.",
  },
] as const;

export default function DayNightPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] text-neutral-900">
      <header className="border-b border-neutral-200/70 bg-[#F9F9F9]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            ← Back
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            Day &amp; Night
          </span>
        </div>
      </header>

      {/* Hero (Section 1) — full-bleed image + overlay title (no flip) */}
      <section
        className="relative mt-5"
        aria-label="Day & Night hero"
      >
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="relative h-[85vh] w-full bg-neutral-200/30">
            <Image
              src="/images/daynight/hero-beach.jpg"
              alt="Day & Night hero photograph"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              className={[
                "pointer-events-none absolute top-1/2 -translate-y-[56%] px-6 text-right",
                "inset-x-0",
                "sm:px-10",
                "lg:inset-x-auto lg:right-[10%] lg:translate-x-[40px]",
              ].join(" ")}
              aria-hidden
            >
              <div className="text-white">
                <div className="text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl [font-family:var(--font-cormorant),serif]">
                  Day &amp; Night
                </div>
                <div className="mt-4 font-mono text-sm font-medium uppercase tracking-[0.4em] text-white/90 sm:text-base">
                  THE GEOMETRY OF SILENCE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote + Triptych — directly under hero, same full-width rail as hero */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#F9F9F9]">
        <section
          className="border-0 bg-[#F9F9F9]"
          aria-label="Gallery introduction"
        >
          <p className="mx-auto max-w-3xl px-4 pt-16 text-center text-lg italic leading-[1.75] tracking-wide text-gray-600 sm:pt-20 sm:text-xl [font-family:var(--font-cormorant),serif]">
            Photography is the art of frozen time—capturing the moments that the
            sun forgets and the moon remembers.
          </p>
        </section>

        <section
          className="pb-24 pt-10"
          aria-label="Triptych gallery"
        >
          {/* Full-bleed row: px-4 = gap-4 so edge↔image distance matches image↔image */}
          <div className="w-full px-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
              <PhotoFlipCard
                src="/images/daynight/p5.png"
                location="Kamakura, Japan"
                time=""
                inspiration="Golden Silence"
                sizes="(max-width: 767px) 100vw, 33vw"
              />
              <PhotoFlipCard
                src="/images/daynight/p1.jpeg"
                location="Discovery Park"
                time=""
                inspiration="Nature Feelin"
                sizes="(max-width: 767px) 100vw, 33vw"
              />
              <PhotoFlipCard
                src="/images/daynight/p9.jpeg"
                location="Seattle"
                time=""
                inspiration="Purple Husky Sunset"
                sizes="(max-width: 767px) 100vw, 33vw"
              />
            </div>
          </div>
        </section>
      </div>

      {/* p12 — light & shadow strip: full viewport width (matches hero / triptych rail) */}
      <section
        className="bg-[#F9F9F9] pt-10 pb-16 sm:pt-12 sm:pb-20"
        aria-label="Light and shadow"
      >
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="flex flex-col bg-[#92DAA5]/40 p-3 sm:flex-row sm:items-center sm:gap-0 sm:p-4">
            <div className="flex w-full shrink-0 justify-center sm:w-[52%] sm:max-w-[52%] sm:justify-start sm:px-3">
              <Image
                src="/images/daynight/p12.jpeg"
                alt="Sunlight and long shadows across a lawn"
                width={P12_WIDTH}
                height={P12_HEIGHT}
                className="h-auto w-full max-w-full object-contain"
                sizes="(max-width: 768px) 100vw, 52vw"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-5 py-8 sm:px-8 sm:py-6 md:px-12 md:py-8">
              <p className="max-w-2xl text-left text-xl font-light leading-[1.55] text-neutral-600 sm:text-2xl sm:leading-[1.5] lg:text-[1.75rem] lg:leading-snug [font-family:var(--font-cormorant),serif]">
                Meet the unpredictable art fun by
                <br />
                light and shadow
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-28 pt-14 sm:pt-16">

        {/* Editorial — The Alleys: 2/3 dual flips + 1/3 title */}
        <section
          className="my-32"
          aria-labelledby="alleys-heading"
        >
          <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
            <div className="min-w-0 lg:w-2/3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {EDITORIAL_ALLEYS.map((item) => (
                  <PhotoFlipCard
                    key={item.src}
                    src={item.src}
                    location={item.location}
                    time={item.time}
                    inspiration={item.inspiration}
                    sizes="(max-width: 640px) 100vw, 30vw"
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full items-center justify-center lg:w-1/3 lg:px-2">
              <h2
                id="alleys-heading"
                className="max-w-md text-center text-2xl font-light leading-relaxed tracking-wide text-neutral-600 sm:text-3xl [font-family:var(--font-cormorant),serif]"
              >
                Beauty hidden in the alleys
              </h2>
            </div>
          </div>
        </section>

        {/* Editorial — The Market: 1/3 title + 2/3 dual flips (mirrored) */}
        <section
          className="my-32"
          aria-labelledby="market-heading"
        >
          <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
            <div className="flex w-full items-center lg:w-1/3 lg:pr-4">
              <h2
                id="market-heading"
                className="w-full max-w-md text-left text-2xl font-light leading-relaxed tracking-wide text-neutral-600 sm:text-3xl [font-family:var(--font-cormorant),serif]"
              >
                Poetry within the marketplace
              </h2>
            </div>
            <div className="min-w-0 lg:w-2/3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {EDITORIAL_MARKET.map((item) => (
                  <PhotoFlipCard
                    key={item.src}
                    src={item.src}
                    location={item.location}
                    time={item.time}
                    inspiration={item.inspiration}
                    sizes="(max-width: 640px) 100vw, 30vw"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Row 3 — full-bleed impact frame */}
        <section
          className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-28 w-screen sm:mt-36"
          aria-label="Featured photograph"
        >
          <div className="relative mx-auto aspect-[21/10] max-h-[min(88vh,900px)] w-full max-w-[1800px] bg-neutral-200/40">
            <Image
              src="/images/daynight/p11.png"
              alt="Day and night — full spread landscape"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
            />
          </div>
        </section>

        <footer className="mt-20 border-t border-neutral-200/80 pt-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            Curated by KeXuan Wang (Coco)
          </p>
        </footer>
      </main>
    </div>
  );
}
