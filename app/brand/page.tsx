import Image from "next/image";
import Link from "next/link";

import { BrandLogoEvolution } from "@/components/brand/BrandLogoEvolution";
import { BrandPositioning } from "@/components/brand/BrandPositioning";
import { BrandPeripheralProducts } from "@/components/brand/BrandPeripheralProducts";

export default function BrandPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            ← Back
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
            Brand
          </span>
        </div>
      </header>

      <main className="grid min-h-[calc(100dvh-57px)] w-full max-w-none grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col justify-center px-8 py-14 md:px-12 md:py-20 lg:px-14 lg:py-24">
          <h1 className="text-left text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl [font-family:var(--font-geist-sans),system-ui,sans-serif]">
            <span className="block">Graphic</span>
            <span className="block">Design</span>
          </h1>
          <p className="mt-5 max-w-sm text-left text-base font-light leading-relaxed text-white/75 sm:text-lg md:mt-6 [font-family:var(--font-geist-sans),system-ui,sans-serif]">
            Brand building and image design
          </p>
        </div>

        {/* 宽度约视口 2/3（与 1fr:2fr 列一致），随视口变化；大屏贴右；顶约 15px */}
        <div className="flex w-full min-w-0 min-h-[min(55vh,520px)] flex-col items-center justify-center pt-[15px] lg:h-full lg:min-h-0 lg:flex-row lg:items-center lg:justify-end lg:pr-0">
          <Image
            src="/images/graphics/p7.jpg"
            alt="Graphic design — Paw &amp; Co brand imagery"
            width={8000}
            height={5334}
            priority
            className="mx-auto h-auto w-[min(100%,66.6667vw)] max-w-full max-h-[min(64vh,calc(100dvh-168px))] object-contain sm:max-h-[min(68vh,calc(100dvh-160px))] lg:mx-0 lg:ml-auto lg:h-auto lg:w-[66.6667vw] lg:max-h-[min(78vh,calc(100dvh-140px))]"
            sizes="(max-width: 1024px) 70vw, 67vw"
          />
        </div>
      </main>

      <BrandLogoEvolution />
      <BrandPositioning />
      <BrandPeripheralProducts />
    </div>
  );
}
