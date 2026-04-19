"use client";

import Image from "next/image";
import { useState } from "react";

const SMOOTH = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const TRANSITION = `all 0.4s ${SMOOTH}`;
const GRID_TRANSITION = `grid-template-rows 0.4s ${SMOOTH}`;

const cnHover =
  "text-gray-500 transition-colors duration-300 hover:text-[#1e4d3e]";

type Competitor = {
  id: string;
  brandEn: string;
  brandZh: string;
  descEn: string;
  descZh: string;
};

const SAME_PRICE: Competitor[] = [
  {
    id: "jo-malone",
    brandEn: "Jo Malone",
    brandZh: "祖玛珑",
    descEn:
      "Minimalist packaging, personalized fragrance mixing, and natural scent notes.",
    descZh: "简约包装，个性化的香氛混合，自然香调。",
  },
  {
    id: "diptyque",
    brandEn: "Diptyque",
    brandZh: "蒂普提克",
    descEn:
      "Renowned for its unique fragrance stories and high-quality raw ingredients.",
    descZh: "以其独特的香氛故事和高质量的原料著称。",
  },
  {
    id: "byredo",
    brandEn: "Byredo",
    brandZh: "百瑞德",
    descEn:
      "Attracts young consumers with modern design and unique fragrance formulas.",
    descZh: "以其现代感的设计和独特的香氛配方吸引年轻消费者。",
  },
];

const SAME_CATEGORY: Competitor[] = [
  {
    id: "cire-trudon",
    brandEn: "Cire Trudon",
    brandZh: "赛尔特鲁登",
    descEn:
      "A historic French candle brand competing through traditional craftsmanship and high-end positioning.",
    descZh:
      "法国历史悠久的香薰品牌，以其传统工艺和高端定位竞争。",
  },
  {
    id: "tom-dixon",
    brandEn: "Tom Dixon",
    brandZh: "汤姆·迪克森",
    descEn:
      "Holds a market presence with innovative packaging design and modern fragrance products.",
    descZh: "以其创新的包装设计和现代感的香氛产品在市场上占有一席之地。",
  },
  {
    id: "le-labo",
    brandEn: "Le Labo",
    brandZh: "勒莱柏",
    descEn:
      "Features handcrafted production and personalized customization services to attract consumers seeking unique experiences.",
    descZh:
      "以其手工制作和个性化定制服务为特色，吸引追求独特体验的消费者。",
  },
];

function CompetitorCard({ item }: { item: Competitor }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${item.brandEn} — competitor note`}
      onMouseEnter={() => setOpen(true)}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      className={`flex h-full min-h-0 w-full min-w-0 flex-1 flex-col rounded-[1.85rem] bg-[rgba(255,255,255,0.95)] shadow-[0_6px_26px_rgba(0,0,0,0.08)] outline-none ring-[#00332E]/25 transition-shadow focus-visible:ring-2 md:basis-0 ${
        open ? "shadow-[0_14px_40px_rgba(0,0,0,0.12)]" : "hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
      }`}
      style={{ transition: TRANSITION }}
    >
      <div className="shrink-0 px-5 py-5 text-center sm:px-6 sm:py-6">
        <p
          className="text-xl font-medium tracking-tight sm:text-2xl [font-family:var(--font-cormorant),serif]"
          style={{ color: "#00332E" }}
        >
          {item.brandEn}
        </p>
        <p
          className="mt-1.5 text-xs leading-snug text-[#00332E]/75 sm:text-[13px]"
          style={{
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          {item.brandZh}
        </p>
      </div>

      <div
        className={`grid min-h-0 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        style={{ transition: GRID_TRANSITION }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`space-y-2 px-5 pb-5 text-center transition-opacity duration-300 ease-out sm:px-6 sm:pb-6 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: open ? "0.05s" : "0s" }}
          >
            <p
              lang="en"
              className="text-[14px] font-light leading-[1.6] text-black/85"
              style={{
                fontFamily:
                  "var(--font-geist-sans), 'Montserrat', ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {item.descEn}
            </p>
            <p
              lang="zh-Hans"
              className="text-[14px] font-light leading-[1.6] text-black/70"
              style={{
                fontFamily:
                  "var(--font-geist-sans), 'Montserrat', ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {item.descZh}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function LoeweCompetitorAnalysis() {
  return (
    <section className="relative overflow-hidden border-t border-black/10 bg-[#B2C2A2] px-6 py-16 md:px-12 md:py-24 lg:px-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundAttachment: "fixed",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Large window lattice — full section, right; restored placement */}
      <div className="pointer-events-none absolute -right-4 bottom-0 top-0 z-0 flex w-[min(55vw,420px)] items-center justify-end opacity-[0.14] md:w-[min(48vw,480px)] md:opacity-[0.18] lg:w-[min(42vw,520px)]">
        <Image
          src="/images/marketing/icon.png"
          alt=""
          width={900}
          height={900}
          className="h-[120%] max-h-none w-auto object-contain object-right"
        />
      </div>

      <div className="relative z-[1] mx-auto max-w-6xl">
        <div className="mb-10 md:mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/70">
            <span className="text-black">Preliminary Analysis</span>
            <span className="text-black/35"> / </span>
            <span className={`${cnHover} normal-case`}>前期分析</span>
          </p>
        </div>

        <div className="space-y-14 md:space-y-16">
          <div>
            <h2 className="mb-8 flex flex-col gap-1 text-xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-2xl [font-family:var(--font-cormorant),serif]">
              <span>Competitor Analysis (Same Price Range)</span>
              <span className={`text-base font-normal text-black/45 md:text-lg ${cnHover}`}>
                同价位竞品分析
              </span>
            </h2>
            <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-5">
              {SAME_PRICE.map((c) => (
                <CompetitorCard key={c.id} item={c} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-8 flex flex-col gap-1 text-xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-2xl [font-family:var(--font-cormorant),serif]">
              <span>Competitor Analysis (Same Category)</span>
              <span className={`text-base font-normal text-black/45 md:text-lg ${cnHover}`}>
                同类别竞品分析
              </span>
            </h2>
            <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-5">
              {SAME_CATEGORY.map((c) => (
                <CompetitorCard key={c.id} item={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
